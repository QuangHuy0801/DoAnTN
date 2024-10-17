package com.example.EVIAppServer.entity;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data // lombok giúp generate các hàm constructor, get, set v.v.
@AllArgsConstructor
@ToString
@NoArgsConstructor
@Table(name = "user")
public class User {
	@Id()
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String id;
	
	@Column(name = "login_Type", columnDefinition = "nvarchar(1111)")
	private String login_Type;
	
	@Column(name = "role", columnDefinition = "nvarchar(1111)")
	private String role;
	
	@Column(name = "password",columnDefinition = "nvarchar(1111)")
	private String password;
	
	@Column(name = "user_Name", columnDefinition = "nvarchar(1111)")
	private String user_Name;

	@Column(name = "avatar", columnDefinition = "nvarchar(1111)")
	private String avatar;
	
	@Column(name = "email", columnDefinition = "nvarchar(1111)")
	private String email;
	
	@Column(name = "phone_Number", columnDefinition = "nvarchar(1111)")
	private String phone_Number;
	
	
	@Column(name = "address", columnDefinition = "nvarchar(1111)")
	private String address;

	 @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	    private List<Bookings> bookings;
}
