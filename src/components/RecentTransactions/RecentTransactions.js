import React, { useContext, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { InputText } from 'primereact/inputtext';
import { CASHFLOW } from '../../common/constants';
import { sortArray } from '../../common/commonFunction';

const RecentTransactions = () => {
    const { transactions } = useContext(ExpenseContext);
    const [globalFilter, setGlobalFilter] = useState('');

    const formatCurrency = (value) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    const priceBodyTemplate = (rowData) => {
        return <div style={{ color: `${rowData.Cashflow == CASHFLOW.Expense ? 'red' : 'green'}` }}><b>{formatCurrency(rowData.Amount)}</b></div>
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center">
                <img alt={rowData.Category.name} src={require(`../../assets/Images/category/${rowData.Category.image}`)} className='mr-2' style={{ width: '23px' }} />
                <div>{rowData.Category.name}</div>
            </div>
        );
    };

    const getPaymentIcon = (rowData) => {
        switch (rowData.PaymentMode) {
            case 'Cash':
                return 'cash.png';
            case 'DebitCard':
                return 'debit-card.png';
            case 'CreditCard':
                return 'credit-card.png';
            default:
                return null;
        }
    };

    const paymentModeBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center" >
                <img alt={rowData.PaymentMode} src={require(`../../assets/Images/${getPaymentIcon(rowData)}`)} className='mr-2' style={{ width: '2rem' }} />
                <div>{rowData.PaymentMode}</div>
            </ div >
        )
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Recent Transactions</h4>
            <div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </div>
    );

    return (
        <div className="card">
            <DataTable
                value={sortArray(transactions).slice(0, 5)}
                dataKey="Id"
                size='small'
                globalFilter={globalFilter}
                header={header}
            >
                <Column style={{ width: '8rem' }} field="_Date" header="Date"></Column>
                <Column style={{ width: '8rem' }} field="Category.name" header="Category" body={categoryBodyTemplate}></Column>
                <Column style={{ width: '10rem' }} field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate}></Column>
                <Column field="Description" header="Description"></Column>
                <Column style={{ width: '10rem' }} field="Amount" header="Amount" body={priceBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}

export default RecentTransactions;