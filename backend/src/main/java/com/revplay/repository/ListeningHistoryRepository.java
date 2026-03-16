package com.revplay.repository;

import com.revplay.model.ListeningHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, Long> {
    List<ListeningHistory> findByUserIdOrderByPlayedAtDesc(Long userId);
    List<ListeningHistory> findTop50ByUserIdOrderByPlayedAtDesc(Long userId);
}
