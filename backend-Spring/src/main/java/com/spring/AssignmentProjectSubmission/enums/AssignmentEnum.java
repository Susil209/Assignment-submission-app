package com.spring.AssignmentProjectSubmission.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AssignmentEnum {
	ASSIGNMENT_1(1,"HTML Demo"),
	ASSIGNMENT_2(2,"Mark CSS"),
	ASSIGNMENT_3(3,"Learn JavaScript"),
	ASSIGNMENT_4(4,"React Application"),
	ASSIGNMENT_5(5,"Core Java"),
	ASSIGNMENT_6(6,"Advanced Java"),
	ASSIGNMENT_7(7,"Spring Core"),
	ASSIGNMENT_8(8,"Maven"),
	ASSIGNMENT_9(9,"Spring Boot"),
	ASSIGNMENT_10(10,"Spring MVC");
	
	private int assignmentNum;
	private String assignmentName;
	
	private AssignmentEnum(int assignmentNum, String assignmentName) {
		this.assignmentNum = assignmentNum;
		this.assignmentName = assignmentName;
	}

	public int getAssignmentNum() {
		return assignmentNum;
	}

	public void setAssignmentNum(int assignmentNum) {
		this.assignmentNum = assignmentNum;
	}

	public String getAssignmentName() {
		return assignmentName;
	}

	public void setAssignmentName(String assignmentName) {
		this.assignmentName = assignmentName;
	}
	
	
	
	// We use enums as they store data in local.
	// Enums are preferably used while using drop-down.
	
	
}
