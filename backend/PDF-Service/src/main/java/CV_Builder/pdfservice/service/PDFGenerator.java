package CV_Builder.pdfservice.service;

import CV_Builder.pdfservice.dto.PDFRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PDFGenerator {

    private final TemplateEngine templateEngine;

    public byte[] generate(PDFRequest req) throws Exception {
        String templateName = switch (req.getTemplate() == null ? "classic" : req.getTemplate()) {
            case "modern"    -> "cv-modern";
            case "minimal"   -> "cv-minimal";
            case "executive" -> "cv-executive";
            default          -> "cv-classic";
        };

        Context ctx = new Context();
        ctx.setVariable("cv", req);

        String html = templateEngine.process(templateName, ctx);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();

            renderer.setDocumentFromString(html, null);

            renderer.getSharedContext().setInteractive(false);
            renderer.layout();
            renderer.createPDF(out, true);
            return out.toByteArray();
        }
    }
}
