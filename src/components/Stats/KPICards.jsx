import React, { useState } from 'react';
import { DollarSign, ShoppingBag, Receipt, Users, TrendingUp, Clock, Filter } from 'lucide-react';
import './StatsLayout.scss';

const KPICard = ({ title, value, icon: Icon, colorClass, subtext }) => (
  <div className={`kpi-card ${colorClass}`}>
    <div className="kpi-icon-wrapper">
      <Icon size={24} />
    </div>
    <div className="kpi-content">
      <div className="kpi-label">{title}</div>
      <h3 className="kpi-value">{value}</h3>
      {subtext && <div className="kpi-trend">{subtext}</div>}
    </div>
  </div>
);

const KPICards = ({ summary, loading, onDateRangeChange }) => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // For date inputs, value is YYYY-MM-DD
    const newRange = { ...dateRange, [name]: value };
    setDateRange(newRange);
  };

  const handleApplyFilter = () => {
    if (onDateRangeChange) {
        onDateRangeChange(dateRange);
    }
  };

  if (loading || !summary) {
    return (
      <div className="kpi-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="kpi-card kpi-card-loading">
            <div className="loading-skeleton full-size"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (val) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  const formatNumber = (val) => 
    new Intl.NumberFormat('es-CO').format(val);

  return (
    <div className="stats-wrapper">
      <div className="stats-filter-container">
        <div className="date-selector">
            <input 
              type="date" 
              name="from" 
              value={dateRange.from} 
              onChange={handleDateChange}
              placeholder="Desde" 
            />
            <span>-</span>
            <input 
              type="date" 
              name="to" 
              value={dateRange.to} 
              onChange={handleDateChange}
              placeholder="Hasta" 
            />
            <button className="filter-btn" onClick={handleApplyFilter} title="Filtrar">
            <Filter size={18} />
            <span>Filtrar</span>
            </button>
        </div>
      </div>
      <div className="kpi-grid">
      <KPICard
        title="Ventas Totales"
        value={formatCurrency(summary.totalSales || 0)}
        icon={DollarSign}
        colorClass="kpi-green"
      />
      
      <KPICard
        title="Pedidos"
        value={formatNumber(summary.totalOrders || 0)}
        icon={ShoppingBag}
        colorClass="kpi-blue"
      />
      
      <KPICard
        title="Ticket Promedio"
        value={formatCurrency(summary.averageTicket || 0)}
        icon={Receipt}
        colorClass="kpi-amber"
      />
 
       <KPICard
        title="Conversión"
        value={`${(summary.conversionRate * 100).toFixed(2)}%`}
        icon={TrendingUp}
        colorClass="kpi-purple"
      />
 
      <KPICard
        title="Tiempo Compra"
        value={`${summary.averagePurchaseTimeMinutes?.toFixed(1) || 0} min`}
        icon={Clock}
        colorClass="kpi-pink"
      />
      </div>
    </div>
  );
};

export default KPICards;
