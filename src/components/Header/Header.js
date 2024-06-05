import React from "react";
import './Header.css';

const Header = ({ title, subtitle }) => {

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
