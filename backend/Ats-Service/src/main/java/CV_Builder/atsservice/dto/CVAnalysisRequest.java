package CV_Builder.atsservice.dto;


import lombok.Data;
import java.util.List;

@Data
public class CVAnalysisRequest {
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String linkedIn;
    private String summary;
    private List<String> skills;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;

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
        private String grade;
    }
}