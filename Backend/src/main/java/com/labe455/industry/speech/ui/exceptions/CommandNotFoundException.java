package com.labe455.industry.speech.ui.exceptions;

/**
 * Excepcion lanzada cuando no se pudo ejecutar un comando
 * de linux, ya sea por sus argumentos, o sintaxis.
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 15/10/2019
 */
public class CommandNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public CommandNotFoundException(String errorMsg) {
		super(errorMsg);
	}
	
}
