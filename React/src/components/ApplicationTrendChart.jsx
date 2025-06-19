import React from 'react';
import { Line } from 'react-chartjs-2';

const ApplicationTrendChart = ({ data }) => {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'New Applicants',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                    }
                }
            }
        }
    };
    return <Line data={data} options={options} />;
};

export default ApplicationTrendChart;