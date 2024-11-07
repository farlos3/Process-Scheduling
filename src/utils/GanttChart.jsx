import React from 'react';

const GanttChart = ({ name, ganttChartInfo, colors }) => {
  const processColors = {};

  const letterToNumber = (input) => {
    if (!isNaN(input)) return input;
    if (typeof input === 'string') {
      const letters = input.toUpperCase().split('');
      return letters.reduce((total, letter, index) => {
        const power = letters.length - 1 - index;
        const value = letter.charCodeAt(0) - 64;
        return total + value * Math.pow(26, power);
      }, 0);
    }
    return 0;
  };

  const totalTime = ganttChartInfo[ganttChartInfo.length - 1].stop;

  return (
    <div className="gantt-container">
      <div className="chart-title">{name}</div>
      <div className="gantt-chart">
        {ganttChartInfo.map(({ job, start, stop }, index) => {
          if (!processColors[job]) {
            processColors[job] = colors[index % colors.length];
          }

          const widthPercentage = ((stop - start) / totalTime) * 100;
          const leftPercentage = (start / totalTime) * 100;
          const processNumber = letterToNumber(job);

          return (
            <div
              key={index}
              className="gantt-block"
              style={{
                width: `${widthPercentage}%`,
                left: `${leftPercentage}%`,
                backgroundColor: processColors[job],
              }}
            >
              {job}
            </div>
          );
        })}
      </div>
      
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {/* Always show 0 marker */}
        <div className="time-marker" style={{ left: '0%' }}>
          <div className="marker-line"></div>
          <div className="marker-text">0</div>
        </div>
        {/* Show other time markers */}
        {ganttChartInfo.map(({ start, stop }, index) => (
          <React.Fragment key={`marker-${index}`}>
            {start > 0 && (
              <div className="time-marker" 
              style={{ 
                left: `${(start / totalTime) * 100}%`, transform: 'translateX(-50%)',
                }}>
                <div className="marker-line"></div>
                <div className="marker-text">{start.toFixed(0)}</div>
              </div>
            )}
            <div className="time-marker" 
            style={{ left: `${(stop / totalTime) * 100}%`, transform: 'translateX(-50%)',
            }}>
              <div className="marker-line"></div>
              <div className="marker-text">{stop.toFixed(0)}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;