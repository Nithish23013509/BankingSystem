package com.nithish.kanban.dto;

import jakarta.validation.constraints.NotBlank;

public class ColumnRequest {
    @NotBlank
    private String name;

    private Integer position;

    public ColumnRequest() {}

    public ColumnRequest(String name, Integer position) {
        this.name = name;
        this.position = position;
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
}