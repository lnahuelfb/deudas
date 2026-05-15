import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../lib/mail";

type LoginData = {
  email: string;
  password: string;
};

export const loginUser = async (loginData: LoginData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });


    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };

  } catch (error) {
    console.error(error)
    throw error
  }
}

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async (registerData: RegisterData) => {
  try {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: registerData.name,
        email: registerData.email,
        password: hashedPassword,
      },
    })

    if (!newUser) {
      throw new Error();
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        monthlySpendingLimit: true
      },
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetExpires: expires,
    },
  });

  await sendPasswordResetEmail(email, token);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("INVALID_OR_EXPIRED_TOKEN");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetExpires: null,
    },
  });
};