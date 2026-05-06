package CV_Builder.atsservice.service;


import CV_Builder.atsservice.dto.ATSResult;
import CV_Builder.atsservice.dto.CVAnalysisRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ATSAnalyzer {

    /* ── Keyword dictionaries ── */
    private static final List<String> POWER_VERBS = List.of(
            "achieved","built","created","designed","developed","delivered","drove",
            "engineered","established","executed","founded","generated","implemented",
            "improved","increased","launched","led","managed","optimized","reduced",
            "resolved","scaled","shipped","streamlined","transformed"
    );

    private static final List<String> SOFT_SKILLS = List.of(
            "leadership","communication","collaboration","problem-solving","teamwork",
            "analytical","strategic","innovative","adaptable","detail-oriented"
    );

    private static final List<String> TECH_KEYWORDS = List.of(
            "agile","scrum","ci/cd","api","rest","microservices","cloud","aws","azure","gcp",
            "docker","kubernetes","devops","sql","nosql","git","tdd","oop","saas","b2b"
    );

    public ATSResult analyze(CVAnalysisRequest cv) {
        String text = buildText(cv).toLowerCase();
        List<ATSResult.CheckItem> checks = new ArrayList<>();
        int total = 0;

        /* 1. Contact completeness (20 pts) */
        total += addCheck(checks, "Contact", "Full name",    isPresent(cv.getFullName()),   4);
        total += addCheck(checks, "Contact", "Email",         isPresent(cv.getEmail()),       4);
        total += addCheck(checks, "Contact", "Phone number",  isPresent(cv.getPhone()),       4);
        total += addCheck(checks, "Contact", "Location",      isPresent(cv.getLocation()),    4);
        total += addCheck(checks, "Contact", "LinkedIn URL",  isPresent(cv.getLinkedIn()),    4);

        /* 2. Summary (15 pts) */
        boolean hasSummary  = isPresent(cv.getSummary());
        boolean summaryLong = wordCount(cv.getSummary()) >= 30;
        total += addCheck(checks, "Summary", "Has professional summary",  hasSummary,   8);
        total += addCheck(checks, "Summary", "Summary is 30+ words",      summaryLong,  7);

        /* 3. Experience (25 pts) */
        int expCount = cv.getExperiences() == null ? 0 : cv.getExperiences().size();
        boolean hasExp   = expCount >= 1;
        boolean hasDesc  = cv.getExperiences() != null &&
                cv.getExperiences().stream().allMatch(e -> wordCount(e.getDescription()) >= 10);
        boolean hasDates = cv.getExperiences() != null &&
                cv.getExperiences().stream().allMatch(e -> isPresent(e.getStartDate()));
        List<String> foundVerbs = matchWords(text, POWER_VERBS);
        total += addCheck(checks, "Experience", "Has work experience",       hasExp,                      8);
        total += addCheck(checks, "Experience", "Descriptions are detailed", hasDesc,                     8);
        total += addCheck(checks, "Experience", "Dates included",            hasDates,                    4);
        total += addCheck(checks, "Experience", "Action verbs (" + foundVerbs.size() + " found)", foundVerbs.size() >= 3, 5);

        /* 4. Education (10 pts) */
        boolean hasEdu        = cv.getEducations() != null && !cv.getEducations().isEmpty();
        boolean hasEduDetails = cv.getEducations() != null &&
                cv.getEducations().stream().allMatch(e -> isPresent(e.getDegree()) && isPresent(e.getInstitution()));
        total += addCheck(checks, "Education", "Has education entry",    hasEdu,        5);
        total += addCheck(checks, "Education", "Degree & school filled", hasEduDetails, 5);

        /* 5. Skills (20 pts) */
        int skillCount    = cv.getSkills() == null ? 0 : cv.getSkills().size();
        List<String> foundTech = matchWords(text, TECH_KEYWORDS);
        total += addCheck(checks, "Skills", skillCount + " skills (need 5+)",          skillCount >= 5,   8);
        total += addCheck(checks, "Skills", "10+ skills for strong profile",            skillCount >= 10,  4);
        total += addCheck(checks, "Skills", "Tech keywords (" + foundTech.size() + " found)", foundTech.size() >= 2, 8);

        /* 6. Soft skills (10 pts) */
        List<String> foundSoft = matchWords(text, SOFT_SKILLS);
        int softPts = Math.min(foundSoft.size() * 2, 10);
        total += softPts;
        checks.add(ATSResult.CheckItem.builder()
                .category("Keywords").label("Soft skills (" + foundSoft.size() + " found)")
                .ok(foundSoft.size() >= 2).pts(10).build());

        /* ── Suggestions ── */
        List<ATSResult.Suggestion> suggestions = buildSuggestions(
                hasSummary, summaryLong, hasExp, hasDesc, foundVerbs.size(),
                skillCount, foundTech.size(), foundSoft.size(), isPresent(cv.getLinkedIn())
        );

        /* ── Score label ── */
        int score = Math.min(total, 100);
        String label; String color;
        if (score >= 85) { label = "Excellent"; color = "#16a34a"; }
        else if (score >= 70) { label = "Good"; color = "#2E8B73"; }
        else if (score >= 50) { label = "Fair"; color = "#d97706"; }
        else { label = "Needs Work"; color = "#dc2626"; }

        return ATSResult.builder()
                .score(score).label(label).color(color)
                .checks(checks).suggestions(suggestions)
                .keywords(ATSResult.KeywordSummary.builder()
                        .powerVerbs(foundVerbs).techKeywords(foundTech).softSkills(foundSoft)
                        .build())
                .build();
    }

    /* ── Helpers ── */
    private int addCheck(List<ATSResult.CheckItem> checks, String cat, String label, boolean ok, int pts) {
        checks.add(ATSResult.CheckItem.builder().category(cat).label(label).ok(ok).pts(pts).build());
        return ok ? pts : 0;
    }

    private boolean isPresent(String s) { return s != null && !s.isBlank(); }

    private int wordCount(String s) {
        if (s == null || s.isBlank()) return 0;
        return s.trim().split("\\s+").length;
    }

    private String buildText(CVAnalysisRequest cv) {
        StringBuilder sb = new StringBuilder();
        if (cv.getSummary() != null)  sb.append(cv.getSummary()).append(" ");
        if (cv.getSkills()  != null)  cv.getSkills().forEach(s -> sb.append(s).append(" "));
        if (cv.getExperiences() != null) cv.getExperiences().forEach(e ->
                sb.append(e.getPosition()).append(" ").append(e.getDescription()).append(" "));
        if (cv.getEducations()  != null) cv.getEducations().forEach(e ->
                sb.append(e.getDegree()).append(" ").append(e.getField()).append(" "));
        return sb.toString();
    }

    private List<String> matchWords(String text, List<String> dict) {
        return dict.stream()
                .filter(w -> text.contains(w.toLowerCase()))
                .collect(Collectors.toList());
    }

    private List<ATSResult.Suggestion> buildSuggestions(
            boolean hasSummary, boolean summaryLong, boolean hasExp, boolean hasDesc,
            int verbCount, int skillCount, int techCount, int softCount, boolean hasLinkedIn
    ) {
        List<ATSResult.Suggestion> s = new ArrayList<>();
        if (!hasSummary)
            s.add(sug("error",   "Add a professional summary — it's the first thing ATS scans."));
        else if (!summaryLong)
            s.add(sug("warning", "Expand your summary to 30+ words for better ATS ranking."));
        if (!hasExp)
            s.add(sug("error",   "Add at least one work experience entry."));
        else if (!hasDesc)
            s.add(sug("warning", "Add detailed descriptions (10+ words) to each job entry."));
        if (verbCount < 3)
            s.add(sug("warning", "Use more action verbs: achieved, built, led, optimized, scaled..."));
        if (skillCount < 5)
            s.add(sug("error",   "Add at least 5 skills to pass ATS keyword matching."));
        else if (skillCount < 10)
            s.add(sug("info",    "Add more skills (aim for 10+) to increase keyword density."));
        if (techCount < 2)
            s.add(sug("info",    "Include industry keywords: agile, api, docker, aws, sql..."));
        if (!hasLinkedIn)
            s.add(sug("info",    "Add your LinkedIn URL — many recruiters verify profiles."));
        if (softCount < 2)
            s.add(sug("info",    "Mention soft skills in your summary: leadership, communication..."));
        return s;
    }

    private ATSResult.Suggestion sug(String level, String text) {
        return ATSResult.Suggestion.builder().level(level).text(text).build();
    }
}