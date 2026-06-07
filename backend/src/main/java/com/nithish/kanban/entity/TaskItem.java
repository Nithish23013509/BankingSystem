package com.nithish.kanban.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import java.time.LocalDate;

@Document(collection = "tasks")
public class TaskItem {

    @Id
    private String id;

    private String title;

    private String description;

    private String priority;

    private LocalDate dueDate;

    private Integer position;

    @DocumentReference(lazy = true)
    @JsonIgnore
    private KanbanColumn column;

    public TaskItem() {
    }

    public TaskItem(String id, String title, String description, String priority, LocalDate dueDate, Integer position, KanbanColumn column) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.position = position;
        this.column = column;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public KanbanColumn getColumn() {
        return column;
    }

    public void setColumn(KanbanColumn column) {
        this.column = column;
    }

    public static TaskItemBuilder builder() {
        return new TaskItemBuilder();
    }

    public static class TaskItemBuilder {
        private String title;
        private String description;
        private String priority;
        private LocalDate dueDate;
        private Integer position;
        private KanbanColumn column;

        public TaskItemBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TaskItemBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TaskItemBuilder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public TaskItemBuilder dueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TaskItemBuilder position(Integer position) {
            this.position = position;
            return this;
        }

        public TaskItemBuilder column(KanbanColumn column) {
            this.column = column;
            return this;
        }

        public TaskItem build() {
            TaskItem taskItem = new TaskItem();
            taskItem.setTitle(title);
            taskItem.setDescription(description);
            taskItem.setPriority(priority);
            taskItem.setDueDate(dueDate);
            taskItem.setPosition(position);
            taskItem.setColumn(column);
            return taskItem;
        }
    }
}