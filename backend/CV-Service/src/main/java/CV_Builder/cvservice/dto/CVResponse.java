package CV_Builder.cvservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class CVResponse {
    private String id;
    private String userId;
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

    private List<CVRequest.ExperienceDTO>    experiences;
    private List<CVRequest.EducationDTO>     educations;
    private List<CVRequest.ProjectDTO>       projects;
    private List<CVRequest.CertificationDTO> certifications;
    private List<CVRequest.LanguageDTO>      languages;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}