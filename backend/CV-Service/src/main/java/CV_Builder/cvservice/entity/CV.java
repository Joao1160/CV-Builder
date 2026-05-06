package CV_Builder.cvservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cvs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CV {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String title;

    /* ── Personal Info ── */
    private String fullName;
    private String jobTitle;      // ← جديد
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String linkedIn;
    private String website;

    /* ── Sections ── */
    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Experience> experiences;

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Education> educations;

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Project> projects;         // ← جديد

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Certification> certifications; // ← جديد

    @OneToMany(mappedBy = "cv", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Language> languages;       // ← جديد

    /* ── Simple lists (stored as separate tables) ── */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cv_technical_skills", joinColumns = @JoinColumn(name = "cv_id"))
    @Column(name = "skill")
    private List<String> technicalSkills;   // ← جديد

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cv_soft_skills", joinColumns = @JoinColumn(name = "cv_id"))
    @Column(name = "skill")
    private List<String> softSkills;        // ← جديد

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cv_achievements", joinColumns = @JoinColumn(name = "cv_id"))
    @Column(name = "achievement", length = 500)
    private List<String> achievements;      // ← جديد

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}