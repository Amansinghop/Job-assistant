package com.lucifer.jobassistant.controller;

import com.lucifer.jobassistant.dto.AnalysisRequest;
import com.lucifer.jobassistant.dto.AnalysisResponse;
import com.lucifer.jobassistant.model.AnalysisResult;
import com.lucifer.jobassistant.model.Resume;
import com.lucifer.jobassistant.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        log.info("Uploading resume for user: {}, file: {}", userId, file.getOriginalFilename());
        Resume resume = resumeService.uploadResume(userId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(resume);
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyzeResume(
            @Valid @RequestBody AnalysisRequest request) {

        log.info("Analyzing resume ID: {} against job description", request.getResumeId());
        AnalysisResponse response = resumeService.analyzeResume(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable Long id) {
        log.info("Getting resume with id: {}", id);
        Resume resume = resumeService.getResumeById(id);
        return ResponseEntity.ok(resume);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Resume>> getResumesByUserId(@PathVariable Long userId) {
        log.info("Getting resumes for user: {}", userId);
        List<Resume> resumes = resumeService.getResumesByUserId(userId);
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{resumeId}/analyses")
    public ResponseEntity<List<AnalysisResult>> getAnalysesByResumeId(@PathVariable Long resumeId) {
        log.info("Getting analyses for resume: {}", resumeId);
        List<AnalysisResult> analyses = resumeService.getAnalysesByResumeId(resumeId);
        return ResponseEntity.ok(analyses);
    }

    @GetMapping("/analyses/user/{userId}")
    public ResponseEntity<List<AnalysisResult>> getAnalysesByUserId(@PathVariable Long userId) {
        log.info("Getting all analyses for user: {}", userId);
        List<AnalysisResult> analyses = resumeService.getAnalysesByUserId(userId);
        return ResponseEntity.ok(analyses);
    }

    @GetMapping("/analyses/{analysisId}")
    public ResponseEntity<AnalysisResult> getAnalysisById(@PathVariable Long analysisId) {
        log.info("Getting analysis with id: {}", analysisId);
        AnalysisResult analysis = resumeService.getAnalysisById(analysisId);
        return ResponseEntity.ok(analysis);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        log.info("Deleting resume with id: {}", id);
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}