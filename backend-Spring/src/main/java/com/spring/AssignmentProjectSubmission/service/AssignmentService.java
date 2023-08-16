package com.spring.AssignmentProjectSubmission.service;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.AssignmentProjectSubmission.domain.Assignment;
import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.enums.AssignmentStatusEnum;
import com.spring.AssignmentProjectSubmission.enums.AuthorityEnum;
import com.spring.AssignmentProjectSubmission.repository.AssignmentRepository;

@Service
public class AssignmentService {

	@Autowired
	private AssignmentRepository assignmentRepository;
	
	public Assignment save(User user) {
		Assignment assignment = new Assignment();
		assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
		assignment.setNumber(findNextAssignmentToSubmit(user));
		assignment.setUser(user);
		
		return assignmentRepository.save(assignment);
	}
	
	private Integer findNextAssignmentToSubmit(User user) {
		Set<Assignment> assignmentByUser = assignmentRepository.findByUser(user);
		// For no user set assignment number 1
		if(assignmentByUser == null) {
			return 1;
		}
		
		// in assignmentByUser stream compare assignment-2 with assignment-1 
		//and sort the assignments in descending order.Then map all these
		// assignment to the current number + 1 .
		Optional<Integer> nextAssignmentNumberOpt = 
				assignmentByUser.stream()
						.sorted((a1,a2)->{
							if(a1.getNumber() == null) return 1;
							if(a2.getNumber() == null) return 1;
							return a2.getNumber().compareTo(a1.getNumber());
						})
						.map(assignment->{
							if(assignment.getNumber() == null) return 1;
							return assignment.getNumber() + 1;
						})
						.findFirst();
		
		return nextAssignmentNumberOpt.orElse(1);
	}

	// Find all assignments
	public Set<Assignment> findByUser(User user){
		// load assignments if you are in code reviewer role
		boolean hasCodeReviewerRole = user.getAuthorities()
			.stream()
			.filter(auth->AuthorityEnum.ROLE_CODE_REVIEWER.name().equals(auth.getAuthority()))
			.count() > 0 ;
		if(hasCodeReviewerRole) {
			return assignmentRepository.findByCodeReviewer(user);
		}
		// load assignments if you are in student role
		Set<Assignment> assignmentByUser = assignmentRepository.findByUser(user);
		return assignmentByUser;
	}

	public Optional<Assignment> findById(Long assignmentId) {
		return assignmentRepository.findById(assignmentId);
	}

	public Assignment updateAndSave(Assignment assignment) {
		return assignmentRepository.save(assignment);
	}
}
