package com.nithish.kanban.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "boards")
public class Board {

    @Id
    private String id;

    private String name;

    @DocumentReference(lazy = true)
    @JsonIgnore
    private AppUser user;

    @DocumentReference(lazy = true)
    private List<KanbanColumn> columns = new ArrayList<>();

    public Board() {
    }

    public Board(String id, String name, AppUser user, List<KanbanColumn> columns) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.columns = columns;
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

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public List<KanbanColumn> getColumns() {
        return columns;
    }

    public void setColumns(List<KanbanColumn> columns) {
        this.columns = columns;
    }

    public static BoardBuilder builder() {
        return new BoardBuilder();
    }

    public static class BoardBuilder {
        private String name;
        private AppUser user;

        public BoardBuilder name(String name) {
            this.name = name;
            return this;
        }

        public BoardBuilder user(AppUser user) {
            this.user = user;
            return this;
        }

        public Board build() {
            Board board = new Board();
            board.setName(name);
            board.setUser(user);
            return board;
        }
    }
}