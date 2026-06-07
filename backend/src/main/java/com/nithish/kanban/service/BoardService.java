package com.nithish.kanban.service;

import com.nithish.kanban.dto.BoardRequest;
import com.nithish.kanban.entity.AppUser;
import com.nithish.kanban.entity.Board;
import com.nithish.kanban.exception.ResourceNotFoundException;
import com.nithish.kanban.repository.BoardRepository;
import com.nithish.kanban.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public BoardService(BoardRepository boardRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    public Board createBoard(BoardRequest request, String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Board board = Board.builder()
                .name(request.getName())
                .user(user)
                .build();

        return boardRepository.save(board);
    }

    public List<Board> getMyBoards(String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return boardRepository.findAllByUser(user);
    }

    public Board updateBoard(String id, BoardRequest request, String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Board board = boardRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        board.setName(request.getName());
        return boardRepository.save(board);
    }

    public void deleteBoard(String id, String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Board board = boardRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        boardRepository.delete(board);
    }
}