package com.spring.AssignmentProjectSubmission.web;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.AssignmentProjectSubmission.domain.Assignment;
import com.spring.AssignmentProjectSubmission.domain.Authority;
import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.dto.AssignmentResponseDto;
import com.spring.AssignmentProjectSubmission.enums.AuthorityEnum;
import com.spring.AssignmentProjectSubmission.service.AssignmentService;
import com.spring.AssignmentProjectSubmission.service.UserService;
import com.spring.AssignmentProjectSubmission.util.AuthorityUtil;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private UserService userService;

	@PostMapping
	public ResponseEntity<?> createAssignment(@AuthenticationPrincipal User user) {
		Assignment newAssignment = assignmentService.save(user);
		return ResponseEntity.ok(newAssignment);
	}

	// Get all assignments
	@GetMapping
	public ResponseEntity<?> getAssignments(@AuthenticationPrincipal User user) {
		Set<Assignment> assignmentByUser = assignmentService.findByUser(user);
		return ResponseEntity.ok(assignmentByUser);
	}

	// get assignment by id
	@GetMapping("{assignmentId}") // Path variable is the variable attached in query inside the web address
	public ResponseEntity<?> getAssignmentById(@PathVariable Long assignmentId, @AuthenticationPrincipal User user) {
		Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
		AssignmentResponseDto assignmentResponseDto = new AssignmentResponseDto(assignmentOpt.orElse(new Assignment()));
		return ResponseEntity.ok(assignmentResponseDto);
	}

	// update and save assignment
	@PutMapping("{assignmentId}") // Request body is the content sent from front-end side
	public ResponseEntity<?> updateAndSaveAssignment(@PathVariable Long assignmentId,
			@RequestBody Assignment assignment, @AuthenticationPrincipal User user) {

		// add the code reviewer to this assignment if it was claimed
		if (assignment.getCodeReviewer() != null) {
			User codeReviewer = assignment.getCodeReviewer();
			codeReviewer = userService.findUserByUsername(codeReviewer.getUsername()).orElseThrow();

			if (AuthorityUtil.hasRole(AuthorityEnum.ROLE_CODE_REVIEWER.name(), user)) {
				assignment.setCodeReviewer(codeReviewer);
			}
		}

		Assignment updateAssignment = assignmentService.updateAndSave(assignment);
		return ResponseEntity.ok(updateAssignment);
	}

}
