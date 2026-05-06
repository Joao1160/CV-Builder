package CV_Builder.cvservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "projects")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id")
    private CV cv;

    private String name;
    private String description;
    private String url;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_techs", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> techs;
}