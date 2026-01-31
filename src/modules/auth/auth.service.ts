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
      { expiresIn: '1h' }
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
    throw new Error('Login failed');
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

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  } catch (error){
    throw new Error('Registration failed');
  }
}