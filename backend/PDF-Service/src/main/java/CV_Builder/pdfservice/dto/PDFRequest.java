package CV_Builder.pdfservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class PDFRequest {
    private String template;

    // Personal
    private String fullName;
    private String jobTitle;        // ← كان ناقص وده سبب الـ error
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String linkedIn;
    private String website;

    // Skills
    private List<String> technicalSkills;
    private List<String> softSkills;
    private List<String> achievements;

    // Sections
    private List<ExperienceDTO>    experiences;
    private List<EducationDTO>     educations;
    private List<ProjectDTO>       projects;
    private List<CertificationDTO> certifications;
    private List<LanguageDTO>      languages;

    @Data
    public static class ExperienceDTO {
        private String company;
        private String position;
        private String description;
        private String startDate;
        private String endDate;
        private boolean current;
    }

    @Data
    public static class EducationDTO {
        private String institution;
        private String degree;
        private String field;
        private String startDate;
        private String endDate;
        private String grade;
    }

    @Data
    public static class ProjectDTO {
        private String name;
        private String description;
        private String url;
        private List<String> techs;
    }

    @Data
    public static class CertificationDTO {
        private String name;
        private String issuer;
        private String date;
        private String url;
    }

    @Data
    public static class LanguageDTO {
        private String name;
        private String level;
    }
}
