package CV_Builder.atsservice.controller;


import CV_Builder.atsservice.dto.ATSResult;
import CV_Builder.atsservice.dto.CVAnalysisRequest;
import CV_Builder.atsservice.service.ATSAnalyzer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ATSController {

    private final ATSAnalyzer analyzer;

    @PostMapping("/analyze")
    public ResponseEntity<ATSResult> analyze(@RequestBody CVAnalysisRequest request) {
        return ResponseEntity.ok(analyzer.analyze(request));
    }
}