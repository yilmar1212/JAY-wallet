import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // 1. El token suele venir en los "Headers" de la petición (Authorization: Bearer <token>)
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ ok: false, mensaje: 'Acceso denegado. No hay token.' });
  }

  // 2. Quitamos la palabra "Bearer " para quedarnos solo con el token
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Formato de token inválido.' });
  }

  try {
    // 3. Verificamos que el token sea real y no esté vencido usando nuestro secreto
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Guardamos los datos del usuario en la petición (req) para usarlos en los controladores
    req.usuario = verificado; 
    
    // 5. ¡Dale paso al siguiente! (al controlador)
    next(); 
  } catch (error) {
    res.status(401).json({ ok: false, mensaje: 'Token inválido o vencido.' });
  }
};