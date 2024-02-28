import React, { useState, useRef, useContext } from 'react';
import Header from "../../components/Header/Header";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { BlockUI } from 'primereact/blockui';
import { CASHFLOW } from '../../common/constants';

const AllTransactions = () => {
  const { transactions, setTransactions, blocked, setBlocked } = useContext(ExpenseContext);
  const [selectedIncomes, setSelectedIncomes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const priceBodyTemplate = (rowData) => {
    return <div style={{ color: `${rowData.Cashflow == CASHFLOW.Expense ? 'red' : 'green'}` }}><b>{formatCurrency(rowData.Amount)}</b></div>
  };

  const exportCSV = () => {
    dt.current.exportCSV();
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
      <h4 className="m-0">Manage All Transactions</h4>
      <div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
        <Button label="Export" icon="pi pi-upload" className="p-button-help ml-3" onClick={exportCSV} />
      </div>
    </div>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
      <div className="flex justify-content-between align-items-center">
        <Header title="All Transactions" subtitle="welcome to you All Transactions" />
      </div>
      <div className="card">
        <DataTable size='small' ref={dt} value={transactions} selection={selectedIncomes} onSelectionChange={(e) => setSelectedIncomes(e.value)}
          dataKey="Id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transactions" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="Category" header="Category" body={categoryBodyTemplate} sortable ></Column>
          <Column field="_Date" header="Date" sortable ></Column>
          <Column field="_Time" header="Time" sortable ></Column>
          <Column field="Day" header="Day" sortable ></Column>
          <Column field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate} sortable></Column>
          <Column field="Description" header="Description" sortable></Column>
          <Column field="Amount" header="Amount" body={priceBodyTemplate} sortable ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AllTransactions;
