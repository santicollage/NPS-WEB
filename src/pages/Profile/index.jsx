import React from 'react';
import './Profile.scss';
import UserInfo from '../../components/UserInfo';
import UserOrders from '../../components/UserOrders';
import ConfigButtons from '../../components/ConfigButtons';

const Profile = () => {
  return (
    <div className="profile-page">
      <h1>Perfil del Usuario</h1>
      <UserInfo />
      <UserOrders />
      <ConfigButtons />
    </div>
  );
};

export default Profile;
