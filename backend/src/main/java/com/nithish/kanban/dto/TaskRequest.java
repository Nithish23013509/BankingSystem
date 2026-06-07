package com.nithish.kanban.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
public class TaskRequest {
    @NotBlank
    private String title;

    private String description;
    private String priority;
    private LocalDate dueDate;
    private Integer position;

    public TaskRequest() {}

    public TaskRequest(String title, String description, String priority, LocalDate dueDate, Integer position) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.position = position;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}