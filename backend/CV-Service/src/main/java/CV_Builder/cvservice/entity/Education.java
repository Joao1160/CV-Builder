package CV_Builder.cvservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "educations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id")
    private CV cv;

    private String institution;
    private String degree;
    private String field;
    private String startDate;
    private String endDate;
    private String grade;
}