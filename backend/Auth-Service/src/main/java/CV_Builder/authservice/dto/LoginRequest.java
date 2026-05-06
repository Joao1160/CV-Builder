package CV_Builder.authservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginRequest {

    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;
}