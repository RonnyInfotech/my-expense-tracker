// docs https://github.com/azouaoui-med/react-pro-sidebar
import { useContext, useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarContext } from "./sidebarContext";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Typography } from "@mui/material";
import { calculateIncomeExpenseAndBalance } from "../../../common/commonFunction";
import { ExpenseContext } from "../../../contexts/ExpenseContext";
import './MyProSidebar.css';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <p>{title}</p>
    </MenuItem>
  );
};

const MyProSidebar = () => {
  const { transactions } = useContext(ExpenseContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();

  const { balance } = calculateIncomeExpenseAndBalance(transactions);

  const formatCurrency = (value) => {
    return value.toLocaleString('en-IN', { style: 'currency', maximumFractionDigits: 2, currency: 'INR' });
  };

  return (
    <div className="side-bar-menu">
      <Sidebar
        defaultCollapsed={true}
        breakPoint="md"
        rtl={sidebarRTL}
        backgroundColor={colors.primary[400]}
        image={sidebarImage}
        transitionDuration={1000}
      >
        <Menu iconshape="square">
          <MenuItem
            icon={
              collapsed ? <i className="pi pi-bars" onClick={() => collapseSidebar()} />
                : sidebarRTL ?
                  <i className="pi pi-caret-left" onClick={() => setSidebarRTL(!sidebarRTL)} /> :
                  <i className="pi pi-caret-right" onClick={() => setSidebarRTL(!sidebarRTL)} />
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <div className="side-bar-label">
                <h3>
                  EXPENSE
                </h3>
                <i className="pi pi-times" onClick={broken ? () => toggleSidebar() : () => collapseSidebar()} />
              </div>
            )}
          </MenuItem>
          {!collapsed &&
            <div style={{ marginBottom: '25px' }}>
              <div className="user-image-wrapper">
                <img
                  className="avatar-image"
                  alt="profile user"
                  width="100px"
                  height="100px"
                  src={"../../assets/user.png"}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2>Bhautik Ladva</h2>
                <div className='wallet-container'>
                  <span style={{ height: '27px' }}><img src={require('../../../assets/Images/cash-wallet.png')} alt="Cash Wallet" style={{ width: '23px' }} /></span>
                  <span className="current-balance ml-2">{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>
          }
          <div style={{ paddingLeft: collapsed ? undefined : '10%' }}>
            <Item
              title="Dashboard"
              to="/"
              icon={<i className="pi pi-home" />}
              selected={selected}
              setSelected={setSelected}
            />
            <h5 className="menu-header">
              Transactions
            </h5>
            <Item
              title="Income"
              to="/income"
              icon={<i className="fa fa-inr" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Expense"
              to="/expense"
              icon={<i className="fa fa-inr" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="All Transactions"
              to="/allTransactions"
              icon={<i className="fa fa-list-alt" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />

            <h5 className="menu-header">
              Admin
            </h5>
            <Item
              title="Categories"
              to="/form"
              icon={<i className="fa fa-archive" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Report"
              to="/calendar"
              icon={<i className="fa fa-calendar-o" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<i className="fa fa-question-circle-o" aria-hidden="true" />}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default MyProSidebar;
