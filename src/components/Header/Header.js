import React from "react";
import './Header.css';

const Header = ({ title, subtitle }) => {

  return (
    <div className="mb-4">
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
