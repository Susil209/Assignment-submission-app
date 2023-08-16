package com.spring.AssignmentProjectSubmission.util;

import com.spring.AssignmentProjectSubmission.domain.User;

public class AuthorityUtil {
	
	public static Boolean hasRole(String role,User user) {
		//filter all authorities role and match with role given
		return user.getAuthorities()
			.stream()
			.filter(auth -> auth.getAuthority().equals(role))
			.count() > 0;
	}
}
