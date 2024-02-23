import React, { useState, useEffect, useRef } from 'react';
import Header from "../../components/Header/Header";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProductService } from './ProductService';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from '../../services/firebase';
import { classNames } from 'primereact/utils';
import { expense } from '../../Models/expenses';
import './Expense.css';
import { addItem, updateItem } from '../../services/firebaseService';
import { LISTS } from '../../common/constants';

const Expense = () => {
  const initialState = new expense();
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

  let emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };

  const [expenses, setExpenses] = useState(null);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [deleteExpenseDialog, setDeleteExpenseDialog] = useState(false);
  const [deleteExpensesDialog, setDeleteExpensesDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedExpenses, setSelectedExpenses] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [percent, setPercent] = useState(0);
  const [files, setFiles] = useState([]);
  const [urls, setURLs] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);

  const category = [
    { name: 'Rent', code: 'Rent', image: 'rent.png' },
    { name: 'Food', code: 'Food', image: 'food.png' },
    { name: 'Bills', code: 'Bills', image: 'bills.png' },
    { name: 'Utilities', code: 'Utilities', image: 'utilities.png' },
    { name: 'Transportation', code: 'Transportation', image: 'transport.png' },
    { name: 'Insurance', code: 'Insurance', image: 'insurance.png' },
    { name: 'Shopping', code: 'Shopping', image: 'shopping.png' },
    { name: 'Entertainment', code: 'Entertainment', image: 'entertainment.png' },
    { name: 'Health Care', code: 'HealthCare', image: 'health.png' },
    { name: 'Housing', code: 'Housing', image: 'house.png' },
    { name: 'Taxes', code: 'Taxes', image: 'tax.png' },
    { name: 'Clothing', code: 'Clothing', image: 'clothing.png' },
    { name: 'Education', code: 'Education', image: 'education.png' },
    { name: 'Miscellaneous', code: 'Miscellaneous', image: 'miscellaneous.png' },
    { name: 'Personal Care', code: 'PersonalCare', image: 'personal.png' },
  ];

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
    ProductService.getProducts().then((data) => setExpenses(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
  };

  const openNew = () => {
    // setProduct(emptyProduct);
    setState(initialState);
    setSubmitted(false);
    setExpenseDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setExpenseDialog(false);
  };

  const hideDeleteExpenseDialog = () => {
    setDeleteExpenseDialog(false);
  };

  const hideDeleteExpensesDialog = () => {
    setDeleteExpensesDialog(false);
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

    if (!Description.trim().length || !Date || !Time || !PaymentMode || !Category || !Amount) {
      setSubmitted(true);
      showErrorToast('Please fill required fields.')
    } else {
      if (Id) {
        const result = updateItem(LISTS.TRANSACTIONS.NAME, 1, state);
        showSuccessToast('Expense updated successfully');
      } else {
        const result = addItem(LISTS.TRANSACTIONS.NAME, state);
        showSuccessToast('Expense added successfully');
      }
      setExpenseDialog(false);
    }

    // let _products = [...expenses];
    // let _product = { ...product };

    // if (product.id) {
    //   const index = findIndexById(product.id);

    //   _products[index] = _product;
    //   toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    // } else {
    //   _product.id = createId();
    //   _product.image = 'product-placeholder.svg';
    //   _products.push(_product);
    //   toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
    // }

    // setExpenses(_products);
    // setExpenseDialog(false);
    // setProduct(emptyProduct);

  };

  console.log("percent..........", percent);

  const editProduct = (product) => {
    setProduct({ ...product });
    setExpenseDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteExpenseDialog(true);
  };

  const deleteExpense = () => {
    let _products = expenses.filter((val) => val.id !== product.id);

    setExpenses(_products);
    setDeleteExpenseDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
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
    setDeleteExpensesDialog(true);
  };

  const deleteSelectedExpenses = () => {
    let _products = expenses.filter((val) => !selectedExpenses.includes(val));

    setExpenses(_products);
    setDeleteExpensesDialog(false);
    setSelectedExpenses(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };

    _product['category'] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

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

  const priceBodyTemplate = (rowData) => {
    return <div style={{ color: 'red' }}>{formatCurrency(rowData.price)}</div>
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button size="small" icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button size="small" icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  };

  // console.log("files...", files);
  // console.log("urls...", urls);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  }

  console.log("state>>>>>>>>>", state);


  const onUpload = () => {
    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };

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

  const deleteExpenseDialogFooter = (
    <React.Fragment>
      <Button size="small" label="No" icon="pi pi-times" outlined onClick={hideDeleteExpenseDialog} />
      <Button size="small" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteExpense} />
    </React.Fragment>
  );

  const deleteExpensesDialogFooter = (
    <React.Fragment>
      <Button size="small" label="No" icon="pi pi-times" outlined onClick={hideDeleteExpensesDialog} />
      <Button size="small" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedExpenses} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      {/* <div className="flex justify-content-between align-items-center">
        <Header title="EXPENSE" subtitle="Manage Expense" />
      </div> */}

      <div>
        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable scrollHeight='68vh' scrollable size='small' ref={dt} value={expenses} selection={selectedExpenses} onSelectionChange={(e) => setSelectedExpenses(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} expenses" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          {/* <Column header="Actions" body={actionBodyTemplate} exportable={false} ></Column> */}
          <Column field="category" header="Category" sortable ></Column>
          <Column field="name" header="Date" sortable></Column>
          {/* <Column field="image" header="Payment Mode" body={imageBodyTemplate}></Column> */}
          <Column field="code" header="Description" sortable filter></Column>
          <Column field="price" header="Amount" body={priceBodyTemplate} sortable ></Column>
          <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable ></Column>
          <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable ></Column>
        </DataTable>
      </div>

      <Dialog visible={expenseDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="New Transaction" modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
        {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
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
              className={classNames({ 'p-invalid': submitted && !Date })}
              id="ChooseDate"
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
              value={Time}
              name='Time'
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
              <RadioButton className={classNames({ 'p-invalid': submitted && !PaymentMode })} inputId="CreditCard" name='PaymentMode' value="CreditCard" onChange={handleChange} checked={PaymentMode === 'CreditCard'} />
              <label htmlFor="CreditCard">Credit Card</label>
            </div>
            <div className="field col-12 mb-0">
              {submitted && !PaymentMode && <small className="p-error">Payment Mode is Required Field.</small>}
            </div>
          </div>
        </div>

        {/* className="p-inputtext-sm" */}
        <div className="formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="SelectCategory">Select a Category</label>
            <Dropdown className={classNames({ 'p-invalid': submitted && !Category })} name='Category' value={Category} onChange={handleChange} options={category} optionLabel="name" placeholder="Select a Category"
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

      <Dialog visible={deleteExpenseDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteExpenseDialogFooter} onHide={hideDeleteExpenseDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteExpensesDialog} style={{ width: '35rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteExpensesDialogFooter} onHide={hideDeleteExpensesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete the selected transaction(s)?</span>}
        </div>
      </Dialog>
    </div >
  );
};

export default Expense;
