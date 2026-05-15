import prisma from '@/config/prisma';
import bcrypt from 'bcrypt';
export const findUserById = async (id) => {
    try {
        return await prisma.user.findUnique({ where: { id } });
    }
    catch (error) {
        return null;
    }
};
export const updateUser = async (id, userData) => {
    try {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        return await prisma.user.update({
            where: { id },
            data: userData,
        });
    }
    catch (error) {
        return null;
    }
};
