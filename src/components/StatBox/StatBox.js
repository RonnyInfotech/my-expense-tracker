import ProgressCircle from "../ProgressCircle";
import './StatBox.css';

const StatBox = ({ className, title, subtitle, progress, increase, icon }) => {

  return (
    <div className="w-full" style={{ margin: '20px 30px' }}>
      <div className="flex justify-content-between">
        <div className="flex">
          {icon}
          <div className={`dashboard-tile-amount ml-2 ${className}`}>
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
