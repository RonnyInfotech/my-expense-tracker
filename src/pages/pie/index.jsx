import React from 'react'
import PieChart from '../../components/PieChart'
import { Box } from '@mui/material';
import Header from '../../components/Header/Header';
import { Card } from 'primereact/card';
// import { useTheme } from '@mui/material';
// import { tokens } from '../../theme';
const Bar = () => {
    // const theme = useTheme()
    // const colors = tokens(theme.palette.mode)
    return (
        <div className='my-6' style={{ height: '45vh' }}>
            <Header title="BAR CHART" subtitle="simple bar chart" />
            <PieChart />
        </div>
    )
}

export default Bar