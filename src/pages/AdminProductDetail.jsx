import React from 'react';

const AdminProductDetail = ({ modal }) => {
  return (
    <div>
      <h1>
        {modal
          ? 'Admin Product Detail Modal'
          : 'Admin Product Detail Standalone Page'}
      </h1>
    </div>
  );
};

export default AdminProductDetail;
