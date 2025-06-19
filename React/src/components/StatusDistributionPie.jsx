import React from 'react'

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDistributionPie = ({ data }) => {
    return <Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />;
};

export default StatusDistributionPie;