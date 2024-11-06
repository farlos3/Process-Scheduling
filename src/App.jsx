import React, { useState } from 'react';
import './App.css';
import { fcfsScheduling } from './algorithms/fcfs';
// import { hrrnScheduling } from './algorithms/hrrn';
import { rrScheduling } from './algorithms/rr';
import { sjf } from './algorithms/sjf';
import { srtf } from './algorithms/srtf';
import { npp } from './algorithms/npp';
import { pp } from './algorithms/pp';
// import { mqf } from './algorithms/mqf';
import { calculateAverages } from './utils/calculateAverages';
import AverageChart from './utils/AverageChart';
import GanttChart from './utils/GanttChart';
import RandomInputGenerator from './utils/random';

function App() {
  const [isRandom, setIsRandom] = useState(false);
  const [arrivalTimes, setArrivalTimes] = useState('');
  const [burstTimes, setBurstTimes] = useState('');
  const [priorityValues, setPriorityValues] = useState('');
  const [timeQuantum, setTimeQuantum] = useState('');
  const [results, setResults] = useState([]);
  const colors = ['#9379C2', '#F9B69C', '#866667', '#E25D6E', '#FF8986', '#FAD6A6', '#01A6BA', '#F7D07A', '#4CAF50', '#D3E397'];

  const handleRandomGenerate = (randomValues) => {
    setArrivalTimes(randomValues.arrivalTimes);
    setBurstTimes(randomValues.burstTimes);
    setPriorityValues(randomValues.priorityValues);
    setTimeQuantum(randomValues.timeQuantum);
  };

  const handleCalculate = () => {
    try {
      const arrivalArray = arrivalTimes.trim().split(' ').map(Number);
      const burstArray = burstTimes.trim().split(' ').map(Number);
      const priorityArray = priorityValues.trim().split(' ').map(Number);
  
      if (arrivalArray.length !== burstArray.length) {
        alert("Arrival Time และ Burst Time ต้องมีจำนวนเท่ากัน");
        return;
      }
  
      const algorithms = [
        { name: 'FCFS', func: fcfsScheduling },
        // { name: 'HRRN', func: hrrnScheduling },
        { name: 'RR', func: rrScheduling, requiresQuantum: true },
        { name: 'SJF', func: sjf },
        { name: 'SRTF', func: srtf },
        { name: 'NPP', func: npp, requiresPriority: true },
        { name: 'PP', func: pp, requiresPriority: true }
        // { name: 'MQF', func: mqf, requiresQuantum: true }
      ];
  
      const newResults = algorithms.map(({ name, func, requiresQuantum, requiresPriority }) => {
        let schedulingResult;
      
        if (requiresQuantum && timeQuantum !== '') {
          schedulingResult = func(arrivalArray, burstArray, parseInt(timeQuantum));
        } else if (requiresPriority && priorityArray.length === arrivalArray.length) {
          schedulingResult = func(arrivalArray, burstArray, priorityArray);
        } else if (!requiresQuantum && !requiresPriority) {
          schedulingResult = func(arrivalArray, burstArray);
        } else {
          alert(`Algorithm ${name} requires additional input. Please check Time Quantum or Priority Values.`);
          return null;
        }
      
        if (schedulingResult && schedulingResult.processes) {
          const averages = calculateAverages(schedulingResult.processes);
          return { name, averages, ganttChartInfo: schedulingResult.ganttChartInfo || [] };
        } else {
          console.error(`No valid processes data for algorithm: ${name}`);
          return null;
        }
      }).filter(result => result !== null);

      setResults(newResults);
    } catch (error) {
      console.error("Error during calculation:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Process Scheduling Algorithms</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Arrival Times (e.g., 0 1 2 3)"
          value={arrivalTimes}
          onChange={(e) => setArrivalTimes(e.target.value)}
          className="input"
          disabled={isRandom}
        />
        <input
          type="text"
          placeholder="Burst Times (e.g., 3 4 2 1)"
          value={burstTimes}
          onChange={(e) => setBurstTimes(e.target.value)}
          className="input"
          disabled={isRandom}
        />
        <input
          type="text"
          placeholder="Priority Values (e.g., 1 2 3 4)"
          value={priorityValues}
          onChange={(e) => setPriorityValues(e.target.value)}
          className="input"
          disabled={isRandom}
        />
        <input
          type="text"
          placeholder="Time Quantum (Do not exceed 5)"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(e.target.value)}
          className="input"
          disabled={isRandom}
        />
        
        <RandomInputGenerator 
          onGenerate={handleRandomGenerate}
          onRandomToggle={(isRandomEnabled) => setIsRandom(isRandomEnabled)}
        />
        
        <button onClick={handleCalculate} className="button">Calculate</button>
      </div>

      {results.length > 0 && (
        <>
          <h2>Average Chart</h2>
          <AverageChart results={results} />

          <h2>Gantt Charts</h2>
          <div className="gantt-charts">
            {results.map(({ name, ganttChartInfo }, index) => (
              <GanttChart
                key={index}
                name={name}
                ganttChartInfo={ganttChartInfo}
                colors={colors}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;