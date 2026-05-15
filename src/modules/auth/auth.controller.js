import * as authSchema from './auth.schema';
import * as authService from './auth.service';
export const login = async (req, res) => {
    try {
        const loginData = authSchema.AuthLoginSchema.safeParse(req.body);
        if (!loginData.success) {
            return res.status(400).json({
                error: 'Invalid login data',
                details: loginData.error
            });
        }
        const data = await authService.loginUser(loginData.data);
        res.cookie("token", data.token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        });
        return res.status(200).json(data);
    }
    catch (err) {
        console.error('Error occurred while logging in:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        console.error('Error occurred while logging out:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const register = async (req, res) => {
    try {
        const registerData = authSchema.AuthRegisterSchema.safeParse(req.body);
        if (!registerData.success) {
            return res.status(400).json({
                error: 'Invalid registration data',
                details: registerData.error
            });
        }
        const newUser = await authService.registerUser(registerData.data);
        return res.status(201).json(newUser);
    }
    catch (err) {
        console.error('Error occurred while registering user:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await authService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            monthlySpendingLimit: user.monthlySpendingLimit
        });
    }
    catch (err) {
        console.error('Error occurred while fetching user data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        await authService.forgotPassword(email);
        return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        await authService.resetPassword(token, newPassword);
        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        console.error(error);
        if (error.message === 'INVALID_OR_EXPIRED_TOKEN') {
            return res.status(400).json({ error: 'El enlace es inválido o ha expirado' });
        }
        return res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
};
