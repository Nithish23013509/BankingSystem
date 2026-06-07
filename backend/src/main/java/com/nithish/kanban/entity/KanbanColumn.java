package com.nithish.kanban.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "columns")
public class KanbanColumn {

    @Id
    private String id;

    private String name;

    private Integer position;

    @DocumentReference(lazy = true)
    @JsonIgnore
    private Board board;

    @DocumentReference(lazy = true)
    @JsonIgnore
    private List<TaskItem> tasks = new ArrayList<>();

    public KanbanColumn() {
    }

    public KanbanColumn(String id, String name, Integer position, Board board, List<TaskItem> tasks) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.board = board;
        this.tasks = tasks;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Board getBoard() {
        return board;
    }

    public void setBoard(Board board) {
        this.board = board;
    }

    public List<TaskItem> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskItem> tasks) {
        this.tasks = tasks;
    }

    public static KanbanColumnBuilder builder() {
        return new KanbanColumnBuilder();
    }

    public static class KanbanColumnBuilder {
        private String name;
        private Integer position;
        private Board board;

        public KanbanColumnBuilder name(String name) {
            this.name = name;
            return this;
        }

        public KanbanColumnBuilder position(Integer position) {
            this.position = position;
            return this;
        }

        public KanbanColumnBuilder board(Board board) {
            this.board = board;
            return this;
        }

        public KanbanColumn build() {
            KanbanColumn kanbanColumn = new KanbanColumn();
            kanbanColumn.setName(name);
            kanbanColumn.setPosition(position);
            kanbanColumn.setBoard(board);
            return kanbanColumn;
        }
    }
}