package com.spring.AssignmentProjectSubmission.dto;

import com.spring.AssignmentProjectSubmission.domain.Assignment;
import com.spring.AssignmentProjectSubmission.enums.AssignmentEnum;
import com.spring.AssignmentProjectSubmission.enums.AssignmentStatusEnum;

public class AssignmentResponseDto {

	private Assignment assignment;
	private AssignmentEnum[] assignmentEnum = AssignmentEnum.values();
	private AssignmentStatusEnum[] statusEnums = AssignmentStatusEnum.values();

	public AssignmentStatusEnum[] getStatusEnums() {
		return statusEnums;
	}

	public AssignmentResponseDto(Assignment assignment) {
		super();
		this.assignment = assignment;
	}

	public Assignment getAssignment() {
		return assignment;
	}

	public void setAssignment(Assignment assignment) {
		this.assignment = assignment;
	}

	public AssignmentEnum[] getAssignmentEnum() {
		return assignmentEnum;
	}

}
