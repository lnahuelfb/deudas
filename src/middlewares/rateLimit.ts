import rateLimit from 'express-rate-limit';

// Limitador general para toda la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true, // Devuelve info de límite en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
});

// Limitador estricto para Auth (Login/Registro)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos (un poco más permisivo para el dev, pero seguro)
  message: {
    error: 'Demasiados intentos de acceso. Por seguridad, hemos bloqueado las peticiones por 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
