package com.nithish.kanban.service;

import com.nithish.kanban.dto.ColumnRequest;
import com.nithish.kanban.entity.AppUser;
import com.nithish.kanban.entity.Board;
import com.nithish.kanban.entity.KanbanColumn;
import com.nithish.kanban.exception.ResourceNotFoundException;
import com.nithish.kanban.repository.BoardRepository;
import com.nithish.kanban.repository.ColumnRepository;
import com.nithish.kanban.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public ColumnService(ColumnRepository columnRepository, BoardRepository boardRepository, UserRepository userRepository) {
        this.columnRepository = columnRepository;
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    public KanbanColumn createColumn(String boardId, ColumnRequest request, String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Board board = boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        KanbanColumn column = KanbanColumn.builder()
                .name(request.getName())
                .position(request.getPosition())
                .board(board)
                .build();

        return columnRepository.save(column);
    }

    public List<KanbanColumn> getColumnsByBoard(String boardId, String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        boardRepository.findByIdAndUser(boardId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        return columnRepository.findAllByBoardId(boardId);
    }

    public KanbanColumn updateColumn(String id, ColumnRequest request, String email) {
        KanbanColumn column = columnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!column.getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Column not found");
        }

        column.setName(request.getName());
        column.setPosition(request.getPosition());
        return columnRepository.save(column);
    }

    public void deleteColumn(String id, String email) {
        KanbanColumn column = columnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
        
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!column.getBoard().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Column not found");
        }
        columnRepository.delete(column);
    }
}