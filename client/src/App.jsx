import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Barra de navegación temporal para movernos */}
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/registro">Registro</Link>
      </nav>

      {/* Aquí es donde React inyecta la página según la URL */}
      <Routes>
        <Route path="/" element={<h2>Bienvenido a JAY-wallet</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </div>
  );
}

export default App;