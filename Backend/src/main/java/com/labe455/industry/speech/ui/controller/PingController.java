package com.labe455.industry.speech.ui.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 25/10/2019
 */
@RestController
@RequestMapping("/server")
@CrossOrigin(origins = "*")
public class PingController {

	@CrossOrigin
	@GetMapping("/ping")
	public ResponseEntity<?> Ping(HttpServletResponse response) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
        response.setContentType("application/json");
		return new ResponseEntity<String>("ping", headers, HttpStatus.OK);
	}
	
}
