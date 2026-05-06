package CV_Builder.cvservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class CVRequest {
    private String title;
    private String fullName;
    private String jobTitle;
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String linkedIn;
    private String website;

    private List<String> technicalSkills;
    private List<String> softSkills;
    private List<String> achievements;

    private List<ExperienceDTO> experiences;
    private List<EducationDTO>  educations;
    private List<ProjectDTO>    projects;
    private List<CertificationDTO> certifications;
    private List<LanguageDTO>   languages;

    @Data
    public static class ExperienceDTO {
        private String id;
        private String company;
        private String position;
        private String startDate;
        private String endDate;
        private String description;
        private boolean current;
    }

    @Data
    public static class EducationDTO {
        private String id;
        private String institution;
        private String degree;
        private String field;
        private String startDate;
        private String endDate;
        private String grade;
    }

    @Data
    public static class ProjectDTO {
        private String id;
        private String name;
        private String description;
        private String url;
        private List<String> techs;
    }

    @Data
    public static class CertificationDTO {
        private String id;
        private String name;
        private String issuer;
        private String date;
        private String url;
    }

    @Data
    public static class LanguageDTO {
        private String id;
        private String name;
        private String level;
    }
}