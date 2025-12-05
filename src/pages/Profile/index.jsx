import React from 'react';
import './Profile.scss';
import UserInfo from '../../components/UserInfo';
import UserOrders from '../../components/UserOrders';
import ConfigButtons from '../../components/ConfigButtons';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../store/slices/userSelectors';

const Profile = () => {
  const isAdmin = useSelector(selectIsAdmin);
  
  return (
    <div className="profile-page">
      <h1>Perfil del Usuario</h1>
      <UserInfo />
      {isAdmin ? null : <UserOrders />}
      <ConfigButtons />
    </div>
  );
};

export default Profile;
