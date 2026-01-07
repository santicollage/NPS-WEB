import React from 'react';
import { Users, Package, UserPlus } from 'lucide-react';
import './StatsLayout.scss';

export const TopProducts = ({ products, loading }) => {
  if (loading) return <div className="loading-skeleton products-table"></div>;

  const formatCurrency = (val) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Top Productos Más Vendidos</h3>
        <Package size={20} color="#6c757d" />
      </div>
      <div className="table-responsive">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>U. Vendidas</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((prod) => (
              <tr key={prod.productId}>
                <td className="stats-table-name">{prod.name}</td>
                <td>{prod.unitsSold}</td>
                <td>{formatCurrency(prod.revenue)}</td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan="3" className="stats-table-empty">No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CustomerStats = ({ stats, loading }) => {
  if (loading) return <div className="loading-skeleton stats-box"></div>;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Clientes Recurrentes</h3>
        <Users size={20} color="#6c757d" />
      </div>
      <div className="stats-content-flex">
        <div className="stats-badge blue">
          {stats?.recurrentCustomers || 0}
        </div>
        <div>
          <p className="stats-text-muted">Clientes con 2+ compras</p>
          <p className="stats-text-description">
            Base de clientes fieles
          </p>
        </div>
      </div>
    </div>
  );
};

export const NewCustomers = ({ stats, loading }) => {
  if (loading) return <div className="loading-skeleton stats-box"></div>;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Nuevos Clientes (Mes)</h3>
        <UserPlus size={20} color="#6c757d" />
      </div>
      <div className="stats-content-flex">
        <div className="stats-badge green">
          +{stats?.newThisMonth || 0}
        </div>
        <div>
          <p className="stats-text-muted">Registrados este mes</p>
          <p className="stats-text-description">
             Crecimiento de base
          </p>
        </div>
      </div>
    </div>
  );
};
