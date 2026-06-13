import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import ClickChart from '../../components/ClickChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { FiLink, FiBarChart2, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await analyticsAPI.getDashboardSummary();
        if (res.data?.success) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching analytics overview:', err);
        toast.error('Failed to load analytics overview');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const chartData = summary?.dailyClicks?.map(item => ({
    date: item.date,
    count: item.clicks
  })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Review link clicks and campaign trends across your entire account.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
        <StatsCard
          title="Total Links"
          value={summary?.totalLinks || 0}
          icon={<FiLink />}
          color="blue"
        />
        <StatsCard
          title="Total Clicks"
          value={summary?.totalClicks || 0}
          icon={<FiBarChart2 />}
          color="orange"
        />
        <StatsCard
          title="Created Today"
          value={summary?.linksToday || 0}
          icon={<FiCalendar />}
          color="green"
        />
      </div>

      {/* Aggregate click trend chart */}
      <div className="card">
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Overall Clicks (Last 7 Days)
        </h2>
        {chartData.length === 0 || chartData.every(c => c.count === 0) ? (
          <p style={{ color: 'var(--color-text-secondary)', padding: 'var(--space-8) 0', textAlign: 'center' }}>
            No clicks recorded on your links in the last 7 days.
          </p>
        ) : (
          <ClickChart data={chartData} />
        )}
      </div>

      {/* Top Performing Link Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>
            <FiTrendingUp />
          </div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0 }}>
            Top Performing Link
          </h2>
        </div>

        {summary?.topLink ? (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4)',
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-md)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '2px' }} className="truncate">
                {summary.topLink.title || summary.topLink.shortCode}
              </h3>
              <a href={summary.topLink.shortUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--color-blue)', fontSize: 'var(--font-size-sm)' }}>
                {summary.topLink.shortUrl.replace(/^https?:\/\//, '')}
              </a>
              <p className="truncate" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {summary.topLink.originalUrl}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{summary.topLink.totalClicks}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>CLICKS</div>
              </div>
              <Link to={`/dashboard/links/${summary.topLink.id || summary.topLink._id}`} className="btn btn-outline btn-sm">
                View Details
              </Link>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-secondary)' }}>You don't have any links with clicks yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
