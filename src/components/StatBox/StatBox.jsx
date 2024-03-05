import { useTheme } from "@mui/material";
import ProgressCircle from "../ProgressCircle";
import { tokens } from "../../theme";
import './StatBox.css';

const StatBox = ({ title, subtitle, progress, increase, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="w-full" style={{ margin: '20px 30px' }}>
      <div className="flex justify-content-between">
        <div className="flex">
          {icon}
          <div className="dashboard-tile-amount ml-2">
            {title}
          </div>
        </div>
        <div>
          <ProgressCircle progress={progress} />
        </div>
      </div>
      <div className="flex justify-content-between" style={{ marginTop: '2px' }}>
        <div className="dashboard-tile-title">
          {subtitle}
        </div>
        <div className="dashboard-tile-per">
          {increase}
        </div>
      </div>
    </div>
  );
};

export default StatBox;
