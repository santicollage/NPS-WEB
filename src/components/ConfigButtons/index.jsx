import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';
import ChangePasswordModal from '../ChangePasswordModal';
import './ConfigButtons.scss';

const ConfigButtons = () => {
  const dispatch = useDispatch();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="config-buttons">
      <h2>Configuración</h2>
      <button onClick={() => setIsPasswordModalOpen(true)}>
        Cambiar Contraseña
      </button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ConfigButtons;
