package CV_Builder.pdfservice.controller;

import CV_Builder.pdfservice.dto.PDFRequest;
import CV_Builder.pdfservice.service.PDFGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PDFController {

    private final PDFGenerator pdfGenerator;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generate(@RequestBody PDFRequest request) {
        try {
            byte[] pdf = pdfGenerator.generate(request);

            String filename = (request.getFullName() != null
                    ? request.getFullName().replace(" ", "_")
                    : "CV") + "_CV.pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}