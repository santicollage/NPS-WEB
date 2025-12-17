import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Filter } from 'lucide-react';
import './StatsLayout.scss';

const SalesChart = ({ data, loading, onPeriodChange, onDateRangeChange }) => {
  const [groupBy, setGroupBy] = useState('day');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handlePeriodToggle = (period) => {
    setGroupBy(period);
    onPeriodChange(period);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // For date inputs, value is YYYY-MM-DD
    const newRange = { ...dateRange, [name]: value };
    setDateRange(newRange);
  };

  const handleApplyFilter = () => {
    onDateRangeChange(dateRange);
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  if (loading) {
     return (
        <div className="chart-container">
            <div className="chart-header">
                <div className="loading-skeleton chart-title"></div>
            </div>
             <div className="loading-skeleton chart-content"></div>
        </div>
     )
  }

  return (
    <div className="chart-container">
      <div className="chart-header stats-filter-header">
        <h3 className="chart-title">Ventas por {groupBy === 'day' ? 'Día' : 'Mes'}</h3>
        <div className="chart-actions">
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
            </button>
          </div>
          <select 
            className="selector" 
            value={groupBy} 
            onChange={(e) => handlePeriodToggle(e.target.value)}
          >
            <option value="day">Por Día</option>
            <option value="month">Por Mes</option>
          </select>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(val) => new Intl.NumberFormat('es-CO', { notation: 'compact' }).format(val)} />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorSales)" 
              name="Ventas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
