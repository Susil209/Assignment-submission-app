package com.spring.AssignmentProjectSubmission.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="users")
public class User implements UserDetails { //UserDetails is interface coming from spring security that has some abstract methods 
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private LocalDate cohertStartDate;
	private String username;
	@JsonIgnore
	private String password;
	
	@JsonIgnore // When we convert Java object to JSON string format 
				// and send string from java -> react side , 
				// the assignment should not be added with User   
	@OneToMany(fetch = FetchType.EAGER,mappedBy = "user")
	private List<Authority> authorities = new ArrayList<>();
	private String name;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public LocalDate getCohertStartDate() {
		return cohertStartDate;
	}
	public void setCohertStartDate(LocalDate cohertStartDate) {
		this.cohertStartDate = cohertStartDate;
	}
	@Override
	public String getUsername() { //Both getUsername and getPassword are abstract methods in UserDetails interface so we need to override those methods.
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	@Override
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	// These are abstract methods of UserDetails interface
	// Marked them all true so every user is checked
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() { //GrantedAuthority is an interface that implements getAuthority() method which is nothing but giving role to user.
//		List<GrantedAuthority> roles = new ArrayList<>();
//		roles.add(new Authority("ROLE_STUDENT"));
		return authorities;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", cohertStartDate=" + cohertStartDate + ", username=" + username + ", password="
				+ password + ", authorities=" + authorities + ", name=" + name + "]";
	}
	
	
	
	
}
