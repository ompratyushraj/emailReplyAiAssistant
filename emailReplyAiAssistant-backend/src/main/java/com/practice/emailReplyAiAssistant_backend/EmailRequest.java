package com.practice.emailReplyAiAssistant_backend;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
