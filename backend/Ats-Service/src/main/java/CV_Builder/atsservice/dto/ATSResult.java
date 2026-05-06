package CV_Builder.atsservice.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
public class ATSResult {
    private int score;
    private String label;       // Excellent / Good / Fair / Needs Work
    private String color;       // hex color for UI
    private List<CheckItem> checks;
    private List<Suggestion> suggestions;
    private KeywordSummary keywords;

    @Data
    @Builder
    public static class CheckItem {
        private String category;
        private String label;
        private boolean ok;
        private int pts;
    }

    @Data
    @Builder
    public static class Suggestion {
        private String level;   // error / warning / info
        private String text;
    }

    @Data
    @Builder
    public static class KeywordSummary {
        private List<String> powerVerbs;
        private List<String> techKeywords;
        private List<String> softSkills;
    }
}