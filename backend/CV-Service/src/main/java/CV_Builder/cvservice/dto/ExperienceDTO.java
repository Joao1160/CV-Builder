package CV_Builder.cvservice.dto;

import lombok.Data;

@Data
public class ExperienceDTO {
    private String id;
    private String company;
    private String position;
    private String startDate;
    private String endDate;
    private String description;
    private boolean current;
}