package com.labe455.industry.speech.ui.system.monitor.model;

/**
 * Representa un Proceso (Objeto) del sistema
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
public class Process {
	private long processID;
	private String user;
	private int priority;
	private int niceValue;
	private double virtualMemory;
	private int res;
	private int sharedMemory;
	private String S;
	private double cpuUsage;
	private double memUsage;
	private String hour;
	private String command;
	
	public long getProcessID() {
		return processID;
	}
	public void setProcessID(long processID) {
		this.processID = processID;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	public int getNiceValue() {
		return niceValue;
	}
	public void setNiceValue(int niceValue) {
		this.niceValue = niceValue;
	}
	public double getVirtualMemory() {
		return virtualMemory;
	}
	public void setVirtualMemory(double virtualMemory) {
		this.virtualMemory = virtualMemory;
	}
	public int getRes() {
		return res;
	}
	public void setRes(int res) {
		this.res = res;
	}
	public int getSharedMemory() {
		return sharedMemory;
	}
	public void setSharedMemory(int sharedMemory) {
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
