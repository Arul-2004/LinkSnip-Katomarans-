import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

const ClickChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
        No click activity in this time range.
      </div>
    );
  }

  // Format date for displaying in XAxis
  const chartData = data.map(item => {
    try {
      const date = parseISO(item._id || item.date);
      return {
        ...item,
        dateFormatted: format(date, 'MMM dd'),
        count: item.count || 0
      };
    } catch {
      return {
        ...item,
        dateFormatted: item._id || item.date,
        count: item.count || 0
      };
    }
  });

  return (
    <div style={{ width: '100%', maxWidth: '860px', height: 300, margin: '0' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis 
            dataKey="dateFormatted" 
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            allowDecimals={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'var(--color-bg-dark)', 
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            name="Clicks"
            stroke="var(--color-blue)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClicks)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

};

export default ClickChart;
