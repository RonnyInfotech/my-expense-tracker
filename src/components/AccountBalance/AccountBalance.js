import React, { useContext, useEffect, useState } from 'react';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { calculateIncomeAndExpenseByMonth } from '../../common/commonFunction';
import { Chart } from 'primereact/chart';
import { monthOrder } from '../../common/constants';
import './AccountBalance.css';

const AccountBalance = () => {
    const { transactions } = useContext(ExpenseContext);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const incomeAndExpenseByMonth = calculateIncomeAndExpenseByMonth(transactions).sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);

    useEffect(() => {
        const data = {
            labels: incomeAndExpenseByMonth.map(({ month }) => month),
            datasets: [
                {
                    label: 'Amount',
                    data: incomeAndExpenseByMonth.map(({ balance }) => balance),
                    fill: true,
                    backgroundColor: 'rgba(4, 112, 216, 0.3)',
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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
                        // color: textColor,
                        // usePointStyle: true,
                        // boxWidth: 40,
                    },
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [transactions]);

    return (
        <div className="card mt-3 p-3">
            <p className='chart-header'>Account - Balance</p>
            <Chart type="line" data={chartData} options={chartOptions} style={{ height: '40vh' }} />
        </div>
    )
}

export default AccountBalance