// docs https://github.com/azouaoui-med/react-pro-sidebar
import { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";

import { useSidebarContext } from "./sidebarContext";

import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";

import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";
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
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const MyProSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  return (
    <div className="side-bar-menu">
      <Sidebar
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
                <h2>
                  Bhautik Ladva
                </h2>
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
              to="/team"
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
              to="/invoices"
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
            <h6 className="menu-header">
              Charts
            </h6>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
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
