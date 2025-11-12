import React from 'react';
import './Products.scss';
import Filters from '../../components/Filters';
import ProductsList from '../../components/ProductsList';
import LineGlow from '../../components/LineGlow';

const Products = () => {
  return (
    <div className="products-page">
      <section>
        <Filters />
      </section>
      <h1>Componentes de alto desempeño para transporte pesado!</h1>
      <LineGlow width="95%" />
      <section>
        <ProductsList />
      </section>
    </div>
  );
};

export default Products;
