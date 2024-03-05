import React, { useState, useRef, useContext, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from '../../services/firebase';
import {
  Column, Toast, Button, Toolbar, InputTextarea, RadioButton, InputNumber, Dialog, InputText, Calendar,
  Dropdown, DataTable, FileUpload, classNames, BlockUI
} from 'primereact';
import { addItem, deleteItem, updateItem } from '../../services/firebaseService';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { CASHFLOW, EXPENSE_CATEGORY, LISTS } from '../../common/constants';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { sortArray, updateContext } from '../../common/commonFunction';
import Header from "../../components/Header/Header";
import { expense } from '../../Models/expenses';
import { format } from 'date-fns';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { FilterMatchMode } from 'primereact/api';
import './Expense.css';

const Expense = () => {
  const initialState = new expense();
  const { transactions, setTransactions, blocked, setBlocked } = useContext(ExpenseContext);
  const [state, setState] = useState(initialState);
  const { Id, Description, TransactionDate, TransactionTime, PaymentMode, Category, Amount, Files } = state;
  const [expenses, setExpenses] = useState([]);
  const [files, setFiles] = useState([]);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [deleteExpensesDialog, setDeleteExpensesDialog] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [urls, setURLs] = useState([]);
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

  const getExpensesItems = () => {
    setExpenses(sortArray(transactions.filter(ele => ele.Cashflow == CASHFLOW.Expense)));
  };

  useEffect(() => {
    getExpensesItems();
  }, [transactions]);

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
    setExpenseDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setExpenseDialog(false);
  };

  const hideDeleteExpensesDialog = () => {
    setDeleteExpensesDialog(false);
  };

  const confirmDeleteSelected = () => {
    setDeleteExpensesDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  }

  const editProduct = (rowData) => {
    setState(rowData);
    setExpenseDialog(true);
  };

  const saveExpense = async () => {
    // if (files.length === 0) {
    //   alert("Please choose a file first!")
    // }

    // const storageRef = ref(storage, `/files/${files.name}`)
    // const uploadTask = uploadBytesResumable(storageRef, files);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const percent = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );

    //     // update progress
    //     setPercent(percent);
    //   },
    //   (err) => console.log(err),
    //   () => {
    //     // download url
    //     getDownloadURL(uploadTask.snapshot.ref).then((url) => {
    //       console.log(url);
    //     });
    //   }
    // );

    files.map((file) => {
      console.log('loop');

      const storageRef = ref(storage, `files/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      // promises.push(uploadTask)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(prog);
        },
        (error) => console.log(error),
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
            setURLs(prevState => [...prevState, downloadURLs])
            console.log("File available at", downloadURLs);
          });
        }
      );
    })

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
          getExpensesItems();
          setBlocked(false);
        });
      } else {
        delete state['_Day'];
        delete state['_Date'];
        delete state['_Time'];
        await updateItem(LISTS.TRANSACTIONS.NAME, state.Id, state).then(() => {
          const res = updateContext(transactions, state.Id, state);
          showSuccessToast('Expense updated successfully');
          setTransactions(res);
          getExpensesItems();
          setBlocked(false);
        });
      }
      setExpenseDialog(false);
    }
  };

  const deleteSelectedExpenses = async () => {
    setBlocked(true);
    if (selectedExpenses.length > 0) {
      for (const item of selectedExpenses) {
        await deleteItem(LISTS.TRANSACTIONS.NAME, item.Id).then(() => {
        }).catch(() => {
          setBlocked(false);
        });
      }
      let _expenses = transactions.filter((val) => !selectedExpenses.includes(val));
      setExpenses(_expenses);
      getExpensesItems();
      setDeleteExpensesDialog(false);
      setSelectedExpenses(null);
      setBlocked(false);
      showSuccessToast('Expenses Deleted successfully');
    }
  };

  console.log("percent..........", percent);

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Add Expense" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedExpenses || !selectedExpenses.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
  };

  const priceBodyTemplate = (rowData) => {
    return <div style={{ fontWeight: '500' }}>{formatCurrency(rowData.Amount)}</div>
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded text className="mr-2" onClick={() => editProduct(rowData)} />
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

  const expensesTotal = () => {
    let total = 0;
    for (let sale of expenses) {
      total += sale.Amount;
    }
    return formatCurrency(total);
  };

  // console.log("files...", files);
  // console.log("urls...", urls);
  const header = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0">Manage Expense</h4>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} type="search" placeholder="Search..." />
        </span>
      </div>
    )
  };

  const expenseDialogFooter = (
    <React.Fragment>
      <Button label={Id ? 'Save' : 'Add'} icon="pi pi-check" onClick={saveExpense} />
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
    </React.Fragment>
  );

  const deleteExpensesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteExpensesDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedExpenses} />
    </React.Fragment>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Totals:" colSpan={8} footerStyle={{ textAlign: 'right' }} />
        <Column style={{ color: 'red', fontWeight: '500' }} footer={expensesTotal} />
      </Row>
    </ColumnGroup>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
      <div className="flex justify-content-between align-items-center">
        <Header title="EXPENSE" subtitle="Manage Expense" />
      </div>
      <div className='card'>
        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable
          exportFilename="Expenses"
          scrollable
          scrollHeight='57vh'
          footerColumnGroup={footerGroup} size='small' ref={dt} value={expenses} selection={selectedExpenses} onSelectionChange={(e) => setSelectedExpenses(e.value)}
          dataKey="Id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Expenses" filters={filters} filterDisplay="row" header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column header="Actions" body={actionBodyTemplate} exportable={false} ></Column>
          <Column style={{ minWidth: '10rem' }} field="Category.name" header="Category" body={categoryBodyTemplate} sortable filterField="Category.name" filter filterPlaceholder="Search Category"></Column>
          <Column style={{ minWidth: '10rem' }} field="Description" header="Description" sortable filter filterPlaceholder="Search Description"></Column>
          <Column style={{ minWidth: '9rem' }} field="_Day" header="Day" sortable filter filterPlaceholder="Search Day"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Date" header="Date" sortable filter filterPlaceholder="Search Date"></Column>
          <Column style={{ minWidth: '10rem' }} field="_Time" header="Time" sortable filter filterPlaceholder="Search Time"></Column>
          <Column style={{ minWidth: '10rem' }} field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate} sortable filter filterPlaceholder="Search Payment"></Column>
          <Column style={{ minWidth: '11rem' }} field="Amount" header="Amount" body={priceBodyTemplate} sortable filter filterPlaceholder="Search Amount"></Column>
        </DataTable>
      </div>

      <Dialog visible={expenseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={Id ? 'Edit Expense' : 'New Expense'} modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="Descriptions">Description</label>
          <InputTextarea
            className={classNames({ 'p-invalid': submitted && !Description?.trim().length })}
            autoFocus
            id="Description"
            name="Description"
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
            <label htmlFor="ChooseDate">Choose a Date</label>
            <Calendar
              className={classNames({ 'p-invalid': submitted && !TransactionDate })}
              id="ChooseDate"
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
              id='TransactionTime'
              value={TransactionTime}
              name='TransactionTime'
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
              <RadioButton className={classNames({ 'p-invalid': submitted && !PaymentMode })} inputId="CreditCard" name='PaymentMode' value="CreditCard" onChange={handleChange} checked={PaymentMode === 'CreditCard'} />
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
            <Dropdown className={classNames({ 'p-invalid': submitted && !Category })} name='Category' value={Category} onChange={handleChange} options={EXPENSE_CATEGORY} optionLabel="name" placeholder="Select a Category"
              valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} showClear />
            {submitted && !Category && <small className="p-error">Category is Required Field.</small>}
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="EnterAmount">Enter a Amount</label>
            <InputNumber className={classNames({ 'p-invalid': submitted && !Amount })} id="EnterAmount" name='Amount' value={Amount} onValueChange={handleChange} mode="currency" currency="INR" locale="en-IN" />
            {submitted && !Amount && <small className="p-error">Amount is Required Field.</small>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="EnterAmount">Select File</label>
          <FileUpload name="documentsToEvidence" auto chooseLabel="Choose" url="/" customUpload uploadHandler={(e) => setFiles(e.files)} onRemove={(e) => setFiles([])} accept="*" emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} multiple />
        </div>
      </Dialog>

      <Dialog visible={deleteExpensesDialog} style={{ width: '35rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteExpensesDialogFooter} onHide={hideDeleteExpensesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>Are you sure you want to delete the selected transaction(s)?</span>
        </div>
      </Dialog>
    </div >
  );
};

export default Expense;
