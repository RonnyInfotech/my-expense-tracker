import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

const AccountBalance = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Amount',
                    data: [1000, 10000, 8000, 12000, 9000],
                    fill: true,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    backgroundColor: 'rgba(255,167,38,0.2)'
                }
            ]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            // animations: {
            //     tension: {
            //         // duration: 1000,
            //         easing: 'linear',
            //         from: 1,
            //         to: 0,
            //         // loop: true
            //     }
            // },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        // beginAtZero: true,
                        // padding: 25,
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card mt-3 p-3">
            <Chart type="line" data={chartData} options={chartOptions} />
        </div>
    )
}

export default AccountBalance