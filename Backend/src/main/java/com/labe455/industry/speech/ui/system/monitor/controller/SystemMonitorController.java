package com.labe455.industry.speech.ui.system.monitor.controller;

import java.io.IOException;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.labe455.industry.speech.ui.exceptions.CommandNotValidException;
import com.labe455.industry.speech.ui.system.monitor.model.ProcessWrapper;
import com.labe455.industry.speech.ui.utils.CommandUtil;

/**
 * (Opcional, para control manual NO-SpeechUI) Encargado de procesar las
 * peticiones del front relacionadas con la informacion del sistema.
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
@RestController
@RequestMapping("/monitor")
@CrossOrigin(origins = "*")
public class SystemMonitorController {
	
	private ProcessWrapper processWrapper = new ProcessWrapper();

	private SseEmitter emitter;

	private Thread scheduleThread;
	
	public static HashMap<String, String> processesIds = new HashMap<String, String>();
		
	private void setCustomProcessesIds() {
		for (int i=0; i<processWrapper.getProcessList().size(); i++) {
			String processId = processWrapper.getProcessList().get(i).getProcessID();			
			processesIds.put(Integer.toString(i), processId);
			processWrapper.getProcessList().get(i).setCustomId(Integer.toString(i));
		}
	}
	
	private void setScheduleThread() {
		
		emitter = new SseEmitter();				
		
		Runnable runnable = new Runnable() {
			@SuppressWarnings("static-access")
			public void run() {
				
				emitter.onError((throwable) -> {
					System.out.println("error en el emitter: ");
					System.out.println(throwable.getCause());
					if ( scheduleThread != null && !scheduleThread.isInterrupted()) {
						System.out.println("Interrumpiendo schedule thread");				
						scheduleThread.interrupt();
					}
				});
				
				emitter.onCompletion(() -> {
					System.out.println("Completando la sesion");
					if (scheduleThread != null && !scheduleThread.isInterrupted()) {
						System.out.println("Interrumpiendo schedule thread");				
						scheduleThread.interrupt();
					}
				});
				
				emitter.onTimeout(() -> {
					System.out.println("Timeout...");
					if (scheduleThread != null && !scheduleThread.isInterrupted()) {
						System.out.println("Interrumpiendo schedule thread");				
						scheduleThread.interrupt();
					}
				});	
				
				while (!scheduleThread.interrupted()) {
					
					scheduleThread.yield();

					try {
						processWrapper = CommandUtil.getProcessInfo();
						setCustomProcessesIds();											
						emitter.send(processWrapper);
						scheduleThread.sleep(3000);
					} catch (IllegalStateException e) {
						System.out.println("Se mando mensaje pero ya se habia cerrado la conexion");
						System.out.println(e);

					} catch (IOException e) { // Se mando mensaje, pero ya no existe una conexion en el emitter
						System.out.println("Se mando mensaje, pero ya no existe una conexion en el emitter");
						System.out.println(e);
						emitter.complete(); // No funciona, no hace trigger
						System.out.println("Interrumpiendo schedule thread");
						
						/*
						 * Se interrumpe el hilo, ya que al ocurrir esta exepción SOLO puede
						 * ser posible, cuando el emitter trata de enviar un pero este ya no 
						 * posee una conexion.
						 */
						scheduleThread.interrupt();
					} catch (InterruptedException e) {
						// ¿Podria pasar esta excepcion?
						System.out.println("Error en el thread schedule");
						System.out.println(e);
					}				
				}

				System.out.println("Termine de mandar datos...");
			}
		};
		
		this.scheduleThread = new Thread(runnable);		
	}

	@CrossOrigin
	@GetMapping("/getProcessList")
	public SseEmitter fetchData() {
		this.setScheduleThread();		
		this.scheduleThread.start();
		return emitter;
	}
	
	@CrossOrigin
	@GetMapping("/killprocess")
	public ResponseEntity<String> killProcess(@RequestParam("name") String porcessName) {
		try {
			CommandUtil.killProcessByName(porcessName);			
		} catch (IOException e) {
			System.out.println(e);
			return new ResponseEntity<>("Ocurrio un error inesperado", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (CommandNotValidException c) {
			System.out.println(c);
			return new ResponseEntity<>(c.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>("Proceso eliminado", HttpStatus.OK);
	}	
	
	@CrossOrigin
	@GetMapping("/killprocessById")
	public ResponseEntity<String> killProcessById(@RequestParam("id") String processId) {
		try {
			CommandUtil.killProcessById(processId);			
		} catch (IOException e) {
			System.out.println(e);
			return new ResponseEntity<>("Ocurrio un error inesperado", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (CommandNotValidException c) {
			System.out.println(c);
			return new ResponseEntity<>(c.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>("Proceso eliminado", HttpStatus.OK);
	}
	
}
