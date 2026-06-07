package com.nithish.kanban.controller;

import com.nithish.kanban.dto.MoveTaskRequest;
import com.nithish.kanban.dto.TaskRequest;
import com.nithish.kanban.entity.TaskItem;
import com.nithish.kanban.service.TaskService;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/columns/{columnId}/tasks")
    public TaskItem createTask(@PathVariable String columnId,
                               @Valid @RequestBody TaskRequest request,
                               Authentication authentication) {
        return taskService.createTask(columnId, request, authentication.getName());
    }

    @GetMapping("/columns/{columnId}/tasks")
    public List<TaskItem> getTasks(@PathVariable String columnId,
                                   Authentication authentication) {
        return taskService.getTasksByColumn(columnId, authentication.getName());
    }

    @PutMapping("/tasks/{id}")
    public TaskItem updateTask(@PathVariable String id,
                               @Valid @RequestBody TaskRequest request,
                               Authentication authentication) {
        return taskService.updateTask(id, request, authentication.getName());
    }

    @PutMapping("/tasks/{id}/move")
    public TaskItem moveTask(@PathVariable String id,
                             @RequestBody MoveTaskRequest request,
                             Authentication authentication) {
        return taskService.moveTask(id, request, authentication.getName());
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable String id,
                           Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
    }
}