package com.lucifer.jobassistant.service;

import com.lucifer.jobassistant.dto.MLResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PythonMLService {

    private final RestTemplate restTemplate;

    @Value("${python.ml.service.url}")
    private String pythonServiceUrl;

    public PythonMLService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public MLResponse analyzeResume(String resumeText, String jobDescription) {
        try {
            String url = pythonServiceUrl + "/api/analyze";

            // Prepare request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("resume_text", resumeText);
            requestBody.put("job_description", jobDescription);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            // Call Python service
            log.info("Calling Python ML service at: {}", url);
            ResponseEntity<MLResponse> response = restTemplate.postForEntity(
                    url,
                    request,
                    MLResponse.class
            );

            log.info("ML service response: {}", response.getBody());
            return response.getBody();

        } catch (Exception e) {
            log.error("Error calling Python ML service", e);
            throw new RuntimeException("Failed to analyze resume: " + e.getMessage());
        }
    }
}