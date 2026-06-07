package com.nithish.kanban.dto;

import jakarta.validation.constraints.NotBlank;

public class BoardRequest {
    @NotBlank
    private String name;

    public BoardRequest() {}

    public BoardRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}