import {
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header/Header";
import StatBox from "../../components/StatBox/StatBox";
import { Button } from 'primereact/button';
import AccountBalance from "../../components/AccountBalance/AccountBalance";
import IncomeExpense from "../../components/IncomeExpense/IncomeExpense";
import RecentTransactions from "../../components/RecentTransactions/RecentTransactions";
import './Dashboard.css';
import { useContext } from "react";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { calculateIncomeExpenseAndBalance } from "../../common/commonFunction";

const Dashboard = () => {
  const { transactions } = useContext(ExpenseContext);
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const result = calculateIncomeExpenseAndBalance(transactions);
  const { totalIncome, totalExpense, balance, incomePercentage, expensePercentage, balancePercentage } = calculateIncomeExpenseAndBalance(transactions);
  console.log("transactions>>>>>>>>>>", transactions);
  
  return (
    <div style={{ margin: '20px' }}>
      {/* HEADER */}
      <div className="grid align-items-center">
        <div className="col-12 md:col-6 lg:col-8">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </div>
        <div className={`col-12 md:col-6 lg:col-4 ${smScreen ? 'flex justify-content-end' : null}`}>
          <Button label="Download Reports" icon='pi pi-download' raised />
        </div>
      </div>

      {/* GRID & CHARTS */}
      <div className="grid">
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title={totalIncome?.toLocaleString()}
              subtitle="Income"
              progress={incomePercentage / 100}
              increase={incomePercentage.toFixed(2) + '%'}
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title={totalExpense?.toLocaleString()}
              subtitle="Expenses"
              progress={expensePercentage / 100}
              increase={expensePercentage.toFixed(2) + '%'}
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title={balance?.toLocaleString()}
              subtitle="Balance"
              progress={balancePercentage / 100}
              increase={balancePercentage.toFixed(2) + '%'}
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title={transactions?.length}
              subtitle="Transactions"
              progress="0.80"
              increase="+43%"
            // icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12" style={{ border: '1px solid' }}>
          {/* <Pie /> */}
        </div>
        <div className="col-12 md:col-6">
          <AccountBalance />
        </div>
        <div className="col-12 md:col-6">
          <IncomeExpense />
        </div>
        <div className="col-12 md:col-12">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
