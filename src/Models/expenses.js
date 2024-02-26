import { CASHFLOW } from "../common/constants";
export class expense {
    Id = null;
    Cashflow = CASHFLOW.Expense;
    Description = '';
    TransactionDate = null;
    TransactionTime = null;
    PaymentMode = null;
    Category = null;
    Amount = null;
    Files = null;
}