package com.practice.emailReplyAiAssistant_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder webClienBuilder,
            @Value() String geminiApiKey,@Value() String baseUrl,) {
        this.webClient = webClient;
        this.apiKey = apiKey;
    }

    private final String apiKey;

    public String generateEmailReply(EmailRequest emailRequest) {
        // Build Prompt
        String prompt = buildPrompt(emailRequest);
        // Prepare raw JSON Body
        String requestBody = String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }
                """, prompt);
        // Send Request

        // Extract Response
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email:");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a").append(emailRequest.getTone()).append(" tone.");
            // Use a professional tone
        }
        prompt.append("Original Email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
