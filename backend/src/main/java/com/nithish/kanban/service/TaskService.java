package com.nithish.kanban.service;

import com.nithish.kanban.dto.MoveTaskRequest;
import com.nithish.kanban.dto.TaskRequest;
import com.nithish.kanban.entity.AppUser;
import com.nithish.kanban.entity.KanbanColumn;
import com.nithish.kanban.entity.TaskItem;
import com.nithish.kanban.exception.ResourceNotFoundException;
import com.nithish.kanban.repository.ColumnRepository;
import com.nithish.kanban.repository.TaskRepository;
import com.nithish.kanban.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class TaskService {

    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, ColumnRepository columnRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.columnRepository = columnRepository;
        this.userRepository = userRepository;
    }

    public TaskItem createTask(String columnId, TaskRequest request, String email) {
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!column.getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Column not found");
        }

        TaskItem task = TaskItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .position(request.getPosition())
                .column(column)
                .build();

        return taskRepository.save(task);
    }

    public List<TaskItem> getTasksByColumn(String columnId, String email) {
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!column.getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Column not found");
        }
        return taskRepository.findAllByColumnId(columnId);
    }

    public TaskItem updateTask(String id, TaskRequest request, String email) {
        TaskItem task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!task.getColumn().getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setPosition(request.getPosition());

        return taskRepository.save(task);
    }

    public void deleteTask(String id, String email) {
        TaskItem task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!task.getColumn().getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }
        taskRepository.delete(task);
    }

    public TaskItem moveTask(String taskId, MoveTaskRequest request, String email) {
        TaskItem task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!task.getColumn().getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found");
        }

        KanbanColumn targetColumn = columnRepository.findById(request.getTargetColumnId())
                .orElseThrow(() -> new ResourceNotFoundException("Target column not found"));
        if (!targetColumn.getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Target column not found");
        }

        task.setColumn(targetColumn);

        if (request.getTargetPosition() != null) {
            task.setPosition(request.getTargetPosition());
        }

        return taskRepository.save(task);
    }
}