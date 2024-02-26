import React, { useState, useRef, useContext } from 'react';
import Header from "../../components/Header/Header";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from '../../services/firebase';
import { classNames } from 'primereact/utils';
import { expense } from '../../Models/expenses';
import { addItem, deleteItem, updateItem } from '../../services/firebaseService';
import { EXPENSE_CATEGORY, LISTS } from '../../common/constants';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { updateContext } from '../../common/commonFunction';
import { BlockUI } from 'primereact/blockui';
import './Expense.css';

const Expense = () => {
  const initialState = new expense();
  const { expenses, setExpenses, blocked, setBlocked } = useContext(ExpenseContext);
  const [state, setState] = useState(initialState);
  const { Id, Description, TransactionDate, TransactionTime, PaymentMode, Category, Amount, Files } = state;
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [deleteExpensesDialog, setDeleteExpensesDialog] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [percent, setPercent] = useState(0);
  const [files, setFiles] = useState([]);
  const [urls, setURLs] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);

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
      if (Id) {
        await updateItem(LISTS.TRANSACTIONS.NAME, state.Id, state).then(() => {
          const res = updateContext(expenses, state.Id, state);
          setExpenses(res);
          setBlocked(false);
          showSuccessToast('Income updated successfully');
        });
      } else {
        await addItem(LISTS.TRANSACTIONS.NAME, state).then(() => {
          expenses.push(state);
          setBlocked(false);
          showSuccessToast('Income added successfully');
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
          let _expenses = expenses.filter((val) => !selectedExpenses.includes(val));
          setExpenses(_expenses);
          setDeleteExpensesDialog(false);
          setSelectedExpenses(null);
          setBlocked(false);
        }).catch((err) => {
          console.log("Err", err);
          setBlocked(false);
        });
      }
      showSuccessToast('Expenses Deleted successfully');
    }
  };

  console.log("percent..........", percent);

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="small" label="ADD TRANSACTION" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button size="small" label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedExpenses || !selectedExpenses.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button size="small" label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
  };

  const priceBodyTemplate = (rowData) => {
    return <div style={{ color: 'red' }}>{formatCurrency(rowData.price)}</div>
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button size="small" icon="pi pi-pencil" rounded text className="mr-2" onClick={() => editProduct(rowData)} />
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

  // console.log("files...", files);
  // console.log("urls...", urls);

  console.log("state>>>>>>>>>", state);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Expense</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );

  const expenseDialogFooter = (
    <React.Fragment>
      <Button size="small" label="ADD" icon="pi pi-check" onClick={saveExpense} />
      <Button size="small" label="CANCEL" icon="pi pi-times" outlined onClick={hideDialog} />
    </React.Fragment>
  );

  const deleteExpensesDialogFooter = (
    <React.Fragment>
      <Button size="small" label="No" icon="pi pi-times" outlined onClick={hideDeleteExpensesDialog} />
      <Button size="small" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedExpenses} />
    </React.Fragment>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <BlockUI blocked={blocked} fullScreen template={<CustomSpinner />} />
      <div className="flex justify-content-between align-items-center">
        <Header title="EXPENSE" subtitle="Manage Expense" />
      </div>
      <div>
        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable scrollHeight='68vh' scrollable size='small' ref={dt} value={expenses} selection={selectedExpenses} onSelectionChange={(e) => setSelectedExpenses(e.value)}
          dataKey="Id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} expenses" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column header="Actions" body={actionBodyTemplate} exportable={false} ></Column>
          <Column field="Category" header="Category" body={categoryBodyTemplate} sortable ></Column>
          <Column field="_Date" header="Date" sortable ></Column>
          <Column field="_Time" header="Time" sortable ></Column>
          <Column field="Day" header="Day" sortable ></Column>
          <Column field="PaymentMode" header="Payment Mode" body={paymentModeBodyTemplate} sortable></Column>
          <Column field="Description" header="Description" sortable></Column>
          <Column field="Amount" header="Amount" body={priceBodyTemplate} sortable ></Column>
        </DataTable>
      </div>

      <Dialog visible={expenseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="New Transaction" modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="Descriptions">Descriptions</label>
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
