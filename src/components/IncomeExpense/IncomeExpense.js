import React, { useState, useEffect, useContext } from 'react';
import { Chart } from 'primereact/chart';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { calculateIncomeAndExpenseByMonth } from '../../common/commonFunction';
import { CASHFLOW, monthOrder } from '../../common/constants';

const IncomeExpense = () => {
    const { transactions } = useContext(ExpenseContext);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const incomeAndExpenseByMonth = calculateIncomeAndExpenseByMonth(transactions).sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
    console.log(incomeAndExpenseByMonth);

    useEffect(() => {
        const data = {
            labels: incomeAndExpenseByMonth.map(({ month }) => month),
            datasets: [
                {
                    label: CASHFLOW.Income,
                    backgroundColor: '#A16EE5',
                    data: incomeAndExpenseByMonth.map(({ income }) => income)
                },
                {
                    label: CASHFLOW.Expense,
                    backgroundColor: '#4472C4',
                    data: incomeAndExpenseByMonth.map(({ expense }) => expense)
                }
            ]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: true,
                        drawBorder: true
                    }
                },
                y: {
                    grid: {
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [transactions]);

    return (
        <div className="card mt-3 p-3">
            <p className='chart-header'>Income - Expense</p>
            <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '40vh' }} />
        </div>
    )
}

export default IncomeExpense;