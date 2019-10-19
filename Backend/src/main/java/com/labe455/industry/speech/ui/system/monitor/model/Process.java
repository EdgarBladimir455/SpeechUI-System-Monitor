package com.labe455.industry.speech.ui.system.monitor.model;

/**
 * Representa un Proceso (Objeto) del sistema
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
public class Process {
	private String processID;
	private String user;
	private String priority;
	private String niceValue;
	private String virtualMemory;
	private String res;
	private String sharedMemory;
	private String S;
	private double cpuUsage;
	private double memUsage;
	private String hour;
	private String command;
	public String getProcessID() {
		return processID;
	}
	public void setProcessID(String processID) {
		this.processID = processID;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getNiceValue() {
		return niceValue;
	}
	public void setNiceValue(String niceValue) {
		this.niceValue = niceValue;
	}
	public String getVirtualMemory() {
		return virtualMemory;
	}
	public void setVirtualMemory(String virtualMemory) {
		this.virtualMemory = virtualMemory;
	}
	public String getRes() {
		return res;
	}
	public void setRes(String res) {
		this.res = res;
	}
	public String getSharedMemory() {
		return sharedMemory;
	}
	public void setSharedMemory(String sharedMemory) {
		this.sharedMemory = sharedMemory;
	}
	public String getS() {
		return S;
	}
	public void setS(String s) {
		S = s;
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
	public String getHour() {
		return hour;
	}
	public void setHour(String hour) {
		this.hour = hour;
	}
	public String getCommand() {
		return command;
	}
	public void setCommand(String command) {
		this.command = command;
	}	
		
}
