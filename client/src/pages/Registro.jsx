import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
  // 1. Estados para guardar lo que el usuario escribe
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState(''); // Para mostrar errores o éxito
  const [cargando, setCargando] = useState(false);

  // Hook para redirigir al usuario a otra página
  const navigate = useNavigate();

  // 2. Función que se ejecuta al enviar el formulario
  const manejarRegistro = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setMensaje('');
    setCargando(true);

    try {
      // Hacemos la petición POST a nuestro backend
      const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        // Si todo sale bien, mostramos mensaje y redirigimos al login
        setMensaje('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        // Si hay error (ej. correo ya registrado)
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
      <h2>Crear Cuenta</h2>
      
      {/* Mensaje de alerta */}
      {mensaje && <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red' }}>{mensaje}</p>}

      <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nombre completo:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

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
            minLength="6"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}

export default Registro;