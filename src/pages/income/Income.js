import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
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

export default function Income() {
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

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [datetime12h, setDateTime12h] = useState(null);
    const [time, setTime] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(null);
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
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteExpenseDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteExpensesDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveExpense = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteExpense = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
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
        setDeleteProductsDialog(true);
    };

    const deleteSelectedExpenses = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
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
                <Button label="ADD TRANSACTION" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
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
            <Button label="ADD" icon="pi pi-check" onClick={saveExpense} />
            <Button label="CANCEL" icon="pi pi-times" outlined onClick={hideDialog} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteExpenseDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteExpense} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteExpensesDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedExpenses} />
        </React.Fragment>
    );

    return (
        <div className='p-3 main'>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable size='small' ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="code" header="Code" sortable></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable ></Column>
                    <Column field="category" header="Category" sortable ></Column>
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable ></Column>
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable ></Column>
                    <Column body={actionBodyTemplate} exportable={false} ></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="New Transaction" modal className="p-fluid" footer={expenseDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="Descriptions">Descriptions</label>
                    <InputTextarea
                        autoFocus
                        id="Descriptions"
                        value={product.description}
                        onChange={(e) => onInputChange(e, 'description')}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
                <div className='formgrid grid'>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="ChooseDate">Choose a Date</label>
                        <Calendar
                            id="ChooseDate"
                            value={datetime12h}
                            onChange={(e) => setDateTime12h(e.value)}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="ChooseTime">Choose a Time</label>
                        <Calendar
                            id="ChooseTime"
                            value={time}
                            onChange={(e) => setTime(e.value)}
                            timeOnly
                            hourFormat="12"
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="mb-3">Payment Mode</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-4">
                            <RadioButton inputId="Cash" name="PaymentMode" value="Cash" onChange={onCategoryChange} checked={product.category === 'Cash'} />
                            <label htmlFor="Cash">Cash</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton inputId="DebitCard" name="PaymentMode" value="DebitCard" onChange={onCategoryChange} checked={product.category === 'DebitCard'} />
                            <label htmlFor="DebitCard">Debit Card</label>
                        </div>
                        <div className="field-radiobutton col-4">
                            <RadioButton inputId="CreditCard" name="PaymentMode" value="CreditCard" onChange={onCategoryChange} checked={product.category === 'CreditCard'} />
                            <label htmlFor="CreditCard">Credit Card</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="SelectCategory">Select a Category</label>
                        <Dropdown value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={category} optionLabel="name" placeholder="Select a Category"
                            filter valueTemplate={selectedCategoryTemplate} itemTemplate={categoryOptionTemplate} showClear />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="EnterAmount">Enter a Amount</label>
                        <InputNumber id="EnterAmount" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="INR" locale="en-US" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteExpenseDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteExpensesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div >
    );
}
