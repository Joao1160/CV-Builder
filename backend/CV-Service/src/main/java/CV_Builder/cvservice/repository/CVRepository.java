package CV_Builder.cvservice.repository;

import CV_Builder.cvservice.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CVRepository extends JpaRepository<CV, String> {

    List<CV> findByUserId(String userId);

    Optional<CV> findByIdAndUserId(String id, String userId);
}