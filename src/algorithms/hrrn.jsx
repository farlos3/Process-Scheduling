export const hrrnScheduling = (arrivalTime, burstTime) => {
  const processesInfo = arrivalTime.map((at, index) => ({
      job: `P${index + 1}`,
      at,
      bt: burstTime[index],
  }));

  console.log("Processes Info:", processesInfo); // เพิ่มตรงนี้

  const solvedProcessesInfo = [];
  const ganttChartInfo = [];
  const remainingProcesses = [...processesInfo];
  let currentTime = 0;

  while (remainingProcesses.length > 0) {
      let highestResponseRatio = -1;
      let selectedIndex = -1;

      for (let i = 0; i < remainingProcesses.length; i++) {
          const process = remainingProcesses[i];
          const waitingTime = currentTime - process.at;
          const responseRatio = (waitingTime + process.bt) / process.bt;

          if (process.at <= currentTime && responseRatio > highestResponseRatio) {
              highestResponseRatio = responseRatio;
              selectedIndex = i;
          }
      }

      if (selectedIndex === -1) {
          currentTime++;
          continue;
      }

      const process = remainingProcesses[selectedIndex];
      const startTime = currentTime;
      currentTime += process.bt;
      const finishTime = currentTime;

      ganttChartInfo.push({
          job: process.job,
          start: startTime,
          stop: finishTime,
      });

      solvedProcessesInfo.push({
          ...process,
          ft: finishTime,
          tat: finishTime - process.at,
          wat: finishTime - process.at - process.bt,
      });

      remainingProcesses.splice(selectedIndex, 1);
  }

  return {
      processes: solvedProcessesInfo,
      ganttChartInfo,
  };
};

export default hrrnScheduling;