package com.nithish.kanban.repository;

import com.nithish.kanban.entity.TaskItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<TaskItem, String> {

    List<TaskItem> findAllByColumnId(String columnId);

}