import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  BatteryFull,
  BatteryChargingFull,
  BatteryAlertOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchBatteries, 
  deleteBattery,
  updateBatteryStatus
} from '../services/api';

const BatteryManagement = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchBatteriesData = async () => {
      try {
        const data = await fetchBatteries();
        setBatteries(data);
      } catch (error) {
        console.error('Error fetching batteries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteriesData();
  }, []);

  const handleEdit = (batteryId) => {
    navigate(`/batteries/${batteryId}/edit`);
  };

  const handleDelete = async (batteryId) => {
    if (window.confirm('Are you sure you want to delete this battery?')) {
      try {
        await deleteBattery(batteryId);
        setBatteries(batteries.filter(battery => battery.id !== batteryId));
      } catch (error) {
        console.error('Error deleting battery:', error);
      }
    }
  };

  const getBatteryIcon = (status) => {
    switch (status) {
      case 'HEALTHY':
        return <BatteryFull color="success" />;
      case 'WARNING':
        return <BatteryChargingFull color="warning" />;
      case 'CRITICAL':
        return <BatteryAlertOutlined color="error" />;
      default:
        return <BatteryFull />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Battery Management
        </Typography>
        <Tooltip title="Add New Battery">
          <IconButton onClick={() => navigate('/batteries/new')}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Battery Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Batteries
                </Typography>
                <Typography variant="h3">
                  {batteries.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Battery Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Health Score</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {batteries.map((battery) => (
                        <TableRow key={battery.id}>
                          <TableCell>{battery.id}</TableCell>
                          <TableCell>{battery.name}</TableCell>
                          <TableCell>{battery.type}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getBatteryIcon(battery.status)}
                              <Typography sx={{ ml: 1 }}>
                                {battery.status}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {battery.health_score}%
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(battery.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(battery.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BatteryManagement;
