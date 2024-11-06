// src/algorithms/hrrn.js

function calculateResponseRatio(currentTime, arrivalTime, burstTime) {
    const waitingTime = currentTime - arrivalTime;
    return (waitingTime + burstTime) / burstTime;
  }
  
  export function hrrnScheduling(arrivalTimes, burstTimes) {
    const n = arrivalTimes.length;
    const completed = Array(n).fill(false);
    const processes = [];
    const ganttChartInfo = [];
    let currentTime = 0;
  
    const jobs = arrivalTimes.map((at, i) => ({
      job: i + 1,
      at,
      bt: burstTimes[i]
    }));
  
    while (completed.some(status => !status)) {
      const hrrnList = jobs
        .map((process, i) => ({
          index: i,
          responseRatio: calculateResponseRatio(currentTime, process.at, process.bt)
        }))
        .filter(({ index }) => jobs[index].at <= currentTime && !completed[index]);
  
      if (hrrnList.length === 0) {
        currentTime += 1;
        continue;
      }
  
      const { index: processIndex } = hrrnList.reduce((max, current) =>
        current.responseRatio > max.responseRatio ? current : max
      );
  
      const process = jobs[processIndex];
      const start = currentTime;
      const stop = parseFloat((currentTime + process.bt).toFixed(3));
  
      ganttChartInfo.push({ job: process.job, start, stop });
  
      const tat = parseFloat((stop - process.at).toFixed(3));
      const wt = parseFloat((tat - process.bt).toFixed(3));
  
      processes.push({
        job: process.job,
        arrivalTime: process.at,
        burstTime: process.bt,
        completionTime: stop,
        turnaroundTime: tat,
        waitingTime: wt
      });
  
      completed[processIndex] = true;
      currentTime = stop;
    }
  
    return { processes, ganttChartInfo };
  }  