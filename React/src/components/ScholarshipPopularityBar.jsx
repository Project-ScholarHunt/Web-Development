import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScholarshipPopularityBar = ({ data }) => {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } } },
    };
    return <Bar data={data} options={options} />;
};

export default ScholarshipPopularityBar