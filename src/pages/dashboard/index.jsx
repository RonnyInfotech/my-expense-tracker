import {
  Box,
  // Button,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { Button } from 'primereact/button';
import Pie from "./../pie";
import './Dashboard.css';
import AccountBalance from "../../components/AccountBalance/AccountBalance";
import IncomeExpense from "../../components/IncomeExpense/IncomeExpense";
import RecentTransactions from "../../components/RecentTransactions/RecentTransactions";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
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
              title="12,361"
              subtitle="Income"
              progress="0.75"
              increase="+14%"
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title="431,225"
              subtitle="Expenses"
              progress="0.50"
              increase="+21%"
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title="32,441"
              subtitle="Balance"
              progress="0.30"
              increase="+5%"
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-6 xl:col-3">
          <div className="dashboard-wrapper">
            <StatBox
              title="1,325,134"
              subtitle="Transactions"
              progress="0.80"
              increase="+43%"
              icon={<i className="fa fa-inr" aria-hidden="true" style={{ fontSize: '26px' }} />}
            />
          </div>
        </div>
        <div className="col-12" style={{ border: '1px solid' }}>
          <Pie />
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
