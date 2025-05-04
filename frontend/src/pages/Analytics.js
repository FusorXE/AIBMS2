import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BatteryFull, 
  TemperatureHigh, 
  TrendingUp, 
  TrendingDown
} from '@mui/icons-material';
import { fetchBatteryAnalytics } from '../services/api';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [analyticsData, setAnalyticsData] = useState({
    health: [],
    temperature: [],
    performance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await fetchBatteryAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getIconForStatus = (status) => {
    switch (status) {
      case 'IMPROVING':
        return <TrendingUp color="success" />;
      case 'DECLINING':
        return <TrendingDown color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Battery Analytics
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Health" value="health" />
          <Tab label="Temperature" value="temperature" />
          <Tab label="Performance" value="performance" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Health Tab Content */}
          {activeTab === 'health' && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Health Score Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.health}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2196f3" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Temperature Tab Content */}
          {activeTab === 'temperature' && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Temperature Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.temperature}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#f44336" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Performance Tab Content */}
          {activeTab === 'performance' && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    {analyticsData.performance.map((metric, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {metric.icon}
                              <Typography variant="h6" sx={{ ml: 1 }}>
                                {metric.name}
                              </Typography>
                            </Box>
                            <Typography variant="h3">
                              {metric.value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              {getIconForStatus(metric.trend)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {metric.trend}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;
