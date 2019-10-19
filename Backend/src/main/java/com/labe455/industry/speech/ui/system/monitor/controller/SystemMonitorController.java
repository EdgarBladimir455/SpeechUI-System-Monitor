package com.labe455.industry.speech.ui.system.monitor.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.labe455.industry.speech.ui.exceptions.CommandNotFoundException;
import com.labe455.industry.speech.ui.system.monitor.model.Process;
import com.labe455.industry.speech.ui.utils.CommandUtil;

/**
 * (Opcional, para control manual NO-SpeechUI) Encargado de procesar las
 * peticiones del front relacionadas con la informacion del sistema.
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
@RestController
@RequestMapping("/monitor/")
@CrossOrigin(origins = "*")
public class SystemMonitorController {
	
	private List<Process> process = new ArrayList<Process>();

	private SseEmitter emitter;

	private Thread scheduleThread;
	
	private void setScheduleThread() {
		
		this.emitter = new SseEmitter();
		
		emitter.onError((throwable) -> {
			System.out.println("error en el emitter");
			System.out.println(throwable.getCause());
			if (!this.scheduleThread.isInterrupted() && this.scheduleThread != null) {
				System.out.println("Interrumpiendo schedule thread");
				this.scheduleThread.interrupt();
			}
		});
		
		emitter.onCompletion(() -> {
			System.out.println("Completando la sesion");
			if (!this.scheduleThread.isInterrupted() && this.scheduleThread != null) {
				System.out.println("Interrumpiendo schedule thread");
				this.scheduleThread.interrupt();
			}
		});

		emitter.onTimeout(() -> {
			System.out.println("Timeout...");
			if (!this.scheduleThread.isInterrupted() && this.scheduleThread != null) {
				System.out.println("Interrumpiendo schedule thread");
				this.scheduleThread.interrupt();
			}
		});
		
		Runnable runnable = new Runnable() {
			public void run() {
				while (!Thread.interrupted()) {
					Thread.yield();

					try {
						process = CommandUtil.getProcessInfo();
						emitter.send(process);
						Thread.sleep(3000);
					} catch (IllegalStateException e) {
						System.out.println("Se mando mensaje pero ya se habia cerrado la conexion");
						if (!scheduleThread.isInterrupted()) {
							System.out.println("Interrumpiendo schedule thread");
							scheduleThread.interrupt();
							scheduleThread = null;
						}
					} catch (IOException e) {
						System.out.println("Error al mandar mensaje");
						if (!scheduleThread.isInterrupted()) {
							System.out.println("Interrumpiendo schedule thread");
							scheduleThread.interrupt();
							scheduleThread = null;
						}
					} catch (InterruptedException e) {
						System.out.println("Error en el thread schedule");
						if (!scheduleThread.isInterrupted()) {
							System.out.println("Interrumpiendo schedule thread");
							scheduleThread.interrupt();
							scheduleThread = null;
						}
					}
					
				}
				emitter.complete();
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
			CommandUtil.killProcess(porcessName);			
		} catch (IOException e) {
			return new ResponseEntity<>("Ocurrio un error inesperado", HttpStatus.INTERNAL_SERVER_ERROR);
		} catch (CommandNotFoundException c) {
			return new ResponseEntity<>(c.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>("Proceso eliminado", HttpStatus.OK);
	}
}
