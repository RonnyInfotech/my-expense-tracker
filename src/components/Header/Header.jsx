import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import './Header.css';

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div style={{ marginBottom: '30px' }}>
      <div className="header-title">
        {title}
      </div>
      <div className="header-sub-title">
        {subtitle}
      </div>
    </div>
  );
};

export default Header;
