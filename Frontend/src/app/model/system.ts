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
  customId: string;
}

export interface ProcessWrapper {
  processList: Process[];
  cpuUsage: number;
  memUsage: number;
}

export class Settings {
  ip: string = 'localhost:8080';
  spConfMsg: boolean = false;
  spErrorMsg: boolean = true;
  spRespMsg: boolean = true;
  speechType: string = '1';
  playRecordedAudio: boolean = false;
}


export interface CommandResponse {
  commandParam: string;
  command: string;
  commandType: string;
}