package com.spring.AssignmentProjectSubmission.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.spring.AssignmentProjectSubmission.domain.Assignment;
import com.spring.AssignmentProjectSubmission.domain.User;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
	 //Query all the assignments for the user.
	Set<Assignment> findByUser(User user);

	//Custom query -->
	// for (status = 'submitted' and if codeReviewer = null or codeReviewer(In Review))  or 'codeReviewer(In Review)'
	// get all assignments
	@Query("select a from Assignment a " 
			+ "where (a.status = 'submitted' and (a.codeReviewer is null or a.codeReviewer = :codeReviewer)) "
			+ "or a.codeReviewer = :codeReviewer")
	Set<Assignment> findByCodeReviewer(User codeReviewer);//Note :ThisValue must be same as parameter passed.

}
