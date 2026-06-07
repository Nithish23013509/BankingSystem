package com.nithish.kanban.dto;

public class MoveTaskRequest {
    private String targetColumnId;
    private Integer targetPosition;

    public MoveTaskRequest() {}

    public MoveTaskRequest(String targetColumnId, Integer targetPosition) {
        this.targetColumnId = targetColumnId;
        this.targetPosition = targetPosition;
    }

    public String getTargetColumnId() {
        return targetColumnId;
    }

    public void setTargetColumnId(String targetColumnId) {
        this.targetColumnId = targetColumnId;
    }

    public Integer getTargetPosition() {
        return targetPosition;
    }

    public void setTargetPosition(Integer targetPosition) {
        this.targetPosition = targetPosition;
    }
}