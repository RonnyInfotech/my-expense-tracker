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
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { FilterMatchMode } from 'primereact/api';
import { sortArray } from '../../common/commonFunction';

const AllTransactions = () => {
  const { transactions, blocked } = useContext(ExpenseContext);
  const toast = useRef(null);
  const dt = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'Category.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    _Date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    _Time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    _Day: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PaymentMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Amount: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

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
      </div >
    )
  };

  const transactionsTotal = () => {
    let total = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    for (let item of transactions) {
      if (item.Cashflow === "Income") {
        totalIncome += item.Amount;
      } else if (item.Cashflow === "Expense") {
        totalExpense += item.Amount;
      }
    }
    total = totalIncome - totalExpense;
    return formatCurrency(total);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage All Transactions</h4>
      <div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} type="search" placeholder="Search..." />
        </span>
        <Button label="Export" icon="pi pi-upload" className="p-button-help ml-3" onClick={exportCSV} />
      </div>
    </div>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={6} footerStyle={{ textAlign: 'right' }} />
        <Column style={{ fontWeight: '500' }} footer={transactionsTotal} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
      <div className="flex justify-content-between align-items-center">
        <Header title="All Transactions" subtitle="welcome to you All Transactions" />
      </div>
      <div className="card">
        <DataTable
          exportFilename="AllTransactions"
          scrollable
          scrollHeight='65vh'
          className='all-transaction'
          dataKey="Id"
          size='small'
          ref={dt}
          filters={filters}
          filterDisplay="row"
          header={header}
          value={sortArray(transactions)}
          footerColumnGroup={footerGroup}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transactions"
        >
          <Column style={{ minWidth: '10rem' }} field="Category.name" header="Category" body={categoryBodyTemplate} sortable filterField="Category.name" filter filterPlaceholder="Search Category"></Column>
          <Column style={{ minWidth: '13rem' }} field="Description" header="Description" sortable filter filterPlaceholder="Search Description"></Column>
          <Column style={{ minWidth: '9rem' }} field="_Day" header="Day" sortable filter filterPlaceholder="Search Day"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Date" header="Date" sortable filter filterPlaceholder="Search Date"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Time" header="Time" sortable filter filterPlaceholder="Search Time"></Column>
          <Column style={{ minWidth: '10rem' }} field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate} sortable filter filterPlaceholder="Search Payment"></Column>
          <Column style={{ minWidth: '11rem' }} field="Amount" header="Amount" body={priceBodyTemplate} sortable filter filterPlaceholder="Search Amount"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AllTransactions;
