package com.nithish.kanban.repository;

import com.nithish.kanban.entity.AppUser;
import com.nithish.kanban.entity.Board;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends MongoRepository<Board, String> {

    List<Board> findAllByUser(AppUser user);

    Optional<Board> findByIdAndUser(String id, AppUser user);
}