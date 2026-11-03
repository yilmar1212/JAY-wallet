import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        // ¡AQUÍ GUARDAMOS EL TOKEN! En la memoria del navegador (localStorage)
        localStorage.setItem('token_jaywallet', datos.token);
        localStorage.setItem('usuario_jaywallet', JSON.stringify(datos.usuario));
        
        setMensaje('¡Login exitoso! Entrando al sistema...');
        
        // Redirigimos a la página principal (la crearemos luego)
        setTimeout(() => navigate('/'), 1500); 
      } else {
        setMensaje(datos.mensaje);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Iniciar Sesión</h2>
      
      {mensaje && <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red' }}>{mensaje}</p>}

      <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Correo electrónico:</label>
          <input 
            type="email" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;