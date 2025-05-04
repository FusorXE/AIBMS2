import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress,
  Alert,
  IconButton
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BatteryAlertOutlined, BatteryChargingFull, BatteryFull } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { fetchBatteryStats, fetchAlerts } from '../services/api';

const Dashboard = () => {
  const [batteryStats, setBatteryStats] = useState({
    total: 0,
    healthy: 0,
    warning: 0,
    critical: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const stats = await fetchBatteryStats();
        const alertsData = await fetchAlerts();
        setBatteryStats(stats);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBatteryClick = (batteryId) => {
    navigate(`/batteries/${batteryId}`);
  };

  const batteryStatusData = [
    { status: 'Healthy', value: batteryStats.healthy },
    { status: 'Warning', value: batteryStats.warning },
    { status: 'Critical', value: batteryStats.critical }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Battery Status Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Batteries
              </Typography>
              <Typography variant="h3">
                {batteryStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Healthy
              </Typography>
              <Typography variant="h3">
                {batteryStats.healthy}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(batteryStats.healthy / batteryStats.total) * 100} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alerts
              </Typography>
              <Typography variant="h3">
                {alerts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Battery Status Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Battery Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={batteryStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              {alerts.slice(0, 5).map((alert) => (
                <Alert
                  key={alert.id}
                  severity={alert.severity.toLowerCase()}
                  sx={{ mb: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {alert.severity === 'CRITICAL' ? (
                      <BatteryAlertOutlined sx={{ mr: 1 }} />
                    ) : alert.severity === 'WARNING' ? (
                      <BatteryChargingFull sx={{ mr: 1 }} />
                    ) : (
                      <BatteryFull sx={{ mr: 1 }} />
                    )}
                    {alert.message}
                    <IconButton
                      size="small"
                      onClick={() => handleBatteryClick(alert.battery_id)}
                      sx={{ ml: 'auto' }}
                    >
                      View
                    </IconButton>
                  </Box>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
