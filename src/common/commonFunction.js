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


export const sumAndPercentageSimilarCategories = (transactions) => {
    const categorySums = {};
    let totalAmount = 0;

    transactions.filter((ele) => ele.Cashflow === CASHFLOW.Expense).forEach(transaction => {
        const { Amount, Category } = transaction;
        const { code, color, name } = Category;

        totalAmount += Amount;

        if (!categorySums[code]) {
            categorySums[code] = {
                sum: 0,
                color,
                name
            };
        }

        categorySums[code].sum += Amount;
    });

    // Convert object to array and calculate percentage
    const sumsArray = Object.entries(categorySums).map(([code, { sum, color, name }]) => ({
        code,
        sum,
        percentage: ((sum / totalAmount) * 100).toFixed(2) + '%',
        color,
        name
    }));

    return sumsArray;
};

export const calculateIncomeAndExpenseByMonth = (transactions) => {
    const result = {};

    transactions.forEach(transaction => {
        const { TransactionDate, Cashflow, Amount } = transaction;
        const date = new Date(TransactionDate);
        const month = date.toLocaleString('en-US', { month: 'long' });

        if (!result[month]) {
            result[month] = {
                income: 0,
                expense: 0,
                balance: 0,
                month
            };
        }

        if (Cashflow === CASHFLOW.Income) {
            result[month].income += Amount;
        } else {
            result[month].expense += Amount;
        }

        // Update balance
        result[month].balance = result[month].income - result[month].expense;
    });

    // Convert result object to array
    return Object.values(result);
}