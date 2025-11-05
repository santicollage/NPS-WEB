import React from 'react';

const AdminOrderDetail = ({ modal }) => {
  return (
    <div>
      <h1>
        {modal
          ? 'Admin Order Detail Modal'
          : 'Admin Order Detail Standalone Page'}
      </h1>
    </div>
  );
};

export default AdminOrderDetail;
