package com.labe455.industry.speech.ui.system.monitor.websocket;

import java.io.IOException;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

/**
 * El principal uso es para el SpeechUI, controla
 * la interfaz (frontend) mediante comandos de voz,
 * respondiendo a estos mensajes en un formato de voz
 * (text-to-speech)
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 10/10/2019
 */
public class SystemMonitorWebSocketHandler extends AbstractWebSocketHandler {

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
	    System.out.println("New Text Message Received");
	    session.sendMessage(message);
	}
	 
	@Override
	protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws IOException {
	    System.out.println("New Binary Message Received");
	    session.sendMessage(message);
	}
		
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Socket cerrado: ");
		System.out.println(status);
	}
	
	@Override
	protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
		System.out.println("mensaje de pong");
	}
	
}
