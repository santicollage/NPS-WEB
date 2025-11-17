import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/userSelectors';
import { updateUser } from '../../store/slices/userSlice';
import UserInfoModal from '../UserInfoModal';
import './UserInfo.scss';
import EditIcon from '../../assets/icons/EditIcon';

const UserInfo = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <div>Cargando información del usuario...</div>;
  }

  const fillableFields = [
    user.name,
    user.phone,
    user.city,
    user.department,
    user.address_line,
    user.postal_code,
  ];
  const filledCount = fillableFields.filter((field) => field !== null).length;
  const totalFillable = 5;
  const percentage = Math.round((filledCount / totalFillable) * 100);

  const handleUpdateUser = (updateData) => {
    dispatch(updateUser({ userId: user.user_id, updateData }));
  };

  return (
    <>
      <div className="user-info">
        <button className="edit-button" onClick={() => setIsModalOpen(true)}>
          <EditIcon />
        </button>
        <h2>{user.name}</h2>
        <div className="profile-completion">
          <p>Perfil completado: {percentage}%</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="user-content">
          {user.image_url && (
            <div className="user-image-container">
              <img
                src={user.image_url}
                alt="Foto de perfil"
                className="user-image"
              />
            </div>
          )}
          <div className="user-details">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <div className="group-info">
              <p>
                <strong>Teléfono:</strong> {user.phone || '-----'}
              </p>
              <p>
                <strong>Ciudad:</strong> {user.city || '-----'}
              </p>
            </div>
            <p>
              <strong>Departamento:</strong> {user.department || '-----'}
            </p>
            <p>
              <strong>Dirección:</strong> {user.address_line || '-----'}
            </p>
            <p>
              <strong>Código Postal:</strong> {user.postal_code || '-----'}
            </p>
          </div>
        </div>
      </div>
      <UserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />
    </>
  );
};

export default UserInfo;
