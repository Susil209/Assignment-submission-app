package com.spring.AssignmentProjectSubmission.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.spring.AssignmentProjectSubmission.repository.UserRepository;
import com.spring.AssignmentProjectSubmission.util.JwtUtil;

@Component
public class JwtFilter extends OncePerRequestFilter { // executes one execution for one request

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		// Get authorization header and validate --> It will check do we have Bearer at the start of the token ??
		final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (!StringUtils.hasText(header) || ( StringUtils.hasText(header) && !header.startsWith("Bearer ")) ) {
			chain.doFilter(request, response);  // if yes then filter it.
			return;
		}

		// here split the token string and Bearer . So we only got token string.
		final String token = header.split(" ")[1].trim();
		
		
		// Get user identity and set it on the spring security context
		UserDetails userDetails = userRepo.findByUsername(jwtUtil.getUsernameFromToken(token)).orElse(null);

		// Get jwt token and validate
		if (!jwtUtil.validateToken(token, userDetails)) {
			chain.doFilter(request, response);
			return;
		}

		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
				userDetails == null ? List.of() : userDetails.getAuthorities());

		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

		//Here we finally set the user details if the user is valid
		SecurityContextHolder.getContext().setAuthentication(authentication);
		chain.doFilter(request, response);

	}
}
