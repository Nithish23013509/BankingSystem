package com.nithish.kanban.repository;

import com.nithish.kanban.entity.KanbanColumn;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ColumnRepository extends MongoRepository<KanbanColumn, String> {

    List<KanbanColumn> findAllByBoardId(String boardId);

}