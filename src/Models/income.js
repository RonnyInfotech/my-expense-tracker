import { CASHFLOW } from "../common/constants";
export class income {
    Id = null;
    Cashflow = CASHFLOW.Income;
    Description = '';
    TransactionDate = new Date();
    TransactionTime = new Date();
    PaymentMode = null;
    Category = null;
    Amount = null;
    Files = null;
}