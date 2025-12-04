import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';
import { selectIsAdmin } from '../../store/slices/userSelectors';
import ChangePasswordModal from '../ChangePasswordModal';
import ManageUsersModal from '../ManageUsersModal';
import './ConfigButtons.scss';

const ConfigButtons = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="config-buttons">
      <h2>Configuración</h2>
      
      {isAdmin && (
        <button onClick={() => setIsManageUsersModalOpen(true)}>
          Gestionar Usuarios
        </button>
      )}
      
      <button onClick={() => setIsPasswordModalOpen(true)}>
        Cambiar Contraseña
      </button>
      
      <button onClick={handleLogout}>Cerrar Sesión</button>
      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      
      <ManageUsersModal
        isOpen={isManageUsersModalOpen}
        onClose={() => setIsManageUsersModalOpen(false)}
      />
    </div>
  );
};

export default ConfigButtons;
