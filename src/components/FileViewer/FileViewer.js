import React, { useContext, useRef, useState } from 'react';
import { Panel, Button, DataScroller, Dialog } from 'primereact';
import { getFileNameFromUrl, updateContext } from '../../common/commonFunction';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Toast } from 'primereact/toast';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { LISTS } from '../../common/constants';
import { updateItem } from '../../services/firebaseService';
import './FileViewer.css';

const FileViewer = ({ FilesItem, item }) => {
    const { transactions, setTransactions, setUpdateFileState } = useContext(ExpenseContext);
    const [state, setState] = useState({
        fileName: null,
        fileURL: null
    });
    const { fileName, fileURL } = state;
    const [deleteFileDialog, setDeleteFileDialog] = useState(false);
    const [fileItemID, setFileItemID] = useState(null);
    const toast = useRef(null);
    const storage = getStorage();

    const showSuccessToast = (message) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    };

    const showErrorToast = (message) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    };

    // delete request attachment file
    const handleDeleteFiles = async (fileName, fileURL) => {
        setDeleteFileDialog(true);
        setFileItemID(fileName);
        setState({
            ...state,
            fileName: fileName,
            fileURL: fileURL
        })
    };

    // show/hide delete request attachment file dialog
    const hideDeleteFileDialog = () => {
        setDeleteFileDialog(false);
    };

    // handle delete request attachment file
    const handleDeleteFile = async () => {
        try {
            const updateFileArr = FilesItem?.filter(url => url !== fileURL);
            const desertRef = ref(storage, `files/${fileItemID}`);
            deleteObject(desertRef).then(async () => {
                setDeleteFileDialog(false);
                showSuccessToast("File deleted successfully...");
                let saveState = {
                    ...item,
                    Files: updateFileArr
                };
                console.log("state...new", item);
                console.log("saveState...", saveState);
                await updateItem(LISTS.TRANSACTIONS.NAME, saveState.Id, saveState).then(() => {
                    const res = updateContext(transactions, saveState.Id, saveState);
                    console.log("res........", res);
                    setTransactions(res);
                    setUpdateFileState(saveState);
                });
            }).catch((error) => {
                showErrorToast(error);
            });
        } catch (error) {
            showErrorToast(error);
        }

    };

    const filesDisplayTemplate = (fileURL) => {
        const fileName = getFileNameFromUrl(fileURL);
        return (
            <div className="request-file-item">
                <div className="request-file-detail">
                    <div className="request-file-description"><a className="request-files-link" href={fileURL} data-interception="off" target="_blank" rel="noopener noreferrer" title={fileName}>{fileName}</a></div>
                </div>
                <div className="request-file-action">
                    <Button icon="pi pi-trash" text className="p-button-rounded p-button-danger" title="Delete File" onClick={() => handleDeleteFiles(fileName, fileURL)} />
                </div>
            </div>
        );
    };

    // delete request attachment file dialog footer component
    const deleteFileDialogFooter = (
        <React.Fragment>
            <Button title="No" label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFileDialog} />
            <Button title="Yes" label="Yes" icon="pi pi-check" onClick={handleDeleteFile} />
        </React.Fragment>
    );

    return (
        <Panel header="Attachment" toggleable>
            <Toast ref={toast} />
            <div className="request-file-datascroller request-attachment-files-div">
                {FilesItem.length > 0 && <DataScroller value={FilesItem} itemTemplate={filesDisplayTemplate} rows={5} inline scrollHeight="150px" header="Supporting Documents" />}
                <Dialog closeIcon={<i title="Close" className="pi pi-times"></i>} visible={deleteFileDialog} footer={deleteFileDialogFooter} style={{ width: '450px' }} header="Delete request attachment file" modal onHide={hideDeleteFileDialog}>
                    <div className="confirmation-content flex align-items-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        <span>Are you sure, you want to delete this file?</span>
                    </div>
                </Dialog>
            </div>
        </Panel>
    )
}

export default FileViewer