package com.spring.AssignmentProjectSubmission.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.AssignmentProjectSubmission.domain.User;
import com.spring.AssignmentProjectSubmission.dto.AuthCredentialsRequest;
import com.spring.AssignmentProjectSubmission.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtUtil jwtUtil;

	// login a user details
	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest request) {
		try {
			Authentication authenticate = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

			User user = (User) authenticate.getPrincipal();

			return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, jwtUtil.generateToken(user)).body(user);
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	// check if given token is valid
	// @RequestParam will bind parameter to the URL , ex:
	// http://localhost:8090/api/auth/validate?token={hkbkbkknjnjlnlnl}
	@GetMapping("/validate")
	public ResponseEntity<?> validateToken(@RequestParam String token, @AuthenticationPrincipal User user) {
		try {
			Boolean isTokenValid = jwtUtil.validateToken(token, user);
			return ResponseEntity.ok(isTokenValid);
		} catch (ExpiredJwtException e) {

			return ResponseEntity.ok(false);
		}

	}

}
