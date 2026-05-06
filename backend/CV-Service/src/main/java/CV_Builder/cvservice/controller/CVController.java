package CV_Builder.cvservice.controller;

import CV_Builder.cvservice.dto.*;
import CV_Builder.cvservice.service.CVService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cvs")
@RequiredArgsConstructor
// ↓ هذا السطر مهم جداً — يسمح بالـ CORS من React
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class CVController {

    private final CVService cvService;

    // ↓ لاحظ: "" بدل "/" عشان نتجنب trailing slash issue
    @GetMapping({"", "/"})
    public ResponseEntity<List<CVResponse>> getAll(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(cvService.getAllByUser(userId));
    }

    @PostMapping({"", "/"})
    public ResponseEntity<CVResponse> create(@RequestBody CVRequest req,
                                             HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.status(HttpStatus.CREATED).body(cvService.create(userId, req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CVResponse> getById(@PathVariable String id,
                                              HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(cvService.getById(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CVResponse> update(@PathVariable String id,
                                             @RequestBody CVRequest req,
                                             HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(cvService.update(id, userId, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        cvService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}