import prisma from '@/config/prisma';
import bcrypt from 'bcrypt';

export const findUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
};

export const updateUser = async (
  id: string,
  userData: { name?: string; email?: string; password?: string }
) => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  } catch (error) {
    return null;
  }
};
