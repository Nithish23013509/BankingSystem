package com.nithish.kanban.controller;

import com.nithish.kanban.dto.ColumnRequest;
import com.nithish.kanban.entity.KanbanColumn;
import com.nithish.kanban.service.ColumnService;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards/{boardId}/columns")

@CrossOrigin(origins = "http://localhost:5173")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @PostMapping
    public KanbanColumn createColumn(@PathVariable String boardId,
                                     @Valid @RequestBody ColumnRequest request,
                                     Authentication authentication) {
        return columnService.createColumn(boardId, request, authentication.getName());
    }

    @GetMapping
    public List<KanbanColumn> getColumns(@PathVariable String boardId,
                                         Authentication authentication) {
        return columnService.getColumnsByBoard(boardId, authentication.getName());
    }

    @PutMapping("/{id}")
    public KanbanColumn updateColumn(@PathVariable String boardId,
                                     @PathVariable String id,
                                     @Valid @RequestBody ColumnRequest request,
                                     Authentication authentication) {
        return columnService.updateColumn(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteColumn(@PathVariable String boardId,
                             @PathVariable String id,
                             Authentication authentication) {
        columnService.deleteColumn(id, authentication.getName());
    }
}