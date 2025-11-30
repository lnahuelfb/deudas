import prisma from '@/config/prisma';

export const findUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  } catch (error) {

  }
}

export const updateUser = async (
  id: string,
  userData: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
  try {
    const user = await prisma.user.update({
      where: { id
       },
      data: userData,
    })
  } catch (error) {

  }
}