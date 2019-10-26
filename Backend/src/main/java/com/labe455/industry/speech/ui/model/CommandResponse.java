package com.labe455.industry.speech.ui.model;

public class CommandResponse {
		
	private String commandParam;
	private String command;
	private String commandType;
	
	private boolean speechResponse;
	private String speechText;
	
	public String getCommandParam() {
		return commandParam;
	}
	public void setCommandParam(String commandParam) {
		this.commandParam = commandParam;
	}
	public String getCommand() {
		return command;
	}
	public void setCommand(String command) {
		this.command = command;
	}
	public String getCommandType() {
		return commandType;
	}
	public void setCommandType(String commandType) {
		this.commandType = commandType;
	}
	public boolean isSpeechResponse() {
		return speechResponse;
	}
	public void setSpeechResponse(boolean speechResponse) {
		this.speechResponse = speechResponse;
	}
	public String getSpeechText() {
		return speechText;
	}
	public void setSpeechText(String speechText) {
		this.speechText = speechText;
	}			
	
}
