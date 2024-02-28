import React, { createContext, useEffect, useState } from 'react';
import { getAllItems } from '../services/firebaseService';
import { CASHFLOW, LISTS } from '../common/constants';
import { format } from 'date-fns';

export const ExpenseContext = createContext(null);

const ExpenseContextProvider = (props) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [blocked, setBlocked] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const getTransactionsData = async () => {
        setBlocked(true);
        const result = await getAllItems(LISTS.TRANSACTIONS.NAME);
        result.map((ele) => {
            ele.Day = format(new Date(ele.TransactionDate.seconds * 1000), 'EEEE');
            ele._Date = format(new Date(ele.TransactionDate.seconds * 1000), 'dd/MM/yyyy');
            ele._Time = format(new Date(ele.TransactionTime.seconds * 1000), 'hh:mm a');
            ele.TransactionDate = new Date(ele.TransactionDate.seconds * 1000);
            ele.TransactionTime = new Date(ele.TransactionTime.seconds * 1000);
        })
        console.log("result..", result)
        if (result.length > 0) {
            setIncomes(result.filter(ele => ele.Cashflow == CASHFLOW.Income));
            setExpenses(result.filter(ele => ele.Cashflow == CASHFLOW.Expense));
            setTransactions(result || []);
            setBlocked(false);
        }
        setBlocked(false);
    };

    useEffect(() => {
        getTransactionsData();
    }, []);

    return (
        <ExpenseContext.Provider
            value={{
                incomes,
                setIncomes,
                expenses,
                setExpenses,
                transactions,
                setTransactions,
                blocked,
                setBlocked
            }}>
            {props.children}
        </ExpenseContext.Provider>
    )
}

export default ExpenseContextProvider;