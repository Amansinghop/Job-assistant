package com.lucifer.jobassistant.dto;

import lombok.Data;

import java.util.List;

@Data
public class MLResponse {
    private Double matchScore;
    private List<String> resumeSkills;
    private List<String> jobSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
}
