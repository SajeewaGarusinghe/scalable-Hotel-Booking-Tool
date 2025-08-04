import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { DashboardStats, QuickStats } from '../types/analytics';

export const useDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
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
    loading,
    error,
    refetch: fetchDashboardData
  };
};
