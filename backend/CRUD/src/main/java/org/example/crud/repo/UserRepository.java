package org.example.crud.repo;

import org.example.crud.dto.UserSummaryDTO;
import org.example.crud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> save(String username);
    Optional<User> findByUsername(String username);

//    @Query("SELECT new org.example.crud.dto.UserSummaryDTO(u.id, u.username) FROM User u")
//    List<UserSummaryDTO> findAllUserSummaries();
}

