package com.labe455.industry.speech.ui.exceptions;

public class CommandNotValidException extends Exception {

	private static final long serialVersionUID = 1L;
	
	public CommandNotValidException() {		
	}

	public CommandNotValidException(String msg) {
		super(msg);
	}
}
