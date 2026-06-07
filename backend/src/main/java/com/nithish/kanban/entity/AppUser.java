package com.nithish.kanban.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class AppUser {

    @Id
    private String id;

    private String name;

    private String email;

    @JsonIgnore
    private String password;

    @DocumentReference(lazy = true)
    private List<Board> boards = new ArrayList<>();

    public AppUser() {
    }

    public AppUser(String id, String name, String email, String password, List<Board> boards) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.boards = boards;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }

    public static AppUserBuilder builder() {
        return new AppUserBuilder();
    }

    public static class AppUserBuilder {
        private String name;
        private String email;
        private String password;

        public AppUserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AppUserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AppUserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public AppUser build() {
            AppUser appUser = new AppUser();
            appUser.setName(name);
            appUser.setEmail(email);
            appUser.setPassword(password);
            return appUser;
        }
    }
}