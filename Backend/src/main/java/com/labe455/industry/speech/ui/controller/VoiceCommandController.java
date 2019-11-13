package com.labe455.industry.speech.ui.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.util.IOUtils;
import com.google.api.gax.rpc.ApiStreamObserver;
import com.google.api.gax.rpc.BidiStreamingCallable;
import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import com.google.cloud.speech.v1.RecognitionMetadata;
import com.google.cloud.speech.v1.RecognitionMetadata.InteractionType;
import com.google.cloud.speech.v1.RecognitionMetadata.MicrophoneDistance;
import com.google.cloud.speech.v1.RecognitionMetadata.OriginalMediaType;
import com.google.cloud.speech.v1.RecognitionMetadata.RecordingDeviceType;
import com.google.cloud.speech.v1.RecognizeResponse;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechContext;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.google.cloud.speech.v1.StreamingRecognitionConfig;
import com.google.cloud.speech.v1.StreamingRecognitionResult;
import com.google.cloud.speech.v1.StreamingRecognizeRequest;
import com.google.cloud.speech.v1.StreamingRecognizeResponse;
import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.common.util.concurrent.SettableFuture;
import com.google.protobuf.ByteString;
import com.labe455.industry.speech.ui.exceptions.CommandNotValidException;
import com.labe455.industry.speech.ui.exceptions.TranscriptionNotFound;
import com.labe455.industry.speech.ui.model.CommandResponse;
import com.labe455.industry.speech.ui.system.monitor.controller.SystemMonitorController;
import com.labe455.industry.speech.ui.utils.CommandUtil;

/**
 * 
 * 
 * @author Edgar Bladimir Lopez Alonzo
 * @version 1.0.0 20/10/2019
 */
@RestController
@RequestMapping("/speech")
@CrossOrigin(origins = "*")
public class VoiceCommandController {
	
	private final String MENU_OPTIONS_CONTEXT = "MenuOptionsComponent";
	private final String CONFIGURATIONS_CONTEXT = "ConfigurationsComponent";
	private final String PROCESS_CONTEXT = "ProcessListComponent";
	private final String COMMAND_CONTEXT = "CommandListComponent";
	
	
	private final String oneCommandList = "inicio aceptar cancelar";
	private final String twoCommandList = "abrir terminar expandir uso";
	private final String twoCommandParamList = "proceso procesos comando comandos configuracion";		
	
	private String recognizeStreaming(MultipartFile audioRecord) throws CommandNotValidException {
		// Instantiates a client with GOOGLE_APPLICATION_CREDENTIALS
		  try (SpeechClient speech = SpeechClient.create()) {

			ByteString audioBytes = ByteString.copyFrom(audioRecord.getBytes());			  
			
			SpeechContext sc =
					SpeechContext.newBuilder()
                    			 .addPhrases("abrir")
                    			 .addPhrases("inicio")
                    			 .addPhrases("aceptar")
                    			 .addPhrases("cancelar")
                    			 .addPhrases("terminar")
                    			 .addPhrases("defecto")
                    			 .addPhrases("configuracion")
                    			 .addPhrases("lista")
                    			 
                    			 .addPhrases("termina")
                    			 .addPhrases("soffice.bin")
                    			 .addPhrases("firefox")
                    			 .addPhrases("chrome")
                    			 .addPhrases("nautilus")
                    			 .addPhrases("dolphin")
                    			 
                    			 .addPhrases("uso")
                    			 .addPhrases("ram")
                    			 .addPhrases("cpu")
                    			 .addPhrases("1")
                    			 .addPhrases("2")
                    			 .addPhrases("3")
                    			 .build();
			
		    // Configure request with local raw PCM audio
		    RecognitionConfig recConfig =
		        RecognitionConfig.newBuilder()
		            .setEncoding(AudioEncoding.LINEAR16)
		            .setEnableAutomaticPunctuation(false)		  
		            .setProfanityFilter(false)
		            .setLanguageCode("es-US")
		            .setSampleRateHertz(44100)
		            .addSpeechContexts(sc)
		            .build();
		    
		    StreamingRecognitionConfig config =
		        StreamingRecognitionConfig.newBuilder()
        								  .setConfig(recConfig)
        								  .build();

		    class ResponseApiStreamingObserver<T> implements ApiStreamObserver<T> {
		      private final SettableFuture<List<T>> future = SettableFuture.create();
		      private final List<T> messages = new java.util.ArrayList<T>();

		      @Override
		      public void onNext(T message) {
		        messages.add(message);
		      }

		      @Override
		      public void onError(Throwable t) {
		        future.setException(t);
		      }

		      @Override
		      public void onCompleted() {
		        future.set(messages);
		      }

		      // Returns the SettableFuture object to get received messages / exceptions.
		      public SettableFuture<List<T>> future() {
		        return future;
		      }
		    }

		    ResponseApiStreamingObserver<StreamingRecognizeResponse> responseObserver =
		        new ResponseApiStreamingObserver<>();

		    BidiStreamingCallable<StreamingRecognizeRequest, StreamingRecognizeResponse> callable =
		        speech.streamingRecognizeCallable();

		    ApiStreamObserver<StreamingRecognizeRequest> requestObserver =
		        callable.bidiStreamingCall(responseObserver);

		    // The first request must **only** contain the audio configuration:
		    requestObserver.onNext(
		        StreamingRecognizeRequest.newBuilder().setStreamingConfig(config).build());

		    // Subsequent requests must **only** contain the audio data.
		    requestObserver.onNext(
		        StreamingRecognizeRequest.newBuilder()
		            .setAudioContent(audioBytes)
		            .build());

		    // Mark transmission as completed after sending the data.
		    requestObserver.onCompleted();

		    List<StreamingRecognizeResponse> responses;
		    
			try {
				responses = responseObserver.future().get();
				
				if (responses == null) {
					throw new CommandNotValidException("No entendi");
				}
				
				System.out.println("Llego una respuesta: ");
				for (StreamingRecognizeResponse response : responses) {
				      // For streaming recognize, the results list has one is_final result (if available) followed
				      // by a number of in-progress results (if iterim_results is true) for subsequent utterances.
				      // Just print the first result here.
				      StreamingRecognitionResult result = response.getResultsList().get(0);
				      // There can be several alternative transcripts for a given chunk of speech. Just use the
				      // first (most likely) one here.
				      SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
				      System.out.printf("Transcript : %s\n", alternative.getTranscript());
				      return alternative.getTranscript();
				    }
				
			} catch (IndexOutOfBoundsException out) {
				throw new CommandNotValidException("No entendi");
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ExecutionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		    
		  } catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		  
		  return null;
	}
	
	private byte[] textToSpeech(String text) {
		// Instantiates a client
	    try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
	      // Set the text input to be synthesized
	      SynthesisInput input = SynthesisInput.newBuilder()
	            .setText(text)
	            .build();

	      // Build the voice request, select the language code ("en-US") and the ssml voice gender
	      // ("neutral")
	      VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
	          .setLanguageCode("es-ES")
	          .setSsmlGender(SsmlVoiceGender.NEUTRAL)
	          .build();

	      // Select the type of audio file you want returned
	      AudioConfig audioConfig = AudioConfig.newBuilder()
	    		  							   .setAudioEncoding(com.google.cloud.texttospeech.v1.AudioEncoding.MP3)	          
	    		  							   .build();

	      // Perform the text-to-speech request on the text input with the selected voice parameters and
	      // audio file type
	      SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice,
	          audioConfig);

	      // Get the audio contents from the response
	      ByteString audioContents = response.getAudioContent();
	      
	      return audioContents.toByteArray();
	    } catch (Exception e) {
	    	System.out.println(e);
		}
	    return null;
	}
			
	private boolean isNumeric(String strNum) {
	    try {
	    	int number = Integer.parseInt(strNum);
	    } catch (NumberFormatException | NullPointerException nfe) {
	        return false;
	    }
	    return true;
	}
	
	private String fixTextNumber(String number) {
		switch (number) {
		case "uno":
			return "1";

		case "dos":
			return "2";
		
		case "tres":
			return "3";
		}
		return number;
	}
	
	private CommandResponse switchOneCommand(String command, String context) throws CommandNotValidException {
		
		CommandResponse commandResponse = new CommandResponse();
		
		switch (command) {
		case "inicio":
			
			if (!context.equalsIgnoreCase(MENU_OPTIONS_CONTEXT)) {
				commandResponse.setCommandType("navigation");
				commandResponse.setCommand("abrir");
				commandResponse.setCommandParam("inicio");	
			} else {
				throw new CommandNotValidException("No pued o hacer nad a");
			}
			
			break;
			
		case "aceptar":
			break;
			
		case "cancelar":
			break;
			
		}
				
		return commandResponse;
	}
	
	private CommandResponse switchTwoCommands(String parts[], String context) throws CommandNotValidException, IOException {
		
		CommandResponse commandResponse = new CommandResponse();
		
		switch (parts[0]) {
		case "abrir":
			
			if (this.twoCommandParamList.contains(parts[1])) {
				commandResponse.setCommandType("navigation");
				commandResponse.setCommand("abrir");
				commandResponse.setCommandParam(parts[1]);	
			} else {
				throw new CommandNotValidException("Comando no valido");
			}
			
			break;
			
		case "terminar":
			
			if (!context.equalsIgnoreCase(PROCESS_CONTEXT)) {
				throw new CommandNotValidException("Comando no valido");
			}
			
			if (isNumeric(parts[1])) {				
				CommandUtil.killProcessById( SystemMonitorController.processesIds.get(parts[1]) );
				commandResponse.setSpeechResponse(true);
				commandResponse.setSpeechText("Proceso terminado con exito");
			} else {
				CommandUtil.killProcessByName(parts[1]);
				commandResponse.setSpeechResponse(true);
				commandResponse.setSpeechText("Proceso terminado con exito");
			}
			
			break;			
			
		case "expandir":
			
			if (!context.equalsIgnoreCase(CONFIGURATIONS_CONTEXT) &&
				!context.equalsIgnoreCase(COMMAND_CONTEXT)) {
				throw new CommandNotValidException("Comando no valido");
			}
			
			parts[1] = this.fixTextNumber(parts[1]);			
			
			if (isNumeric(parts[1])) {
				
				int number = Integer.parseInt(parts[1]);
				commandResponse.setCommandType("action");
				commandResponse.setCommand("expand");
				commandResponse.setCommandParam(parts[1]);
				
				if (number < 1 || number > 3) {
					commandResponse.setSpeechResponse(true);
					commandResponse.setSpeechText("No hay opcion desplegable con ese numero");					
				}
				
			} else {
				throw new CommandNotValidException("Comando no valido");
			}
			break;
			
		case "uso":
			
			if (!context.equalsIgnoreCase(PROCESS_CONTEXT)) {
				throw new CommandNotValidException("Comando no valido");
			}
			
			if (parts[1].equalsIgnoreCase("ram") || parts[1].equalsIgnoreCase("cpu")) {						
				commandResponse.setCommandType("action");
				commandResponse.setCommand("changeStatusView");
				commandResponse.setCommandParam( (parts[1].equalsIgnoreCase("ram")? "1" : "2") );
			} else {
				throw new CommandNotValidException("Comando no valido");
			}
			
			break;
		}
		
		
		return commandResponse;
	}
	
	/**
	 * Switch que, dependiendo, del lenght del string
	 * el valor de cada parte de la cadena, etc, seleccionara
	 * si es un comando valido o no.
	 * @param parts cadena de palabras a analizar
	 * @throws CommandNotValidException excepcion cuando la cadena de strings es vacia
	 * ya sea por que se mando un audio vacio, o no se pudo transcribir el audio.
	 * @throws IOException 
	 */
	private CommandResponse switchCommandText(String commandText, String context) throws CommandNotValidException, IOException {
		
		commandText = StringUtils.stripAccents(commandText.toLowerCase()); 
		
		// Se separa cada palabra de la transcripcion
		String parts[] = commandText.split(" ");
		
		CommandResponse commandResponse = new CommandResponse();		
		
		switch (parts.length) {
	
		case 1: // Solo un comando
			
			parts[0] = StringUtils.stripAccents(parts[0].toLowerCase()); // Comando
			
			if ( this.oneCommandList.contains(parts[0]) ) {	// Si es un comando valido			
				commandResponse = this.switchOneCommand(parts[0], context);								
			} else {
				throw new CommandNotValidException("Comando no valido");
			}
			
			break;

		case 2: // Un comando y un parametro
			
			parts[0] = StringUtils.stripAccents(parts[0].toLowerCase()); // Comando
			parts[1] = StringUtils.stripAccents(parts[1].toLowerCase()); // Parametro del comando
			
			if ( this.twoCommandList.contains(parts[0]) ) { // Si es un comando valido
				commandResponse = this.switchTwoCommands(parts, context);			
			} else {
				throw new CommandNotValidException("Comando no valido");
			}
			
			break;
			
		default:
			/**
			 * Ninguna palabra (no se pudo transcribir o no hubo audio que transcribir) ó
			 * Se encontraron mas de 2 palabras en el comando
			 */
			throw new CommandNotValidException("Comando no valido");
			
		}
		
		return commandResponse;
	}
	
	@CrossOrigin
	@PostMapping(value = "/voiceCommand",
				 headers = "content-type=multipart/form-data",
				 consumes = "multipart/form-data")
	public @ResponseBody ResponseEntity<?> voiceCommand(@RequestParam(value = "record") MultipartFile audioRecord,
														String context,
														HttpServletResponse response) {			
		
		System.out.println("Contexto: "+context);
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
        response.setContentType("application/json");
        
		CommandResponse commandResponse = new CommandResponse();		
				
		try {
			
			// Transcripcion del audio recibido
			String commandText = this.recognizeStreaming(audioRecord);		
			
			if (commandText == null) {
				throw new TranscriptionNotFound("No se pudo transcribir el audio");
			}
			
			// Se separa cada palabra de la transcripcion
			String parts[] = commandText.split(" ");
				        
	        commandResponse = this.switchCommandText(commandText, context);
	        
	        if (commandResponse.isSpeechResponse()) {
	        	headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		        response.setContentType("application/octet-stream");
		        
		        byte[] speechResponse;
		        speechResponse = this.textToSpeech(commandResponse.getSpeechText());	
				return new ResponseEntity<byte[]>(speechResponse, headers, HttpStatus.OK);
	        }
	        
		} catch (CommandNotValidException | IOException cwle) {
			byte[] errorAudio;
			
			// Headers para la respuesta de un error hablada (text to speech)
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
	        response.setContentType("application/octet-stream");
	        errorAudio = this.textToSpeech(cwle.getMessage());	
			return new ResponseEntity<byte[]>(errorAudio, headers, HttpStatus.BAD_REQUEST);
			
		} catch (TranscriptionNotFound e) {
			commandResponse.setSpeechText(e.getMessage());
			return new ResponseEntity<CommandResponse>(commandResponse, headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		 
		return new ResponseEntity<CommandResponse>(commandResponse, headers, HttpStatus.OK);
		
	}
	
}