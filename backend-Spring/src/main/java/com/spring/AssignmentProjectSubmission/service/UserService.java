package com.spring.AssignmentProjectSubmission.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.repository.AssignmentRepository;
import com.spring.AssignmentProjectSubmission.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	public Optional<User> findUserByUsername(String username){
		return userRepository.findByUsername(username);
	}
}
