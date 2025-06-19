import React from 'react';
import { Bar } from 'react-chartjs-2';

const TopUniversitiesBar = ({ data }) => {
    const options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Applicants',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                    }
                }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };
    return <Bar data={data} options={options} />;
};

export default TopUniversitiesBar;