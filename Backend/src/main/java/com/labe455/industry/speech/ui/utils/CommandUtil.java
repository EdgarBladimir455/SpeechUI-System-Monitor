package com.labe455.industry.speech.ui.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.labe455.industry.speech.ui.system.monitor.model.Process;
import com.labe455.industry.speech.ui.system.monitor.model.ProcessWrapper;
import com.labe455.industry.speech.ui.exceptions.CommandNotValidException;

/**
 * Utilidad general para obtener usar comandos del sistema operativo linux
 * (procesos, memoria, cpu, disco, etc).
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
public class CommandUtil {
	
	private static String getUser() throws IOException {
		ProcessBuilder builder = new ProcessBuilder("whoami");
		java.lang.Process javaProc = builder.start();
		String currentUser = "";
		try (BufferedReader stdin = new BufferedReader(new InputStreamReader(javaProc.getInputStream()))) {
			String line;
			while ((line = stdin.readLine()) != null) {
				currentUser = line;
			}
		}
		
		return currentUser;
	}

	public static ProcessWrapper getProcessInfo() throws IOException {
		List<Process> processList = new ArrayList<Process>();

		String currentUser = getUser();

		ProcessBuilder builder = new ProcessBuilder("top", "-b", "-n", "1");
		java.lang.Process javaProc = builder.start();

		try (BufferedReader stdin = new BufferedReader(new InputStreamReader(javaProc.getInputStream()))) {

			String line;

			// Blank line indicates end of summary.
			while ((line = stdin.readLine()) != null) {
				if (line.isEmpty()) {
					break;
				}
			}

			// Skip header line.
			if (line != null) {
				line = stdin.readLine();
			}

			while ((line = stdin.readLine()) != null) {

				Process proc = new Process();
				List<String> elements = new ArrayList<String>();
				StringBuilder strBuilder = new StringBuilder();
				char aBefore = line.charAt(0);

				for (int i = 0; i < line.length(); i++) {

					char a = line.charAt(i);

					if ((a != 32)) {
						strBuilder.append(a);
					} else {
						if ((aBefore != 32)) {
							elements.add(strBuilder.toString());
							strBuilder = new StringBuilder();
						}
					}
					aBefore = line.charAt(i);
				}

				elements.add(strBuilder.toString());

				proc.setProcessID(elements.get(0));
				proc.setUser(elements.get(1));
				proc.setPriority(elements.get(2));
				proc.setNiceValue(elements.get(3));
				proc.setVirtualMemory(elements.get(4));
				proc.setRes(elements.get(5));
				proc.setSharedMemory(elements.get(6));
				proc.setS(elements.get(7));
				proc.setCpuUsage(Double.parseDouble(elements.get(8)));
				proc.setMemUsage(Double.parseDouble(elements.get(9)));
				proc.setHour(elements.get(10));
				proc.setCommand(elements.get(11));

				if (proc.getUser().equals(currentUser)) {
					processList.add(proc);
				}

			}

		}
		
		processList.sort(Comparator.comparing(Process::getCommand));
		
		List<Double> cpuProcessList = processList.stream()
											 	 .map(Process::getCpuUsage)
											 	 .collect(Collectors.toList());
		
		List<Double> memProcessList = processList.stream()
											 	 .map(Process::getMemUsage)
											 	 .collect(Collectors.toList());			
		
		ProcessWrapper processWrapper = new ProcessWrapper();
		
		processWrapper.setProcessList(processList);
		processWrapper.setCores(getCores());
		processWrapper.setCpuUsage(getCPUUsage(cpuProcessList));
		processWrapper.setMemUsage(getMemoryUsage(memProcessList));		

		return processWrapper;
	}

	public static double getMemoryUsage(List<Double> memPorcessList) {
		double memUsage = 0;
		
		for (double memProcess : memPorcessList) {
			memUsage += memProcess;
		}
		return memUsage;
	}

	public static double getCores() throws IOException {
		ProcessBuilder builder = new ProcessBuilder("nproc");
		java.lang.Process javaProc = builder.start();
		double cores = 0;
		try (BufferedReader stdin = new BufferedReader(new InputStreamReader(javaProc.getInputStream()))) {
			String line;
			while ((line = stdin.readLine()) != null) {
				cores = Double.parseDouble(line);
			}
		}
		
		return cores;
	}
	
	public static double getCPUUsage(List<Double> cpuPorcessList) throws IOException {
		double cores = getCores();
		double cpuUsage = 0;
		for (double cpuProcess : cpuPorcessList) {
			cpuUsage += cpuProcess;
		}
		
		cpuUsage = cpuUsage / cores;
		return cpuUsage;
	}

	public static void getDiskInfo() {

	}

	public static void killProcessByName(String name) throws IOException, CommandNotValidException {
		ProcessBuilder builder = new ProcessBuilder("killall", name);
		java.lang.Process javaProc = builder.start();

		try (BufferedReader stdin = new BufferedReader(new InputStreamReader(javaProc.getErrorStream()))) {
			String line;
			while ((line = stdin.readLine()) != null) {
				System.out.println(line);
				throw new CommandNotValidException("No se pudo terminar el proces o");
			}

		}
	}
	
	public static void killProcessById(String pid) throws IOException, CommandNotValidException {
		ProcessBuilder builder = new ProcessBuilder("kill", pid);
		java.lang.Process javaProc = builder.start();

		try (BufferedReader stdin = new BufferedReader(new InputStreamReader(javaProc.getErrorStream()))) {
			String line;
			while ((line = stdin.readLine()) != null) {
				System.out.println(line);
				throw new CommandNotValidException("No se pudo terminar el proces o");
			}

		}
	}

}
