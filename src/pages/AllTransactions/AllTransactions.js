import React, { useState, useEffect, useRef } from 'react';
import Header from "../../components/Header/Header";
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { ProductService } from './ProductService';
import { DataTable } from 'primereact/datatable';

const AllTransactions = () => {
  const [incomes, setIncomes] = useState(null);
  const [selectedIncomes, setSelectedIncomes] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ProductService.getProducts().then((data) => setIncomes(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
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
      <div className="flex justify-content-between align-items-center">
        <Header title="All Transactions" subtitle="welcome to you All Transactions" />
      </div>
      <div className="card">
        <DataTable size='small' ref={dt} value={incomes} selection={selectedIncomes} onSelectionChange={(e) => setSelectedIncomes(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} incomes" globalFilter={globalFilter} header={header}>
          <Column field="category" header="Category" sortable ></Column>
          <Column field="name" header="Date" sortable></Column>
          {/* <Column field="image" header="Payment Mode" body={imageBodyTemplate}></Column> */}
          <Column field="code" header="Description" sortable></Column>
          <Column field="price" header="Amount" body={priceBodyTemplate} sortable ></Column>
          <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable ></Column>
          <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AllTransactions;
