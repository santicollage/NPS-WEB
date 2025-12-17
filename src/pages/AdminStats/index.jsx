import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStatsSummary,
  fetchSalesData,
  fetchTopProducts,
  fetchCustomerStats,
  fetchConversionStats,
  fetchPurchaseTimeStats
} from '../../store/slices/statsSlice';
import {
  selectStatsSummary,
  selectSalesData,
  selectTopProducts,
  selectCustomerStats,
  selectPurchaseTimeStats,
  selectStatsLoading
} from '../../store/slices/statsSelectors';

import KPICards from '../../components/Stats/KPICards';
import SalesChart from '../../components/Stats/SalesChart';
import { TopProducts, CustomerStats, NewCustomers } from '../../components/Stats/Insights';
import '../../components/Stats/StatsLayout.scss';

const AdminStats = () => {
  const dispatch = useDispatch();
  const summary = useSelector(selectStatsSummary);
  const salesData = useSelector(selectSalesData);
  const topProducts = useSelector(selectTopProducts);
  const customerStats = useSelector(selectCustomerStats);
  const purchaseTimeStats = useSelector(selectPurchaseTimeStats);
  const loading = useSelector(selectStatsLoading);

  // Initial fetch on mount
  useEffect(() => {
    dispatch(fetchStatsSummary());
    dispatch(fetchSalesData()); // default by day
    dispatch(fetchTopProducts());
    dispatch(fetchCustomerStats());
    dispatch(fetchConversionStats()); // fetched but used in KPI for now
    dispatch(fetchPurchaseTimeStats());
  }, [dispatch]);

  const handlePeriodChange = (period) => {
    dispatch(fetchSalesData({ groupBy: period }));
  };

  const handleDateRangeChange = ({ from, to }) => {
    // Sales Chart specific range
    if ((from && to) || (!from && !to)) {
        dispatch(fetchSalesData({ from, to }));
    }
  };

  const handleKPIDateRangeChange = ({ from, to }) => {
     // Check if we have valid dates or empty reset
     if ((from && to) || (!from && !to)) {
        dispatch(fetchStatsSummary({ from, to }));
    }
  };

  return (
    <div className="stats-dashboard">
      <div className="stats-grid">
        <h1 className="text-2xl font-bold mb-4">Panel de Estadísticas</h1>
        
        {/* Row 1: KPI Cards */}
        <section>
          <KPICards 
            summary={summary} 
            loading={loading.summary} 
            onDateRangeChange={handleKPIDateRangeChange}
          />
        </section>

        {/* Row 2: Sales Chart */}
        <section>
          <SalesChart 
            data={salesData} 
            loading={loading.sales} 
            onPeriodChange={handlePeriodChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </section>

        {/* Row 3: Insights */}
        <section className="insights-grid">
          <TopProducts products={topProducts} loading={loading.topProducts} />
          <CustomerStats stats={customerStats} loading={loading.customerStats} />
          <NewCustomers stats={customerStats} loading={loading.customerStats} />
        </section>
      </div>
    </div>
  );
};

export default AdminStats;
