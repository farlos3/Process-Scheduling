// src/utils/calculateAverages.jsx
export const calculateAverages = (processes) => {
  if (!processes || processes.length === 0) {
    return {
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0
    };
  }

  // สร้างฟังก์ชันช่วยในการคำนวณค่าเฉลี่ย
  const calculateAverage = (values) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Number((sum / values.length).toFixed(3));
  };

  // คำนวณ Waiting Time
  const waitingTimes = processes.map(process => {
    // ตรวจสอบชื่อ property ที่อาจแตกต่างกันในแต่ละ algorithm
    if (process.waitingTime !== undefined) {
      return process.waitingTime;
    } else if (process.wat !== undefined) {
      return process.wat;
    }
    // คำนวณ waiting time จาก turnaround time - burst time
    return (process.turnaroundTime || process.tat) - process.bt;
  });

  // คำนวณ Turnaround Time
  const turnaroundTimes = processes.map(process => {
    if (process.turnaroundTime !== undefined) {
      return process.turnaroundTime;
    } else if (process.tat !== undefined) {
      return process.tat;
    }
    // คำนวณ turnaround time จาก completion time - arrival time
    return (process.completionTime || process.ft) - process.at;
  });

  // คำนวณ Response Time
  const responseTimes = processes.map(process => {
    // Response time คือเวลาที่ process เริ่มทำงานครั้งแรก - arrival time
    const firstExecution = process.firstResponse || process.at; // ถ้าไม่มี firstResponse ให้ใช้ arrival time
    return firstExecution - process.at;
  });

  return {
    avgWaitingTime: calculateAverage(waitingTimes),
    avgTurnaroundTime: calculateAverage(turnaroundTimes),
  };
};

// ฟังก์ชันสำหรับคำนวณ throughput
export const calculateThroughput = (processes) => {
  if (!processes || processes.length === 0) return 0;
  
  // หาเวลาทั้งหมดที่ใช้ในการทำงาน
  const lastCompletionTime = Math.max(
    ...processes.map(p => p.completionTime || p.ft)
  );
  
  // throughput = จำนวน processes / เวลาทั้งหมด
  return Number((processes.length / lastCompletionTime).toFixed(3));
};

// ฟังก์ชันสำหรับคำนวณ CPU Utilization
export const calculateCPUUtilization = (processes, ganttChartInfo) => {
  if (!processes || !ganttChartInfo || processes.length === 0) return 0;
  
  // หาเวลาทั้งหมดที่ CPU ทำงาน
  const totalCPUTime = ganttChartInfo.reduce((total, slot) => {
    return total + (slot.stop - slot.start);
  }, 0);
  
  // หาเวลาทั้งหมดตั้งแต่เริ่มต้นจนจบ
  const totalTime = Math.max(...ganttChartInfo.map(slot => slot.stop)) - 
                   Math.min(...ganttChartInfo.map(slot => slot.start));
  
  return Number(((totalCPUTime / totalTime) * 100).toFixed(3));
};