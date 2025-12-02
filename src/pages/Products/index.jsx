import React from 'react';
import './Products.scss';
import Filters from '../../components/Filters';
import ProductsList from '../../components/ProductsList';
import LineGlow from '../../components/LineGlow';
import SEO from '../../components/SEO/SEO';

const Products = () => {
  return (
    <div className="products-page">
      <SEO 
        title="Productos" 
        description="Explora nuestro catálogo de componentes de alto desempeño. Filtra por categoría, precio y más para encontrar exactamente lo que necesitas."
        keywords="catalogo repuestos, comprar repuestos online, piezas transporte pesado, tienda online nps"
      />
      <section className="section-filters">
        <Filters />
      </section>
      <h1>Componentes de alto desempeño para transporte pesado!</h1>
      <LineGlow width="95%" />
      <section className="section-products">
        <ProductsList />
      </section>
    </div>
  );
};

export default Products;
