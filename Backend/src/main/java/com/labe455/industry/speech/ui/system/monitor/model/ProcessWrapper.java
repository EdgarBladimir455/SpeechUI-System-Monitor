package com.labe455.industry.speech.ui.system.monitor.model;

import java.util.List;

/**
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 27/10/2019
 */
public class ProcessWrapper {
	
	private List<Process> processList;
	private double cpuUsage;
	private double cores;	
	private double memUsage;
	private Disk disk;
	
	public List<Process> getProcessList() {
		return processList;
	}
	public void setProcessList(List<Process> processList) {
		this.processList = processList;
	}
	public double getCpuUsage() {
		return cpuUsage;
	}
	public void setCpuUsage(double cpuUsage) {
		this.cpuUsage = cpuUsage;
	}
	public double getMemUsage() {
		return memUsage;
	}
	public void setMemUsage(double memUsage) {
		this.memUsage = memUsage;
	}
	public Disk getDisk() {
		return disk;
	}
	public void setDisk(Disk disk) {
		this.disk = disk;
	}
	public double getCores() {
		return cores;
	}
	public void setCores(double cores) {
		this.cores = cores;
	}			
}
