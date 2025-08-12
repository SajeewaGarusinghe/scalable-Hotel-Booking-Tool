import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { DashboardStats, QuickStats, TrendData } from '../types/analytics';

export const useDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<TrendData[]>([]);
  const [occupancyTrend, setOccupancyTrend] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both dashboard stats and quick stats in parallel
      const [dashboardData, quickData] = await Promise.all([
        AnalyticsService.getDashboardStatistics(),
        AnalyticsService.getQuickStatistics()
      ]);

      // Handle the API typo for revenue trend
      const revenueTrendData = dashboardData.revenueTrend || dashboardData.revenueTrind || [];
      setRevenueTrend(revenueTrendData);
      
      // Set occupancy trend
      setOccupancyTrend(dashboardData.occupancyTrend || []);

      setDashboardStats(dashboardData);
      setQuickStats(quickData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardStats,
    quickStats,
    revenueTrend,
    occupancyTrend,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
