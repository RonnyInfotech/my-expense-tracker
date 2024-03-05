import React, { useState, useRef, useContext, useEffect } from 'react';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import {
  Column, Toast, Button, Toolbar, InputTextarea, RadioButton, InputNumber, Dialog, InputText, Calendar,
  Dropdown, DataTable, FileUpload, classNames, BlockUI
} from 'primereact';
import { addItem, deleteItem, updateItem } from '../../services/firebaseService';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { CASHFLOW, INCOME_CATEGORY, LISTS } from '../../common/constants';
import { sortArray, updateContext } from '../../common/commonFunction';
import Header from "../../components/Header/Header";
import { income } from '../../Models/income';
import { format } from 'date-fns';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { FilterMatchMode } from 'primereact/api';
import './Income.css';

const Income = () => {
  const initialState = new income();
  const { blocked, setBlocked, transactions, setTransactions } = useContext(ExpenseContext);
  const [state, setState] = useState(initialState);
  const { Id, Description, TransactionDate, TransactionTime, PaymentMode, Category, Amount, Files, } = state;
  const [incomes, setIncomes] = useState([]);
  const [files, setFiles] = useState([]);
  const [deleteIncomesDialog, setDeleteIncomesDialog] = useState(false);
  const [selectedIncomes, setSelectedIncomes] = useState(null);
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [percent, setPercent] = useState(0);
  const toast = useRef(null);
  const dt = useRef(null);
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
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const getIncomesItems = () => {
    setIncomes(sortArray(transactions.filter(ele => ele.Cashflow == CASHFLOW.Income)));
  };

  useEffect(() => {
    getIncomesItems();
  }, [transactions])

  const showSuccessToast = (message) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
  };

  const showErrorToast = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  };

  const showWarningToast = (message) => {
    toast.current.show({ severity: 'success', summary: 'Warning', detail: message, life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const selectedCategoryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img alt={option.name} src={require(`../../assets/Images/category/${option.image}`)} className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
          <div>{option.name}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const categoryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img alt={option.name} src={require(`../../assets/Images/category/${option.image}`)} className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} />
        <div>{option.name}</div>
      </div>
    );
  };

  const openNew = () => {
    setState(initialState);
    setSubmitted(false);
    setIncomeDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setIncomeDialog(false);
  };

  const hideDeleteIncomesDialog = () => {
    setDeleteIncomesDialog(false);
  };

  const confirmDeleteSelected = () => {
    setDeleteIncomesDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };

  const editIncome = (rowData) => {
    setState(rowData);
    setIncomeDialog(true);
  };

  const saveIncome = async () => {
    setBlocked(true);
    if (!Description.trim().length || !TransactionDate || !TransactionTime || !PaymentMode || !Category || !Amount) {
      setSubmitted(true);
      setBlocked(false);
      showErrorToast('Please fill required fields.');
    } else {
      delete state['_Day'];
      delete state['_Date'];
      delete state['_Time'];
      if (!Id) {
        await addItem(LISTS.TRANSACTIONS.NAME, state).then((res) => {
          transactions.push({
            ...state,
            Id: res.id,
            _Day: format(new Date(state.TransactionDate), 'EEEE'),
            _Date: format(new Date(state.TransactionDate), 'dd/MM/yyyy'),
            _Time: format(new Date(state.TransactionTime), 'hh:mm a')
          });
          showSuccessToast('Income added successfully');
          getIncomesItems();
          setBlocked(false);
        });
      } else {
        await updateItem(LISTS.TRANSACTIONS.NAME, state.Id, state).then(() => {
          const res = updateContext(transactions, state.Id, state);
          showSuccessToast('Income updated successfully');
          setTransactions(res);
          getIncomesItems();
          setBlocked(false);
        });
      }
      setIncomeDialog(false);
      setBlocked(false);
    }
  };

  const deleteSelectedIncomes = async () => {
    setBlocked(true);
    if (selectedIncomes.length > 0) {
      for (const item of selectedIncomes) {
        await deleteItem(LISTS.TRANSACTIONS.NAME, item.Id).then(() => {
        }).catch(() => {
          setBlocked(false);
        });
      }
      let _incomes = transactions.filter((val) => !selectedIncomes.includes(val));
      setTransactions(_incomes);
      getIncomesItems();
      setDeleteIncomesDialog(false);
      setSelectedIncomes(null);
      setBlocked(false);
      showSuccessToast('Incomes Deleted successfully');
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Add Income" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedIncomes || !selectedIncomes.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', { style: 'currency', maximumFractionDigits: 2, currency: 'INR' });
  };

  const priceBodyTemplate = (rowData) => {
    return <div style={{ fontWeight: '500' }}>{formatCurrency(rowData.Amount)}</div>
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded text className="mr-2" onClick={() => editIncome(rowData)} />
      </React.Fragment>
    );
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

  const incomesTotal = () => {
    let total = 0;
    for (let sale of incomes) {
      total += sale.Amount;
    }
    return formatCurrency(total);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Income</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} type="search" placeholder="Search..." />
      </span>
    </div>
  );

  const incomeDialogFooter = (
    <React.Fragment>
      <Button label={Id ? 'Save' : 'Add'} icon="pi pi-check" onClick={saveIncome} />
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
    </React.Fragment>
  );

  const deleteIncomesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteIncomesDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedIncomes} />
    </React.Fragment>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={8} footerStyle={{ textAlign: 'right' }} />
        <Column style={{ color: 'green', fontWeight: '500' }} footer={incomesTotal} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
      <div className="flex justify-content-between align-items-center">
        <Header title="INCOME" subtitle="Manage Income" />
      </div>

      <div className="card">
        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable
          exportFilename="Incomes"
          scrollable
          scrollHeight='57vh'
          footerColumnGroup={footerGroup} size='small' ref={dt} value={incomes} selection={selectedIncomes} onSelectionChange={(e) => setSelectedIncomes(e.value)}
          dataKey="Id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} incomes" filters={filters} filterDisplay="row" header={header}
          emptyMessage="No Incomes found."
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column header="Actions" body={actionBodyTemplate} exportable={false} ></Column>
          <Column style={{ minWidth: '10rem' }} field="Category.name" header="Category" body={categoryBodyTemplate} sortable filterField="Category.name" filter filterPlaceholder="Search Category"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Date" header="Date" sortable filter filterPlaceholder="Search Date"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Time" header="Time" sortable filter filterPlaceholder="Search Time"></Column>
          <Column style={{ minWidth: '9rem' }} field="_Day" header="Day" sortable filter filterPlaceholder="Search Day"></Column>
          <Column style={{ minWidth: '10rem' }} field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate} sortable filter filterPlaceholder="Search Payment"></Column>
          <Column style={{ minWidth: '10rem' }} field="Description" header="Description" sortable filter filterPlaceholder="Search Description"></Column>
          <Column style={{ minWidth: '11rem' }} field="Amount" header="Amount" body={priceBodyTemplate} sortable filter filterPlaceholder="Search Amount"></Column>
        </DataTable>
      </div>

      <Dialog visible={incomeDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={Id ? 'Edit Income' : 'New Income'} modal className="p-fluid" footer={incomeDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="Descriptions">Description</label>
          <InputTextarea
            className={classNames({ 'p-invalid': submitted && !Description?.trim().length })}
            autoFocus
            id="Descriptions"
            name='Description'
            value={Description}
            onChange={handleChange}
            required
            rows={3}
            cols={20}
          />
          {submitted && !Description?.trim().length && <small className="p-error">Description is Required Field.</small>}
        </div>
        <div className='formgrid grid'>
          <div className="field col-12 md:col-6">
            <label htmlFor="TransactionDate">Choose a Date</label>
            <Calendar
              className={classNames({ 'p-invalid': submitted && !TransactionDate })}
              id="TransactionDate"
              name='TransactionDate'
              value={TransactionDate}
              onChange={handleChange}
              dateFormat="dd/mm/yy"
            />
            {submitted && !TransactionDate && <small className="p-error">Date is Required Field.</small>}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="ChooseTime">Choose a Time</label>
            <Calendar
              className={classNames({ 'p-invalid': submitted && !TransactionTime })}
              id="TransactionTime"
              name='TransactionTime'
              value={TransactionTime}
              onChange={handleChange}
              timeOnly
              hourFormat="12"
            />
            {submitted && !TransactionTime && <small className="p-error">Time is Required Field.</small>}
          </div>
        </div>

        <div className="field">
          <label className="mb-3">Payment Mode</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-4">
              <RadioButton className={classNames({ 'p-invalid': submitted && !PaymentMode })} inputId="Cash" name="PaymentMode" value="Cash" onChange={handleChange} checked={PaymentMode === 'Cash'} />
              <label htmlFor="Cash">Cash</label>
            </div>
            <div className="field-radiobutton col-4">
              <RadioButton className={classNames({ 'p-invalid': submitted && !PaymentMode })} inputId="DebitCard" name="PaymentMode" value="DebitCard" onChange={handleChange} checked={PaymentMode === 'DebitCard'} />
              <label htmlFor="DebitCard">Debit Card</label>
            </div>
            <div className="field-radiobutton col-4">
              <RadioButton className={classNames({ 'p-invalid': submitted && !PaymentMode })} inputId="CreditCard" name="PaymentMode" value="CreditCard" onChange={handleChange} checked={PaymentMode === 'CreditCard'} />
              <label htmlFor="CreditCard">Credit Card</label>
            </div>
            <div className="field col-12 mb-0">
              {submitted && !PaymentMode && <small className="p-error">Payment Mode is Required Field.</small>}
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="SelectCategory">Select a Category</label>
            <Dropdown className={classNames({ 'p-invalid': submitted && !Category })} name='Category' value={Category} onChange={handleChange} options={INCOME_CATEGORY} optionLabel="name" placeholder="Select a Category"
              filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} showClear />
            {submitted && !Category && <small className="p-error">Category is Required Field.</small>}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="EnterAmount">Enter a Amount</label>
            <InputNumber className={classNames({ 'p-invalid': submitted && !Amount })} name='Amount' id="EnterAmount" value={Amount} onValueChange={handleChange} mode="currency" currency="INR" locale="en-US" />
            {submitted && !Amount && <small className="p-error">Amount is Required Field.</small>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="EnterAmount">Select File</label>
          <FileUpload name="documentsToEvidence" auto chooseLabel="Choose" url="/" customUpload uploadHandler={(e) => setFiles(e.files)} onRemove={(e) => setFiles([])} accept="*" emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} multiple />
        </div>
      </Dialog>

      <Dialog visible={deleteIncomesDialog} style={{ width: '35rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteIncomesDialogFooter} onHide={hideDeleteIncomesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>Are you sure you want to delete the selected transaction(s)?</span>
        </div>
      </Dialog>
    </div>
  );
};

export default Income;
