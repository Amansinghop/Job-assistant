package com.lucifer.jobassistant.service;

import com.lucifer.jobassistant.dto.AnalysisRequest;
import com.lucifer.jobassistant.dto.AnalysisResponse;
import com.lucifer.jobassistant.dto.MLResponse;
import com.lucifer.jobassistant.exception.ResourceNotFoundException;
import com.lucifer.jobassistant.model.AnalysisResult;
import com.lucifer.jobassistant.model.Resume;
import com.lucifer.jobassistant.model.User;
import com.lucifer.jobassistant.repository.AnalysisResultRepository;
import com.lucifer.jobassistant.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final PythonMLService pythonMLService;
    private final UserService userService;

    @Transactional
    public Resume uploadResume(Long userId, MultipartFile file) throws IOException {
        User user = userService.getUserById(userId);

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            throw new IllegalArgumentException("File name is null");
        }

        // Check file type
        if (!fileName.toLowerCase().endsWith(".pdf") && !fileName.toLowerCase().endsWith(".docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX files are supported");
        }

        // Extract text from file
        log.info("Extracting text from file: {}", fileName);
        String resumeText = extractTextFromFile(file);

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("Could not extract text from file");
        }

        // Create and save resume
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(fileName);
        resume.setResumeText(resumeText);

        Resume savedResume = resumeRepository.save(resume);
        log.info("Resume saved with ID: {}", savedResume.getId());

        return savedResume;
    }

    @Transactional
    public AnalysisResponse analyzeResume(AnalysisRequest request) {
        // Get resume from DB
        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + request.getResumeId()));

        // Validate job description
        if (request.getJobDescription() == null || request.getJobDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Job description cannot be empty");
        }

        // Call Python ML service
        log.info("Sending to ML service - Resume ID: {}, Resume length: {}, Job desc length: {}",
                resume.getId(), resume.getResumeText().length(), request.getJobDescription().length());

        MLResponse mlResponse = pythonMLService.analyzeResume(
                resume.getResumeText(),
                request.getJobDescription()
        );

        // Save analysis result
        AnalysisResult analysisResult = new AnalysisResult();
        analysisResult.setResume(resume);
        analysisResult.setJobDescription(request.getJobDescription());
        analysisResult.setMatchScore(mlResponse.getMatchScore());
        analysisResult.setResumeSkills(mlResponse.getResumeSkills());
        analysisResult.setJobSkills(mlResponse.getJobSkills());
        analysisResult.setMissingSkills(mlResponse.getMissingSkills());
        analysisResult.setSuggestions(mlResponse.getSuggestions());

        analysisResult = analysisResultRepository.save(analysisResult);
        log.info("Analysis result saved with ID: {}", analysisResult.getId());

        // Convert to response DTO
        return convertToAnalysisResponse(analysisResult);
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
    }

    public List<Resume> getResumesByUserId(Long userId) {
        // Verify user exists
        userService.getUserById(userId);
        return resumeRepository.findByUserId(userId);
    }

    public List<AnalysisResult> getAnalysesByResumeId(Long resumeId) {
        // Verify resume exists
        getResumeById(resumeId);
        return analysisResultRepository.findByResumeId(resumeId);
    }

    public List<AnalysisResult> getAnalysesByUserId(Long userId) {
        // Verify user exists
        userService.getUserById(userId);
        return analysisResultRepository.findByResumeUserId(userId);
    }

    public AnalysisResult getAnalysisById(Long id) {
        return analysisResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found with id: " + id));
    }

    @Transactional
    public void deleteResume(Long id) {
        Resume resume = getResumeById(id);
        resumeRepository.delete(resume);
        log.info("Resume deleted with ID: {}", id);
    }

    private String extractTextFromFile(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();

        if (filename == null) {
            throw new IllegalArgumentException("File name is null");
        }

        if (filename.toLowerCase().endsWith(".pdf")) {
            return extractTextFromPDF(file);
        } else if (filename.toLowerCase().endsWith(".docx")) {
            return extractTextFromDOCX(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format. Only PDF and DOCX are supported.");
        }
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.debug("Extracted {} characters from PDF", text.length());
            return text;
        } catch (Exception e) {
            log.error("Error extracting text from PDF", e);
            throw new IOException("Failed to extract text from PDF: " + e.getMessage());
        }
    }

    private String extractTextFromDOCX(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            StringBuilder text = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                text.append(paragraph.getText()).append("\n");
            }
            String result = text.toString();
            log.debug("Extracted {} characters from DOCX", result.length());
            return result;
        } catch (Exception e) {
            log.error("Error extracting text from DOCX", e);
            throw new IOException("Failed to extract text from DOCX: " + e.getMessage());
        }
    }

    private AnalysisResponse convertToAnalysisResponse(AnalysisResult result) {
        AnalysisResponse response = new AnalysisResponse();
        response.setAnalysisId(result.getId());
        response.setMatchScore(result.getMatchScore());
        response.setResumeSkills(result.getResumeSkills());
        response.setJobSkills(result.getJobSkills());
        response.setMissingSkills(result.getMissingSkills());
        response.setSuggestions(result.getSuggestions());
        response.setAnalyzedAt(result.getAnalyzedAt());
        return response;
    }
}