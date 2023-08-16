package com.spring.AssignmentProjectSubmission.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AssignmentStatusEnum {

	PENDING_SUBMISSION("Pending Submission", 1),
	SUBMITTED("Submitted", 2),
	IN_REVIEW("In Review", 3),
	NEEDS_UPDATE("Needs Update", 4),
	COMPLETED("Completed", 5),
	RESUBMITTED("Resubmitted", 6);

	private String status;
	private Integer steps;

	private AssignmentStatusEnum(String status, Integer steps) {
		this.status = status;
		this.steps = steps;
	}

	public String getStatus() {
		return status;
	}

	public Integer getSteps() {
		return steps;
	}

}
