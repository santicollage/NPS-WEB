import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';
import './ConfigButtons.scss';

const ConfigButtons = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleEditProfile = () => {
    // Lógica para editar perfil, por ejemplo, navegar a una página de edición
    console.log('Editar perfil');
  };

  return (
    <div className="config-buttons">
      <h2>Configuración</h2>
      <button onClick={handleEditProfile}>Editar Perfil</button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {/* Agregar más botones según sea necesario */}
    </div>
  );
};

export default ConfigButtons;
