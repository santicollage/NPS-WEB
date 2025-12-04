import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';
import './ConfigButtons.scss';

const ConfigButtons = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="config-buttons">
      <h2>Configuración</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default ConfigButtons;
