import React from 'react';
import './ProductDetail.scss';

const ProductDetail = ({ modal }) => {
  return (
    <div>
      <h1>
        {modal ? 'Product Detail Modal' : 'Product Detail Standalone Page'}
      </h1>
    </div>
  );
};

export default ProductDetail;
