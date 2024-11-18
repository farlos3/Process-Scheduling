# Process-Scheduling

URL : https://farlos3.github.io/Process-Scheduling/

## Algorithm
### 1. First Come First Serve (FCFS)
Function: fcfsScheduling(arrivalTime, burstTime)
Description:
Processes are executed in the order of their arrival time. The process that arrives first is processed first, without preemption.

### 2. Highest Response Ratio Next (HRRN)
Function: hrrnScheduling(arrivalTime, burstTime)
Description:
The process with the highest response ratio is selected for execution.
Response Ratio = (Waiting Time + Burst Time) / Burst Time.
This method ensures a balance between waiting time and burst time.

### 3. Multilevel Queue Scheduling (MQF)
Function: mqf(arrivalTime, burstTime, timeQuantum1, timeQuantum2)
Description:
Processes are divided into three queues based on priority or arrival time:

- Queue 1: Executed using Round Robin (RR) with a smaller time quantum (timeQuantum1, default: 3).
- Queue 2: Remaining processes are processed using Round Robin with a larger time quantum (timeQuantum2, default: 6).
- Queue 3: Remaining processes are executed using First Come First Serve (FCFS).

### 4. Non-Preemptive Priority Scheduling (NPP)
Function: npp(arrivalTime, burstTime, priority)
Description:
Processes are scheduled based on priority, with the process having the highest priority executed first. If two processes have the same priority, the one arriving first is processed first.

### 5. Preemptive Priority Scheduling (PP)
Function: pp(arrivalTime, burstTime, priority)
Description:
Similar to Non-Preemptive Priority Scheduling, but processes can be preempted if a higher-priority process arrives during execution.

### 6. Round-Robin Scheduling (RR)
Function: rrScheduling(arrivalTime, burstTime, timeQuantum)
Description:
Processes are executed in a cyclic order, with each process receiving a fixed time quantum for execution. Remaining burst time is carried over to the next round if not completed.

### 7. Shortest Job First (SJF)
Function: sjf(arrivalTime, burstTime)
Description:
The process with the shortest burst time is executed first. If two processes have the same burst time, the one arriving earlier is processed first.

### 8. Shortest Remaining Time First (SRTF)
Function: srtf(arrivalTime, burstTime)
Description:
A preemptive version of SJF. Processes are dynamically scheduled based on the shortest remaining burst time, allowing preemption when a process with a shorter burst time arrives.
