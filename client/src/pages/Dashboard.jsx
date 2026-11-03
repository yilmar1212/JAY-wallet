import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // useEffect se ejecuta cuando la pantalla carga
  useEffect(() => {
    // 1. Buscamos el token y el usuario en la memoria del navegador
    const token = localStorage.getItem('token_jaywallet');
    const usuarioGuardado = localStorage.getItem('usuario_jaywallet');

    // 2. Si no hay token, lo devolvemos al Login (Ruta Protegida)
    if (!token) {
      navigate('/login');
    } else {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('token_jaywallet');
    localStorage.removeItem('usuario_jaywallet');
    navigate('/login');
  };

  // Si el usuario aún no carga, no mostramos nada
  if (!usuario) return null;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <h2>👋 Hola, {usuario.nombre}</h2>
        <button onClick={cerrarSesion} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Panel Principal</h3>
        <p>Aquí irá la estadística de préstamos y la lista de deudores.</p>
      </div>
    </div>
  );
}

export default Dashboard;