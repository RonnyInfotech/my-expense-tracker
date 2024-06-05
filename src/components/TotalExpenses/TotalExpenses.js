import React, { useState, useEffect, useContext } from 'react';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { sumAndPercentageSimilarCategories } from '../../common/commonFunction';
import { ResponsivePie } from '@nivo/pie';

const TotalExpenses = () => {
    const { transactions } = useContext(ExpenseContext);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-IN', { style: 'currency', maximumFractionDigits: 2, currency: 'INR' });
    };

    const res = sumAndPercentageSimilarCategories(transactions);
    const expenses = res.map((ele) => { return { id: ele.code, label: ele.name, value: ele.sum, color: ele.color } })

    useEffect(() => {
    }, [transactions]);

    const tooltipStyle = {
        background: 'rgb(31, 42, 64)',
        color: 'rgb(224, 224, 224)',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
        borderRadius: '2px',
        padding: '5px 9px',
    };

    const CustomTooltip = ({ datum }) => (
        <div style={tooltipStyle} className='flex align-items-center'>
            <div><span style={{ display: 'block', width: '12px', height: '12px', background: datum.color, marginRight: '7px' }}></span></div>
            <div className='mr-1'>{datum.id} :</div>
            <div><strong>{datum.value.toLocaleString('en-IN', {
                style: 'currency',
                maximumFractionDigits: 2,
                currency: 'INR',
            })}</strong></div>
        </div >
    );

    return (
        <div className="card mt-3 p-3">
            <p className='chart-header'>Total Expense</p>
            <div className='grid'>
                <div className='col-12 md:col-12 lg:col-6 xl:col-6' style={{ height: '50vh' }}>
                    <ResponsivePie
                        data={expenses}
                        colors={expenses.map(({ color }) => color)}
                        margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        radialLabelsSkipAngle={10}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor={{ from: 'color' }}
                        sliceLabelsSkipAngle={10}
                        sliceLabelsTextColor="#FF0000" // Change label color here
                        arcLinkLabelsTextColor='#000000'
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        enableArcLabels={false}
                        activeOuterRadiusOffset={8}
                        // arcLinkLabelsOffset={-12}
                        // arcLinkLabelsStraightLength={7}
                        tooltip={CustomTooltip}
                    />
                </div>
                <div className='col-12 md:col-12 lg:col-6 xl:col-6 w-full md:w-20rem' style={{ color: '#3c3c3c' }}>
                    <div className='md:w-20rem md:ml-8'>
                        <table className='w-full' >
                            <tbody>
                                {res.map((ele) => {
                                    return (
                                        <tr style={{ height: '30px' }} key={ele.code}>
                                            <td>
                                                <div style={{ width: '16px', height: '16px', marginLeft: '1px', borderRadius: '16px', background: ele.color }}></div>
                                            </td>
                                            <td>{ele.name}</td>
                                            <td> {formatCurrency(ele.sum)}</td>
                                            <td style={{ textAlign: 'right' }}>{ele.percentage} </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TotalExpenses;