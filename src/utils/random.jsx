import React, { useState, useCallback } from 'react';

const RandomInputGenerator = ({ onGenerate }) => {
  const [isRandom, setIsRandom] = useState(false);
  const [processCount, setProcessCount] = useState('5');
  const [maxArrivalTime] = useState(10);
  const [maxBurstTime] = useState(10);
  const [maxPriority] = useState(5);

  const generateRandomValues = useCallback(() => {
    const count = parseInt(processCount);
    if (count > 1000) {
      alert('Please enter a number less than or equal to 1000');
      return;
    }

    const arrivalTimes = Array.from({ length: count }, 
      () => Math.floor(Math.random() * maxArrivalTime)).join(' ');
    const burstTimes = Array.from({ length: count }, 
      () => Math.floor(Math.random() * maxBurstTime) + 1).join(' ');
    const priorityValues = Array.from({ length: count }, 
      () => Math.floor(Math.random() * maxPriority) + 1).join(' ');
    const timeQuantum = Math.floor(Math.random() * 3) + 2;

    onGenerate({
      arrivalTimes,
      burstTimes,
      priorityValues,
      timeQuantum: timeQuantum.toString()
    });
  }, [processCount, maxArrivalTime, maxBurstTime, maxPriority, onGenerate]);

  const handleProcessCountChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for better typing experience
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 1000)) {
      setProcessCount(value);
    }
  };

  const handleBlur = () => {
    if (isRandom && processCount && parseInt(processCount) > 0 && parseInt(processCount) <= 1000) {
      generateRandomValues();
    }
  };

  const handleKeyPress = (e) => {
    // Allow only numbers and control keys
    if (!/[\d\b]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    
    // Generate on Enter key
    if (e.key === 'Enter' && isRandom && processCount && parseInt(processCount) > 0 && parseInt(processCount) <= 1000) {
      generateRandomValues();
    }
  };

  return (
    <div className="random-input-controls">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRandom}
          onChange={(e) => {
            setIsRandom(e.target.checked);
            if (e.target.checked && processCount && parseInt(processCount) > 0 && parseInt(processCount) <= 1000) {
              generateRandomValues();
            }
          }}
          className="w-4 h-4"
        />
        Use Random Input
      </label>
      
      {isRandom && (
        <div className="process-input">
          <label>Number of Processes:</label>
          <input
            type="text"
            value={processCount}
            onChange={handleProcessCountChange}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            className="process-count"
          />
          <span className="text-sm text-gray-500 ml-2">
            (Press Enter to Generate)
          </span>
        </div>
      )}
    </div>
  );
};

export default RandomInputGenerator;