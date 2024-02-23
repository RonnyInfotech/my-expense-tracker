import React, { useState, useEffect, useRef } from 'react';
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
import { ProductService } from './ProductService';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { income } from '../../Models/income';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { addItem, getAllItems, updateItem } from '../../services/firebaseService';
import { LISTS, category } from '../../common/constants';
import { format } from "date-fns";
import './Income.css';

const Income = () => {
  const initialState = new income();
  // format(new Date(yesterday), 'dd/MM/yyyy');
  const [state, setState] = useState(initialState);
  const {
    Id,
    Description,
    Date,
    Time,
    PaymentMode,
    Category,
    Amount,
    Files,
  } = state;

  const [incomes, setIncomes] = useState(null);
  // const [item, setItem] = useState(null);
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [deleteIncomeDialog, setDeleteIncomeDialog] = useState(false);
  const [deleteIncomesDialog, setDeleteIncomesDialog] = useState(false);
  const [selectedIncomes, setSelectedIncomes] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [percent, setPercent] = useState(0);
  const [files, setFiles] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);

  // const category = [
  //   { name: 'Salary', code: 'Salary', image: 'salary.png' },
  //   { name: 'Interests', code: 'Interests', image: 'interest.png' },
  //   { name: 'Business', code: 'Business', image: 'business.png' },
  //   { name: 'Extra income', code: 'ExtraIncome', image: 'extra.png' },
  // ];

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

  useEffect(() => {
    ProductService.getProducts().then((data) => setIncomes(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
  };

  const openNew = () => {
    // setProduct(emptyProduct);
    setSubmitted(false);
    setIncomeDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setIncomeDialog(false);
  };

  const hideDeleteIncomeDialog = () => {
    setDeleteIncomeDialog(false);
  };

  const hideDeleteIncomesDialog = () => {
    setDeleteIncomesDialog(false);
  };

  const showSuccessToast = (message) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
  };

  const showErrorToast = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  };

  const showWarningToast = (message) => {
    toast.current.show({ severity: 'success', summary: 'Warning', detail: message, life: 3000 });
  };

  const fetchAllItems = async () => {
    const result = await getAllItems(LISTS.TRANSACTIONS.NAME);
    console.log("result..", result)
  }

  useEffect(() => {
    fetchAllItems();
  }, []);

  const saveIncome = async () => {
    if (!Description.trim().length || !Date || !Time || !PaymentMode || !Category || !Amount) {
      setSubmitted(true);
      showErrorToast('Please fill required fields.')
    } else {
      if (Id) {
        const result = updateItem(LISTS.TRANSACTIONS.NAME, 1, state);
        showSuccessToast('Income updated successfully');
      } else {
        const id = await addItem(LISTS.TRANSACTIONS.NAME, state);
        console.log("result..ID", id);
        showSuccessToast('Income added successfully');
      }
      setIncomeDialog(false);
    }
  };

  const editIncome = (product) => {
    // setProduct({ ...product });
    setIncomeDialog(true);
  };

  const confirmDeleteIncome = (product) => {
    // setProduct(product);
    setDeleteIncomeDialog(true);
  };

  const deleteIncome = () => {
    // let _products = incomes.filter((val) => val.id !== product.id);

    setIncomes([]);
    setDeleteIncomeDialog(false);
    // setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < incomes.length; i++) {
      if (incomes[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteIncomesDialog(true);
  };

  const deleteSelectedIncomes = () => {
    let _products = incomes.filter((val) => !selectedIncomes.includes(val));

    setIncomes(_products);
    setDeleteIncomesDialog(false);
    setSelectedIncomes(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="ADD TRANSACTION" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedIncomes || !selectedIncomes.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const priceBodyTemplate = (rowData) => {
    return <div style={{ color: 'green' }}>{formatCurrency(rowData.price)}</div>
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editIncome(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteIncome(rowData)} />
      </React.Fragment>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  }

  console.log("state>>>>>>>>>", state);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Income</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );

  const incomeDialogFooter = (
    <React.Fragment>
      <Button label="ADD" icon="pi pi-check" onClick={saveIncome} />
      <Button label="CANCEL" icon="pi pi-times" outlined onClick={hideDialog} />
    </React.Fragment>
  );

  const deleteIncomeDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteIncomeDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteIncome} />
    </React.Fragment>
  );

  const deleteIncomesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteIncomesDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedIncomes} />
    </React.Fragment>
  );

  return (
    <div style={{ margin: '20px' }}>
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center">
        <Header title="INCOME" subtitle="Manage Income" />
      </div>

      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable size='small' ref={dt} value={incomes} selection={selectedIncomes} onSelectionChange={(e) => setSelectedIncomes(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} incomes" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          {/* <Column header="Actions" body={actionBodyTemplate} exportable={false} ></Column> */}
          <Column field="category" header="Category" sortable ></Column>
          <Column field="name" header="Date" sortable></Column>
          {/* <Column field="image" header="Payment Mode" body={imageBodyTemplate}></Column> */}
          <Column field="code" header="Description" sortable></Column>
          <Column field="price" header="Amount" body={priceBodyTemplate} sortable ></Column>
          <Column field="rating" header="Reviews" sortable ></Column>
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable ></Column> */}
        </DataTable>
      </div>

      <Dialog visible={incomeDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="New Transaction" modal className="p-fluid" footer={incomeDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="Descriptions">Descriptions</label>
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
            <label htmlFor="Date">Choose a Date</label>
            <Calendar
              className={classNames({ 'p-invalid': submitted && !Date })}
              id="Date"
              name='Date'
              value={Date}
              onChange={handleChange}
            />
            {submitted && !Date && <small className="p-error">Date is Required Field.</small>}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="ChooseTime">Choose a Time</label>
            <Calendar
              className={classNames({ 'p-invalid': submitted && !Time })}
              id="Time"
              name='Time'
              value={Time}
              onChange={handleChange}
              timeOnly
              hourFormat="12"
            />
            {submitted && !Time && <small className="p-error">Time is Required Field.</small>}
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
            <Dropdown className={classNames({ 'p-invalid': submitted && !Category })} name='Category' value={Category} onChange={handleChange} options={category} optionLabel="name" placeholder="Select a Category"
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

      <Dialog visible={deleteIncomeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteIncomeDialogFooter} onHide={hideDeleteIncomeDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {state && (
            <span>
              Are you sure you want to delete <b></b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteIncomesDialog} style={{ width: '35rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteIncomesDialogFooter} onHide={hideDeleteIncomesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {state && <span>Are you sure you want to delete the selected transaction(s)?</span>}
        </div>
      </Dialog>
    </div>
  );
};

export default Income;
