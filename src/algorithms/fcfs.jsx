export const fcfsScheduling = (arrivalTime, burstTime) => {
  // Create an array of processes with job name, arrival time, and burst time.
  const processesInfo = arrivalTime
    .map((item, index) => {
      return {
        job: `P${index + 1}`, // ใช้รูปแบบ P1, P2, P3
        at: item, // Arrival time
        bt: burstTime[index], // Burst time
      };
    })
    .sort((obj1, obj2) => {
      // Sort processes by arrival time
      return obj1.at - obj2.at;
    });

  let finishTime = [];
  let ganttChartInfo = [];

  // Calculate each process's finish time, waiting time, and turnaround time
  const solvedProcessesInfo = processesInfo.map((process, index) => {
    if (index === 0 || process.at > finishTime[index - 1]) {
      // If process arrives after the last process finishes
      finishTime[index] = process.at + process.bt;

      ganttChartInfo.push({
        job: process.job,
        start: process.at,
        stop: finishTime[index],
      });
    } else {
      // If process arrives before or when the last process finishes
      finishTime[index] = finishTime[index - 1] + process.bt;

      ganttChartInfo.push({
        job: process.job,
        start: finishTime[index - 1],
        stop: finishTime[index],
      });
    }

    return {
      ...process,
      completionTime: finishTime[index], // Finish time renamed to completionTime
      turnaroundTime: finishTime[index] - process.at, // Turnaround time renamed to turnaroundTime
      waitingTime: finishTime[index] - process.at - process.bt, // Waiting time renamed to waitingTime
    };
  });

  return {
    processes: solvedProcessesInfo,
    ganttChartInfo,
  };
};