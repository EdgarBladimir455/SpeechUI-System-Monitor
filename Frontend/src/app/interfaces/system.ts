export interface Process {
    processID: string;
    user: string;
    priority: string;
    niceValue: string;
    virtualMemory: string;
    res: string;
    sharedMemory: string;
    S: string;
    cpuUsage: number;
    memUsage: number;
    hour: string;
    command: string;
}
