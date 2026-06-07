package com.nithish.kanban.controller;

import com.nithish.kanban.dto.BoardRequest;
import com.nithish.kanban.entity.Board;
import com.nithish.kanban.service.BoardService;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boards")

@CrossOrigin(origins = "http://localhost:5173")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public Board createBoard(@Valid @RequestBody BoardRequest request, Authentication authentication) {
        return boardService.createBoard(request, authentication.getName());
    }

    @GetMapping
    public List<Board> getMyBoards(Authentication authentication) {
        return boardService.getMyBoards(authentication.getName());
    }

    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable String id,
                             @Valid @RequestBody BoardRequest request,
                             Authentication authentication) {
        return boardService.updateBoard(id, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable String id, Authentication authentication) {
        boardService.deleteBoard(id, authentication.getName());
    }
}