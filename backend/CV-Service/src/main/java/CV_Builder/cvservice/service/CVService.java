package CV_Builder.cvservice.service;

import CV_Builder.cvservice.dto.CVRequest;
import CV_Builder.cvservice.dto.CVResponse;
import CV_Builder.cvservice.entity.*;
import CV_Builder.cvservice.repository.CVRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CVService {

    private final CVRepository cvRepository;

    public CVResponse create(String userId, CVRequest req) {
        CV cv = buildEntity(req);
        cv.setUserId(userId);
        return toResponse(cvRepository.save(cv));
    }

    public List<CVResponse> getAllByUser(String userId) {
        return cvRepository.findByUserId(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CVResponse getById(String id, String userId) {
        return toResponse(findOwned(id, userId));
    }

    public CVResponse update(String id, String userId, CVRequest req) {
        CV cv = findOwned(id, userId);

        /* ── Clear existing collections safely ── */
        if (cv.getExperiences()    != null) cv.getExperiences().clear();
        if (cv.getEducations()     != null) cv.getEducations().clear();
        if (cv.getProjects()       != null) cv.getProjects().clear();
        if (cv.getCertifications() != null) cv.getCertifications().clear();
        if (cv.getLanguages()      != null) cv.getLanguages().clear();

        /* ── Update scalar fields ── */
        cv.setTitle(req.getTitle());
        cv.setFullName(req.getFullName());
        cv.setJobTitle(req.getJobTitle());
        cv.setEmail(req.getEmail());
        cv.setPhone(req.getPhone());
        cv.setLocation(req.getLocation());
        cv.setSummary(req.getSummary());
        cv.setLinkedIn(req.getLinkedIn());
        cv.setWebsite(req.getWebsite());
        cv.setTechnicalSkills(req.getTechnicalSkills() != null ? req.getTechnicalSkills() : new ArrayList<>());
        cv.setSoftSkills(req.getSoftSkills()           != null ? req.getSoftSkills()       : new ArrayList<>());
        cv.setAchievements(req.getAchievements()       != null ? req.getAchievements()     : new ArrayList<>());

        /* ── Re-add collections ── */
        if (req.getExperiences() != null)
            cv.getExperiences().addAll(mapExperiences(req.getExperiences(), cv));
        if (req.getEducations() != null)
            cv.getEducations().addAll(mapEducations(req.getEducations(), cv));
        if (req.getProjects() != null)
            cv.getProjects().addAll(mapProjects(req.getProjects(), cv));
        if (req.getCertifications() != null)
            cv.getCertifications().addAll(mapCertifications(req.getCertifications(), cv));
        if (req.getLanguages() != null)
            cv.getLanguages().addAll(mapLanguages(req.getLanguages(), cv));

        return toResponse(cvRepository.save(cv));
    }

    public void delete(String id, String userId) {
        cvRepository.delete(findOwned(id, userId));
    }

    /* ══════════ Helpers ══════════ */

    private CV findOwned(String id, String userId) {
        return cvRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("CV not found"));
    }

    private CV buildEntity(CVRequest req) {
        CV cv = CV.builder()
                .title(req.getTitle())
                .fullName(req.getFullName())
                .jobTitle(req.getJobTitle())
                .email(req.getEmail())
                .phone(req.getPhone())
                .location(req.getLocation())
                .summary(req.getSummary())
                .linkedIn(req.getLinkedIn())
                .website(req.getWebsite())
                .technicalSkills(req.getTechnicalSkills() != null ? req.getTechnicalSkills() : new ArrayList<>())
                .softSkills(req.getSoftSkills()           != null ? req.getSoftSkills()       : new ArrayList<>())
                .achievements(req.getAchievements()       != null ? req.getAchievements()     : new ArrayList<>())
                .experiences(new ArrayList<>())
                .educations(new ArrayList<>())
                .projects(new ArrayList<>())
                .certifications(new ArrayList<>())
                .languages(new ArrayList<>())
                .build();

        if (req.getExperiences()    != null) cv.setExperiences(mapExperiences(req.getExperiences(), cv));
        if (req.getEducations()     != null) cv.setEducations(mapEducations(req.getEducations(), cv));
        if (req.getProjects()       != null) cv.setProjects(mapProjects(req.getProjects(), cv));
        if (req.getCertifications() != null) cv.setCertifications(mapCertifications(req.getCertifications(), cv));
        if (req.getLanguages()      != null) cv.setLanguages(mapLanguages(req.getLanguages(), cv));

        return cv;
    }

    /* ── Mappers ── */

    private List<Experience> mapExperiences(List<CVRequest.ExperienceDTO> list, CV cv) {
        return list.stream().map(e -> Experience.builder()
                .cv(cv)
                .company(e.getCompany())
                .position(e.getPosition())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .description(e.getDescription())
                .current(e.isCurrent())
                .build()).collect(Collectors.toList());
    }

    private List<Education> mapEducations(List<CVRequest.EducationDTO> list, CV cv) {
        return list.stream().map(e -> Education.builder()
                .cv(cv)
                .institution(e.getInstitution())
                .degree(e.getDegree())
                .field(e.getField())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .grade(e.getGrade())
                .build()).collect(Collectors.toList());
    }

    private List<Project> mapProjects(List<CVRequest.ProjectDTO> list, CV cv) {
        return list.stream().map(p -> Project.builder()
                .cv(cv)
                .name(p.getName())
                .description(p.getDescription())
                .url(p.getUrl())
                .techs(p.getTechs() != null ? p.getTechs() : new ArrayList<>())
                .build()).collect(Collectors.toList());
    }

    private List<Certification> mapCertifications(List<CVRequest.CertificationDTO> list, CV cv) {
        return list.stream().map(c -> Certification.builder()
                .cv(cv)
                .name(c.getName())
                .issuer(c.getIssuer())
                .date(c.getDate())
                .url(c.getUrl())
                .build()).collect(Collectors.toList());
    }

    private List<Language> mapLanguages(List<CVRequest.LanguageDTO> list, CV cv) {
        return list.stream().map(l -> Language.builder()
                .cv(cv)
                .name(l.getName())
                .level(l.getLevel())
                .build()).collect(Collectors.toList());
    }

    /* ── toResponse ── */
    private CVResponse toResponse(CV cv) {
        return CVResponse.builder()
                .id(cv.getId())
                .userId(cv.getUserId())
                .title(cv.getTitle())
                .fullName(cv.getFullName())
                .jobTitle(cv.getJobTitle())
                .email(cv.getEmail())
                .phone(cv.getPhone())
                .location(cv.getLocation())
                .summary(cv.getSummary())
                .linkedIn(cv.getLinkedIn())
                .website(cv.getWebsite())
                .technicalSkills(cv.getTechnicalSkills() != null ? cv.getTechnicalSkills() : new ArrayList<>())
                .softSkills(cv.getSoftSkills()           != null ? cv.getSoftSkills()       : new ArrayList<>())
                .achievements(cv.getAchievements()       != null ? cv.getAchievements()     : new ArrayList<>())
                .createdAt(cv.getCreatedAt())
                .updatedAt(cv.getUpdatedAt())
                /* Experiences */
                .experiences(cv.getExperiences() == null ? new ArrayList<>() :
                        cv.getExperiences().stream().map(e -> {
                            CVRequest.ExperienceDTO dto = new CVRequest.ExperienceDTO();
                            dto.setId(e.getId()); dto.setCompany(e.getCompany());
                            dto.setPosition(e.getPosition()); dto.setStartDate(e.getStartDate());
                            dto.setEndDate(e.getEndDate()); dto.setDescription(e.getDescription());
                            dto.setCurrent(e.isCurrent()); return dto;
                        }).collect(Collectors.toList()))
                /* Educations */
                .educations(cv.getEducations() == null ? new ArrayList<>() :
                        cv.getEducations().stream().map(e -> {
                            CVRequest.EducationDTO dto = new CVRequest.EducationDTO();
                            dto.setId(e.getId()); dto.setInstitution(e.getInstitution());
                            dto.setDegree(e.getDegree()); dto.setField(e.getField());
                            dto.setStartDate(e.getStartDate()); dto.setEndDate(e.getEndDate());
                            dto.setGrade(e.getGrade()); return dto;
                        }).collect(Collectors.toList()))
                /* Projects */
                .projects(cv.getProjects() == null ? new ArrayList<>() :
                        cv.getProjects().stream().map(p -> {
                            CVRequest.ProjectDTO dto = new CVRequest.ProjectDTO();
                            dto.setId(p.getId()); dto.setName(p.getName());
                            dto.setDescription(p.getDescription()); dto.setUrl(p.getUrl());
                            dto.setTechs(p.getTechs() != null ? p.getTechs() : new ArrayList<>()); return dto;
                        }).collect(Collectors.toList()))
                /* Certifications */
                .certifications(cv.getCertifications() == null ? new ArrayList<>() :
                        cv.getCertifications().stream().map(c -> {
                            CVRequest.CertificationDTO dto = new CVRequest.CertificationDTO();
                            dto.setId(c.getId()); dto.setName(c.getName());
                            dto.setIssuer(c.getIssuer()); dto.setDate(c.getDate());
                            dto.setUrl(c.getUrl()); return dto;
                        }).collect(Collectors.toList()))
                /* Languages */
                .languages(cv.getLanguages() == null ? new ArrayList<>() :
                        cv.getLanguages().stream().map(l -> {
                            CVRequest.LanguageDTO dto = new CVRequest.LanguageDTO();
                            dto.setId(l.getId()); dto.setName(l.getName());
                            dto.setLevel(l.getLevel()); return dto;
                        }).collect(Collectors.toList()))
                .build();
    }
}
