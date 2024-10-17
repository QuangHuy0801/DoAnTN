package com.example.EVIAppServer.repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.EVIAppServer.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
	User findByEmail(String email);
	Optional<User> findById(String id);
	
	User findByIdAndRole(String id, String role);
	List<User> findByRole(String role);
	
	void deleteById(String id);
	
	
}
