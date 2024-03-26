import { format } from "date-fns";
import { CASHFLOW } from "./constants";

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

// Function to calculateIncomeExpenseAndBalance
export const calculateIncomeExpenseAndBalance = (transactions) => {
    const { totalIncome, totalExpense } = transactions.reduce((acc, { Cashflow, Amount }) => {
        acc[Cashflow === CASHFLOW.Income ? 'totalIncome' : 'totalExpense'] += Amount;
        return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    const total = totalIncome + totalExpense;

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        incomePercentage: (totalIncome / total) * 100,
        expensePercentage: (totalExpense / total) * 100,
        balancePercentage: ((totalIncome - totalExpense) / total) * 100
    };
};