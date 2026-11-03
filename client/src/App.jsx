import { useState } from 'react';
import './App.css';

function App() {
  // 1. Creamos el "estado" para guardar el texto del input
  const [correo, setCorreo] = useState('');

  // 2. Esta función se ejecuta cuando hacemos clic en el botón
  const probarConexion = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          correo: correo, 
          contrasena: '123456' // Contraseña de prueba
        })
      });

      const datos = await respuesta.json();
      console.log('Respuesta del Backend:', datos);
      
      if (datos.ok) {
        alert('¡Login exitoso! Revisa la consola (F12) para ver el token.');
      } else {
        alert('Error: ' + datos.mensaje);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>JAY-wallet</h1>
      <p>Prueba de conexión Frontend - Backend</p>
      
      {/* 3. El input que actualiza el estado cada vez que escribes */}
      <input 
        type="email" 
        placeholder="Escribe yilmar@prueba.com"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)} // Esto guarda lo que escribes en la variable 'correo'
        style={{ padding: '10px', fontSize: '16px' }}
      />
      
      <button 
        onClick={probarConexion}
        style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px' }}
      >
        Probar Login
      </button>
    </div>
  );
}

export default App;