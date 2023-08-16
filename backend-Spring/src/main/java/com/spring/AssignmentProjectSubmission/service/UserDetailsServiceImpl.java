package com.spring.AssignmentProjectSubmission.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.repository.UserRepository;
import com.spring.AssignmentProjectSubmission.util.CustomPasswordEncoder;

@Service //Spring boot will implement this service class automatically 
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private CustomPasswordEncoder passwordEncoder;
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<User> userOptional = userRepository.findByUsername(username);
		
		return userOptional.orElseThrow(() -> new UsernameNotFoundException("Invalid Credentials"));
		
	
		// don't hard code user anymore
//		User user = new User();
//		user.setUsername(username);
//		user.setPassword(passwordEncoder.getPasswordEncoder().encode("asdfasdf"));//password is hard-coded for now
//		user.setId(1L);
//		return user; //load new User object each time the method is called
	}

}
