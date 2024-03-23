import { CASHFLOW } from "../common/constants";
export class expense {
    Id = null;
    Cashflow = CASHFLOW.Expense;
    Description = '';
    TransactionDate = new Date();
    TransactionTime = new Date();
    PaymentMode = null;
    Category = null;
    Amount = null;
    Files = null;
}