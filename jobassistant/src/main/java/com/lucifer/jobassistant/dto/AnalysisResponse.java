package com.lucifer.jobassistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private Long analysisId;
    private Double matchScore;
    private List<String> resumeSkills;
    private List<String> jobSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
    private LocalDateTime analyzedAt;
}
