import { format } from "date-fns";

export const updateContext = (array, Id, state) => {
    return array?.map((ele) => {
        if (ele?.Id == Id) {
            return {
                ...state,
                _Day: format(new Date(state.TransactionDate), 'EEEE'),
                _Date: format(new Date(state.TransactionDate), 'dd/MM/yyyy'),
                _Time: format(new Date(state.TransactionTime), 'hh:mm a')
            };
        } else {
            return ele;
        }
    });
};

export const sortArray = (array) => {
    return array.sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate));
};

export const getFileNameFromUrl = (url) => {
    // Create a URL object
    const urlObject = new URL(url);

    // Get the pathname from the URL
    const pathname = decodeURIComponent(urlObject.pathname);

    // Extract the file name from the pathname
    const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);

    return fileName;
};