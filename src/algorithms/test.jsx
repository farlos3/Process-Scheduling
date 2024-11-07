function createProcess(pid, burstTime) {
    return {
      pid: pid,  // process id
      burst_time: burstTime,  // total CPU burst time needed
      remaining_time: burstTime,  // remaining burst time
      completion_time: 0  // completion time of the process
    };
  }
  
  export function mqf(arrivalTimes, burstTimes, timeQuantum) {
    const n = arrivalTimes.length;
    const processesInfo = Array.from({ length: n }, (_, i) => createProcess(i + 1, burstTimes[i]));
    const processes = [];
    const ganttChartInfo = [];
    const queues = [[], [], []];  // Example with 3 priority levels
    let time = 0;
    const completed = Array(n).fill(false);
  
    // Initializing the highest priority queue with processes that arrived at time 0
    processesInfo.forEach((process, i) => {
      if (arrivalTimes[i] <= time) {
        queues[0].push(process);
      }
    });
  
    while (completed.some(c => !c)) {
      for (let level = 0; level < queues.length; level++) {
        if (queues[level].length === 0) continue;
  
        const process = queues[level].shift();
        const processId = process.pid;
        const executionTime = Math.min(timeQuantum, process.remaining_time);
        const startTime = time;
        time += executionTime;
        process.remaining_time -= executionTime;
  
        // Record Gantt chart information
        ganttChartInfo.push({
          job: processId,
          start: startTime,
          stop: time
        });
  
        if (process.remaining_time === 0) {
          completed[processId - 1] = true;
          process.completion_time = time;
          const tat = Math.round((time - arrivalTimes[processId - 1]) * 1000) / 1000; // Turnaround time
          const wt = Math.round((tat - burstTimes[processId - 1]) * 1000) / 1000; // Waiting time
          processes.push({
            job: `P${processId}`,
            arrivalTime: arrivalTimes[processId - 1],
            burstTime: burstTimes[processId - 1],
            completionTime: time,
            turnaroundTime: tat,
            waitingTime: wt
          });
        } else {
          // Move to the next queue level or back to the current one if it’s the last level
          const nextLevel = level < queues.length - 1 ? level + 1 : level;
          queues[nextLevel].push(process);
        }
  
        // Add any new arrivals to the highest priority queue
        processesInfo.forEach((p, i) => {
          if (arrivalTimes[i] <= time && !completed[i] && !queues[0].includes(p)) {
            queues[0].push(p);
          }
        });
  
        break; // Break to start from the highest-priority queue again
      }
    }
  
    return { processes, ganttChartInfo };
  }