import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      { expiresIn: '30d' }
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
      throw new Error('User creation failed');
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true
      },
      where: { id: userId },
    });

    if (!user){
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}