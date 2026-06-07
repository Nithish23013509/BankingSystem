package com.nithish.kanban.repository;

import com.nithish.kanban.entity.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}