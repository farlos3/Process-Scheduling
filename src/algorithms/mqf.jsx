export const mqf = (arrivalTime, burstTime, timeQuantum1 = 3, timeQuantum2 = 6) => {
  const processesInfo = arrivalTime.map((item, index) => {
    return {
      job: `P${index + 1}`,
      at: item,
      bt: burstTime[index],
      rt: burstTime[index], // Remaining Time
      completed: false,
    };
  }).sort((a, b) => a.at - b.at);

  const ganttChartInfo = [];
  const queue1 = []; // First Queue (RR with time quantum)
  const queue2 = []; // Second Queue (RR with time quantum)
  const queue3 = []; // Third Queue (FCFS)

  let currentTime = processesInfo[0]?.at || 0;
  let solvedProcessesInfo = [];
  let k = 0, r = 0;

  // Process queue1 with Round Robin time quantum
  processesInfo.forEach((proc, i) => {
    if (proc.rt <= timeQuantum1) {
      currentTime += proc.rt;
      ganttChartInfo.push({
        job: proc.job,
        start: currentTime - proc.rt,
        stop: currentTime,
      });
      proc.rt = 0;
      proc.completed = true;
      proc.ft = currentTime;
      proc.tat = proc.ft - proc.at;
      proc.wt = proc.tat - proc.bt;
      solvedProcessesInfo.push(proc);
    } else {
      queue2.push({
        ...proc,
        rt: proc.rt - timeQuantum1,
        completed: false,
      });
      ganttChartInfo.push({
        job: proc.job,
        start: currentTime,
        stop: currentTime + timeQuantum1,
      });
      currentTime += timeQuantum1;
    }
  });

  // Process queue2 with Round Robin time quantum
  queue2.forEach((proc) => {
    if (proc.rt <= timeQuantum2) {
      currentTime += proc.rt;
      ganttChartInfo.push({
        job: proc.job,
        start: currentTime - proc.rt,
        stop: currentTime,
      });
      proc.rt = 0;
      proc.completed = true;
      proc.ft = currentTime;
      proc.tat = proc.ft - proc.at;
      proc.wt = proc.tat - proc.bt;
      solvedProcessesInfo.push(proc);
    } else {
      queue3.push({
        ...proc,
        rt: proc.rt - timeQuantum2,
        completed: false,
      });
      ganttChartInfo.push({
        job: proc.job,
        start: currentTime,
        stop: currentTime + timeQuantum2,
      });
      currentTime += timeQuantum2;
    }
  });

  // Process queue3 with FCFS
  queue3.sort((a, b) => a.at - b.at).forEach((proc, i) => {
    const prevCompletionTime = i === 0 ? currentTime : queue3[i - 1].ft;
    proc.ft = prevCompletionTime + proc.rt;
    proc.tat = proc.ft - proc.at;
    proc.wt = proc.tat - proc.bt;
    proc.completed = true;
    ganttChartInfo.push({
      job: proc.job,
      start: prevCompletionTime,
      stop: proc.ft,
    });
    solvedProcessesInfo.push(proc);
  });

  solvedProcessesInfo = solvedProcessesInfo.sort((a, b) => {
    return a.at - b.at || a.job.localeCompare(b.job);
  });

  return {
    processes: solvedProcessesInfo,
    ganttChartInfo,
  };
};

export default mqf;