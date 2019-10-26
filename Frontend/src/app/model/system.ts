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

export class Settings {
  ip: string = 'localhost:8080';
  spConfMsg: boolean = false;
  spErrorMsg: boolean = true;
  spRespMsg: boolean = true;
  speechType: string = '1';
}


export interface CommandResponse {
  commandParam: string;
  command: string;
  commandType: string;
}