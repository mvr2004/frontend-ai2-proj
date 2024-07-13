import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);
    const [subareaCount, setSubareaCount] = useState(0);
    const [areaCount, setAreaCount] = useState(0);
    const [activeReports, setActiveReports] = useState(0);
    const [resolvedReports, setResolvedReports] = useState(0);
    const [totalCentros, setTotalCentros] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: { totalUsers, activeUsers, inactiveUsers } },
                    { data: { subareaCount, areaCount } },
                    { data: { activeReports, resolvedReports } },
                    { data: { totalCentros } }
                ] = await Promise.all([
                    axios.get('https://backend-ai2-proj.onrender.com/user/count'),
                    axios.get('https://backend-ai2-proj.onrender.com/area/count-subareas-and-areas'),
                    axios.get('https://backend-ai2-proj.onrender.com/report/count-reports'),
                    axios.get('https://backend-ai2-proj.onrender.com/centro/count')
                ]);

                setTotalUsers(totalUsers);
                setActiveUsers(activeUsers);
                setInactiveUsers(inactiveUsers);
                setSubareaCount(subareaCount);
                setAreaCount(areaCount);
                setActiveReports(activeReports);
                setResolvedReports(resolvedReports);
                setTotalCentros(totalCentros);
            } catch (error) {
                console.error('Erro ao buscar dados do backend:', error);
                setError('Erro ao buscar dados do backend');
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Total de Usuários</Typography>
                    <Typography variant="h4">{totalUsers}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Usuários Ativos</Typography>
                    <Typography variant="h4">{activeUsers}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Usuários Inativos</Typography>
                    <Typography variant="h4">{inactiveUsers}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Total de Subáreas</Typography>
                    <Typography variant="h4">{subareaCount}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Total de Áreas</Typography>
                    <Typography variant="h4">{areaCount}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Relatórios Ativos</Typography>
                    <Typography variant="h4">{activeReports}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Relatórios Resolvidos</Typography>
                    <Typography variant="h4">{resolvedReports}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <Box
                    textAlign="center"
                    border={1}
                    p={2}
                    borderRadius={5}
                    boxShadow={3}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                >
                    <Typography variant="h6">Total de Centros</Typography>
                    <Typography variant="h4">{totalCentros}</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
