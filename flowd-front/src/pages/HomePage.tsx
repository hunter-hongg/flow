import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, useMediaQuery, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';

interface FlowData {
  id: number;
  dir: string;
  success: number;
  failure: number;
  last_duration: number;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlowData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/flow');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setFlowData(result.data ?? []);
    } catch (err) {
      setError('Error fetching data. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowData();
  }, []);

  const chartColors = {
    success: theme.palette.success.main,
    failure: theme.palette.error.main,
    duration: theme.palette.primary.main,
    text: theme.palette.text.secondary,
    grid: theme.palette.divider,
    tooltipBg: theme.palette.background.default,
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box 
        sx={{ 
          my: { xs: 3, sm: 5 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'space-between' }, 
          alignItems: { xs: 'center', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          animation: 'fadeIn 0.5s ease-in-out'
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Welcome to Flowd
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchFlowData}
          disabled={loading}
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 0.75, sm: 1 },
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              opacity: 0.6,
              transform: 'none',
              boxShadow: 'none'
            }
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Refresh'}
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
          <CircularProgress size={isMobile ? 40 : 56} thickness={3.5} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 4, 
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          {error}
        </Alert>
      ) : !flowData || flowData.length === 0 ? (
        <Paper 
          sx={{ 
            p: { xs: 5, sm: 7 }, 
            mt: 4,
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out',
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              mb: 2
            }}
          >
            No Data Available
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'text.secondary',
              opacity: 0.7,
              mb: 3
            }}
          >
            There is no flow data to display. Please check back later or ensure data is being collected.
          </Typography>
        </Paper>
      ) : (
        <Paper 
          sx={{ 
            p: { xs: 2.5, sm: 4 }, 
            mt: 4,
            animation: 'slideUp 0.5s ease-out',
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{
              fontWeight: 600,
              mb: 2.5,
              color: 'text.primary'
            }}
          >
            Flow Results
          </Typography>
          <Box sx={{ height: { xs: 350, sm: 500 }, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={flowData}
                margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 150 : 130 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                  horizontal={true}
                />
                {flowData.map((item, index) =>
                  index % 2 === 0 ? (
                    <ReferenceArea
                      key={`band-${index}`}
                      x1={item.dir}
                      x2={item.dir}
                      fill="rgba(255, 255, 255, 0.03)"
                    />
                  ) : null
                )}
                <XAxis
                  dataKey="dir"
                  tickFormatter={(dir) => dir.split('/').pop() || dir}
                  angle={isMobile ? -60 : -45}
                  textAnchor="end"
                  height={isMobile ? 140 : 120}
                  interval={0}
                  tick={{ fill: chartColors.text, fontSize: isMobile ? 11 : 13 }}
                  axisLine={{ stroke: chartColors.grid }}
                  tickLine={{ stroke: chartColors.grid }}
                />
                <YAxis
                  yAxisId="left"
                  allowDecimals={false}
                  tick={{ fill: chartColors.text, fontSize: isMobile ? 11 : 13 }}
                  axisLine={{ stroke: chartColors.grid }}
                  tickLine={{ stroke: chartColors.grid }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: chartColors.text, fontSize: isMobile ? 11 : 13 }}
                  axisLine={{ stroke: chartColors.grid }}
                  tickLine={{ stroke: chartColors.grid }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'last_duration') {
                      return [`${Number(value).toFixed(2)}s`, 'Last Duration'];
                    }
                    if (name === 'success') {
                      return [value, 'Success'];
                    }
                    if (name === 'failure') {
                      return [value, 'Failure'];
                    }
                    return [`${value}`, name];
                  }}
                  labelFormatter={(label) => `Directory: ${label}`}
                  contentStyle={{
                    backgroundColor: chartColors.tooltipBg,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '10px',
                    color: theme.palette.text.primary,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '1rem',
                    fontSize: isMobile ? '0.8rem' : '0.9rem'
                  }}
                  formatter={(value) => {
                    if (value === 'Success') {
                      return <span style={{ color: chartColors.success, fontWeight: 500 }}>{value}</span>;
                    } else if (value === 'Failure') {
                      return <span style={{ color: chartColors.failure, fontWeight: 500 }}>{value}</span>;
                    } else if (value === 'Last Duration') {
                      return <span style={{ color: chartColors.duration, fontWeight: 500 }}>{value}</span>;
                    }
                    return <span style={{ color: chartColors.text }}>{value}</span>;
                  }}
                />
                <Bar
                  dataKey="success"
                  fill={chartColors.success}
                  name="Success"
                  maxBarSize={isMobile ? 30 : 48}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="failure"
                  fill={chartColors.failure}
                  name="Failure"
                  maxBarSize={isMobile ? 30 : 48}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="last_duration"
                  fill={chartColors.duration}
                  name="Last Duration"
                  yAxisId="right"
                  maxBarSize={isMobile ? 30 : 48}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ mt: 8, textAlign: 'center', animation: 'fadeIn 0.5s ease-in-out 0.3s both' }}>
        <Typography variant="body2" color="text.secondary">
          Flowd Dashboard • Real-time flow analysis
        </Typography>
      </Box>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 600px) {
          .MuiContainer-root {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </Container>
  );
};

export default HomePage;
