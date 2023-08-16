package com.spring.AssignmentProjectSubmission.service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.AssignmentProjectSubmission.domain.Assignment;
import com.spring.AssignmentProjectSubmission.domain.Comment;
import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.dto.CommentDto;
import com.spring.AssignmentProjectSubmission.repository.AssignmentRepository;
import com.spring.AssignmentProjectSubmission.repository.CommentRepository;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	public Comment saveComment(CommentDto commentDto, User user) {

		Comment comment = new Comment();
		Assignment assignment = assignmentRepository.getReferenceById(commentDto.getAssignmentId());

		comment.setId(commentDto.getId());
		comment.setText(commentDto.getText());
		comment.setAssignment(assignment);
		comment.setCreatedBy(user);

		// If there is no id,then only create a date
		if (commentDto.getId() == null) {
			comment.setCreatedDate(ZonedDateTime.now());
		} else {
			comment.setCreatedDate(commentDto.getCreatedDate());
		}

		return commentRepository.save(comment);
	}

	public Set<Comment> getCommentsByAssignmentId(Long assignmentId) {
		Set<Comment> comments = commentRepository.findByAssignmentId(assignmentId);
		return comments;
	}

	public void delete(Long commentId) {
		commentRepository.deleteById(commentId);
	}

}
