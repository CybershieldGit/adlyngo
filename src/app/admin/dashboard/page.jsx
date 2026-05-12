'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import CustomSelect from '@/components/admin/CustomSelect';

export default function DashboardOverview() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [stats, setStats] = useState({ reels: 0, projects: 0, blogs: 0, categories: 0 });
  const [totalStats, setTotalStats] = useState({ reels: 0, projects: 0, blogs: 0, categories: 0 });
  const [timeRange, setTimeRange] = useState(7);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

        const [authRes, totalStatsRes, analyticsRes] = await Promise.all([
          fetch(`${apiUrl}/auth/me`, { credentials: 'include' }),
          fetch(`${apiUrl}/stats`, { credentials: 'include' }),
          fetch(`${apiUrl}/stats?days=${timeRange}`, { credentials: 'include' })
        ]);

        const authData = await authRes.json();
        const totalData = await totalStatsRes.json();
        const analyticsData = await analyticsRes.json();

        if (authRes.ok && authData.success) {
          setAdmin(authData.data.admin);
        } else {
          router.push('/admin/login');
          return;
        }

        if (totalStatsRes.ok && totalData.success) {
          setTotalStats(totalData.data);
        }

        if (analyticsRes.ok && analyticsData.success) {
          setStats(analyticsData.data);
        }

      } catch (err) {
        console.error("Failed to authenticate or fetch data", err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${apiUrl}/stats?days=${timeRange}`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-admin-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Reels', count: stats.reels, color: '#FF5A35' },
    { name: 'Projects', count: stats.projects, color: '#198754' },
    { name: 'Blogs', count: stats.blogs, color: '#ffc107' },
    { name: 'Categories', count: stats.categories, color: '#0dcaf0' },
  ];

  const totalContent = stats.reels + stats.projects + stats.blogs + stats.categories;

  return (
    <div className="admin-dashboard-fade">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
        <div>
          <h2 className="fw-800 text-dark-gray mb-1 fs-2">Dashboard Overview</h2>
          <p className="text-muted mb-0 fs-16">Welcome back, <span className="text-admin-primary fw-600">{admin?.name || 'Admin'}</span>. Here's your site's performance at a glance.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-lg-block">
            <div className="text-muted fs-12 text-uppercase fw-700 ls-1 mb-1">Last Updated</div>
            <div className="fw-600 fs-14">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="bg-success bg-opacity-10 text-success px-3 py-2 rounded-3 d-flex align-items-center gap-2 border border-success border-opacity-10">
            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
            <span className="fw-600 fs-13 text-uppercase ls-1">System Optimal</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-xl-3">
          <div className="card dashboard-card border-0 shadow-sm border-radius-15px p-4 bg-white hover-translate-y transition-all">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="bg-admin-primary bg-opacity-10 text-admin-primary rounded-3 p-3">
                <i className="bi bi-play-btn-fill fs-4"></i>
              </div>
              <div className="text-end">
                <div className="text-muted fs-12 fw-700 text-uppercase">Reels</div>
                <h2 className="mb-0 fw-800">{totalStats.reels}</h2>
              </div>
            </div>
            <div className="progress mb-2" style={{ height: '6px' }}>
              <div className="progress-bar bg-admin-primary" style={{ width: totalContent ? `${(totalStats.reels / (totalStats.reels + totalStats.projects + totalStats.blogs + totalStats.categories)) * 100}%` : '0%' }}></div>
            </div>
            <span className="text-muted fs-12 fw-500">Live on homepage</span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card dashboard-card border-0 shadow-sm border-radius-15px p-4 bg-white hover-translate-y transition-all">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="bg-success bg-opacity-10 text-success rounded-3 p-3">
                <i className="bi bi-briefcase-fill fs-4"></i>
              </div>
              <div className="text-end">
                <div className="text-muted fs-12 fw-700 text-uppercase">Case Studies</div>
                <h2 className="mb-0 fw-800">{totalStats.projects}</h2>
              </div>
            </div>
            <div className="progress mb-2" style={{ height: '6px' }}>
              <div className="progress-bar bg-success" style={{ width: totalContent ? `${(totalStats.projects / (totalStats.reels + totalStats.projects + totalStats.blogs + totalStats.categories)) * 100}%` : '0%' }}></div>
            </div>
            <span className="text-muted fs-12 fw-500">Portfolio case studies</span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card dashboard-card border-0 shadow-sm border-radius-15px p-4 bg-white hover-translate-y transition-all">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3">
                <i className="bi bi-journal-richtext fs-4"></i>
              </div>
              <div className="text-end">
                <div className="text-muted fs-12 fw-700 text-uppercase">Blogs</div>
                <h2 className="mb-0 fw-800">{totalStats.blogs}</h2>
              </div>
            </div>
            <div className="progress mb-2" style={{ height: '6px' }}>
              <div className="progress-bar bg-warning" style={{ width: totalContent ? `${(totalStats.blogs / (totalStats.reels + totalStats.projects + totalStats.blogs + totalStats.categories)) * 100}%` : '0%' }}></div>
            </div>
            <span className="text-muted fs-12 fw-500">Published articles</span>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card dashboard-card border-0 shadow-sm border-radius-15px p-4 bg-white hover-translate-y transition-all">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="bg-info bg-opacity-10 text-info rounded-3 p-3">
                <i className="bi bi-collection-fill fs-4"></i>
              </div>
              <div className="text-end">
                <div className="text-muted fs-12 fw-700 text-uppercase">Categories</div>
                <h2 className="mb-0 fw-800">{totalStats.categories}</h2>
              </div>
            </div>
            <div className="progress mb-2" style={{ height: '6px' }}>
              <div className="progress-bar bg-info" style={{ width: totalContent ? `${(totalStats.categories / (totalStats.reels + totalStats.projects + totalStats.blogs + totalStats.categories)) * 100}%` : '0%' }}></div>
            </div>
            <span className="text-muted fs-12 fw-500">Content taxonomies</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Graph Card */}
        <div className="col-lg-8">
          <div className="card analytics-card border-0 shadow-sm border-radius-15px p-4 bg-white h-100 position-relative">
            {analyticsLoading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10, borderRadius: '15px' }}>
                <div className="spinner-border text-admin-primary spinner-border-sm" role="status"></div>
              </div>
            )}
            <div className="d-flex align-items-center justify-content-between mb-5">
              <h5 className="fw-700 mb-0">Content Analytics</h5>
              <div style={{ minWidth: '150px' }}>
                <CustomSelect
                  options={[
                    { label: 'Last 7 Days', value: 7 },
                    { label: 'Last 30 Days', value: 30 },
                    { label: 'All Time', value: 0 }
                  ]}
                  value={timeRange}
                  onChange={(val) => setTimeRange(val)}
                  placeholder="Select Range"
                />
              </div>
            </div>
            <div style={{ height: '420px', width: '100%' }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                    interval={0}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#fcfcfc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={45}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Total & Distribution Summary */}
        <div className="col-lg-4">
          <div className="card summary-card border-0 shadow-sm border-radius-15px p-4 bg-white h-100">
            <h5 className="fw-700 mb-4 text-center">Summary</h5>

            <div className="position-relative d-flex justify-content-center align-items-center mb-4" style={{ minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="position-absolute text-center">
                <div className="text-muted fs-11 text-uppercase fw-700 ls-1">Total</div>
                <div className="fw-800 fs-1 mb-0 lh-1">{totalContent}</div>
              </div>
            </div>

            <div className="space-y-3">
              {chartData.map((item, idx) => (
                <div key={idx} className="summary-item p-3 rounded-3 bg-light bg-opacity-50 mb-2">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle me-3" style={{ width: '10px', height: '10px', backgroundColor: item.color }}></div>
                    <span className="fw-600 fs-14 text-dark-gray">{item.name}</span>
                  </div>
                  <span className="fw-700 fs-14">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
