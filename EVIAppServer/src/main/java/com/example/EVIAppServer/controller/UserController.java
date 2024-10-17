package com.example.EVIAppServer.controller;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.EVIAppServer.entity.User;
import com.example.EVIAppServer.model.BookingDTO;
import com.example.EVIAppServer.model.Mail;
import com.example.EVIAppServer.model.UserDTO;
import com.example.EVIAppServer.service.CloudinaryService;
import com.example.EVIAppServer.service.MailService;
import com.example.EVIAppServer.service.UserService;
import com.google.gson.Gson;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;

@CrossOrigin("*")
@RestController
public class UserController {
	@Autowired
	UserService userService;

	@Autowired
	MailService mailService;

	@Autowired
	HttpSession session;

	@Autowired
	CloudinaryService cloudinaryService;
	
	@Autowired
    private ModelMapper modelMapper;
	
    @GetMapping("/getalluser")
    public ResponseEntity<List<UserDTO>> getAllUser() {
        List<User> users = userService.findByRole("user");
        List<UserDTO> userDTOs = users.stream()
                                      .map(user -> modelMapper.map(user, UserDTO.class))
                                      .collect(Collectors.toList());
        return new ResponseEntity<>(userDTOs, HttpStatus.OK);
    }

	@GetMapping(path = "/login")
	public ResponseEntity<UserDTO> Login(String id, String password) {
		System.out.println(id);
		User userFind = userService.findByIdAndRole(id, "user");
		UserDTO user = modelMapper.map(userFind,UserDTO.class);
		if (user != null && user.getPassword() != null) {
			String decodedValue = new String(Base64.getDecoder().decode(user.getPassword()));
			System.out.println(user);
			if (password.equals(decodedValue)) {
//			userFind.setPassword(decodedValue);
				user.setPassword(decodedValue);
				return new ResponseEntity<>(user, HttpStatus.OK);
			}
			else {
				return null;
			}
		}
		else
			return new ResponseEntity<>(user, HttpStatus.OK);
	}
	@GetMapping(path = "/login-admin")
	public ResponseEntity<UserDTO> LoginAdmin(String id, String password) {
		System.out.println(id);
		User userFind = userService.findByIdAndRole(id, "admin");
		UserDTO user = modelMapper.map(userFind,UserDTO.class);
		if (user != null && user.getPassword() != null) {
			String decodedValue = new String(Base64.getDecoder().decode(user.getPassword()));
			System.out.println(user);
			if (password.equals(decodedValue)) {
//			userFind.setPassword(decodedValue);
				user.setPassword(decodedValue);
				return new ResponseEntity<>(user, HttpStatus.OK);
			}
			else {
				return null;
			}
		}
		else
			return new ResponseEntity<>(user, HttpStatus.OK);
	}
	@GetMapping(path = "/login_inspector")
	public ResponseEntity<UserDTO> loginInspector(String id, String password) {
		System.out.println(id);
		User userFind = userService.findByIdAndRole(id, "inspector");
		UserDTO user = modelMapper.map(userFind,UserDTO.class);
		if (user != null && user.getPassword() != null) {
			String decodedValue = new String(Base64.getDecoder().decode(user.getPassword()));
			System.out.println(user);
			if (password.equals(decodedValue)) {
//			userFind.setPassword(decodedValue);
				user.setPassword(decodedValue);
				return new ResponseEntity<>(user, HttpStatus.OK);
			}
			else {
				return null;
			}
		}
		else
			return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@PostMapping(path = "/signup", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<User> SignUp(String username, String fullname, String email, String password) {
		User user = userService.findByIdAndRole(username, "user");
		if (user != null) {
			return new ResponseEntity<>(null, HttpStatus.OK);
		} else {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			String avatar = "https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang-den.png";
			User newUser = userService.saveUser(new User(username, "default", "user", encodedValue, fullname, avatar,
					email, null, null,null));
			System.out.println(newUser);
			return new ResponseEntity<>(newUser, HttpStatus.OK);
		}
	}


	@PostMapping(path = "/forgot", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotPassword(String id) {
	    User user = userService.findByIdAndRole(id, "user");
	    if (user != null) {
	        int code = (int) Math.floor(((Math.random() * 899999) + 100000));
	        Mail mail = new Mail();
	        mail.setMailFrom("n20dccn022@student.ptithcm.edu.vn");
	        mail.setMailTo(user.getEmail());
	        mail.setMailSubject("Forgot Password");
	        mail.setMailContent("Your code is: " + code);
	        System.out.println("Your code is: " + code);
	        
	        try {
	            mailService.sendEmail(mail);
	            session.setAttribute("code", code);
	            System.out.println(code);
	            return new ResponseEntity<String>(new Gson().toJson(String.valueOf(code)), HttpStatus.OK);
	        } catch (MessagingException e) {
	            e.printStackTrace();
	            return new ResponseEntity<String>("Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    } else {
	        return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
	    }
	}
	@PostMapping(path = "/forgotAdmin", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotPasswordAdmin(String id) {
	    User user = userService.findByIdAndRole(id, "admin");
	    if (user != null) {
	        int code = (int) Math.floor(((Math.random() * 899999) + 100000));
	        Mail mail = new Mail();
	        mail.setMailFrom("n20dccn022@student.ptithcm.edu.vn");
	        mail.setMailTo(user.getEmail());
	        mail.setMailSubject("Forgot Password");
	        mail.setMailContent("Your code is: " + code);
	        System.out.println("Your code is: " + code);
	        
	        try {
	            mailService.sendEmail(mail);
	            session.setAttribute("code", code);
	            System.out.println(code);
	            return new ResponseEntity<String>(new Gson().toJson(String.valueOf(code)), HttpStatus.OK);
	        } catch (MessagingException e) {
	            e.printStackTrace();
	            return new ResponseEntity<String>("Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    } else {
	        return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
	    }
	}
	
	
	@PostMapping(path = "/forgotInspector", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotPasswordInspector(String id) {
	    User user = userService.findByIdAndRole(id, "inspector");
	    if (user != null) {
	        int code = (int) Math.floor(((Math.random() * 899999) + 100000));
	        Mail mail = new Mail();
	        mail.setMailFrom("n20dccn022@student.ptithcm.edu.vn");
	        mail.setMailTo(user.getEmail());
	        mail.setMailSubject("Forgot Password");
	        mail.setMailContent("Your code is: " + code);
	        System.out.println("Your code is: " + code);
	        
	        try {
	            mailService.sendEmail(mail);
	            session.setAttribute("code", code);
	            System.out.println(code);
	            return new ResponseEntity<String>(new Gson().toJson(String.valueOf(code)), HttpStatus.OK);
	        } catch (MessagingException e) {
	            e.printStackTrace();
	            return new ResponseEntity<String>("Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    } else {
	        return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
	    }
	}

	@PostMapping(path = "/forgotnewpass", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotNewPass(String id, String code, String password) {
//		String codeSession = (String) session.getAttribute("code");
//		System.out.println("session: "+ codeSession);
		User user = userService.findByIdAndRole(id, "user");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}
	
	@PostMapping(path = "/forgotnewpassAdmin", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotNewPassAdmin(String id, String code, String password) {
//		String codeSession = (String) session.getAttribute("code");
//		System.out.println("session: "+ codeSession);
		User user = userService.findByIdAndRole(id, "admin");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}
	
	
	@PostMapping(path = "/forgotnewpassInspector", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ForgotNewPassInspector(String id, String code, String password) {
//		String codeSession = (String) session.getAttribute("code");
//		System.out.println("session: "+ codeSession);
		User user = userService.findByIdAndRole(id, "inspector");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}


	@PostMapping(path = "changepassword", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ChangePassword(String id, String password) {
		User user = userService.findByIdAndRole(id, "user");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}
	
	@PostMapping(path = "changepasswordadmin", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ChangePasswordAdmin(String id, String password) {
		User user = userService.findByIdAndRole(id, "admin");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}
	
	
	@PostMapping(path = "changepasswordInspector", consumes = "application/x-www-form-urlencoded")
	public ResponseEntity<String> ChangePasswordInspector(String id, String password) {
		User user = userService.findByIdAndRole(id, "inspector");
		if (user != null) {
			String encodedValue = Base64.getEncoder().encodeToString(password.getBytes());
			user.setPassword(encodedValue);
			userService.saveUser(user);
			return new ResponseEntity<String>(password, HttpStatus.OK);
		} else
			return new ResponseEntity<String>(HttpStatus.NOT_ACCEPTABLE);
	}

	@PostMapping(path = "/update", consumes = "multipart/form-data")
	public ResponseEntity<UserDTO> UpdateAvatar(String id, MultipartFile avatar, String fullname, String email,
			String phoneNumber, String address) {
		User user = userService.findByIdAndRole(id, "user");
		if (user != null) {
			if (avatar !=null) {
				String url = cloudinaryService.uploadFile(avatar);
				user.setAvatar(url);
			}
			user.setUser_Name(fullname);
			user.setEmail(email);
			user.setPhone_Number(phoneNumber);
			user.setAddress(address);
			userService.saveUser(user);
			if(user.getPassword()!=null)
				user.setPassword(new String(Base64.getDecoder().decode(user.getPassword())));
			UserDTO userDTO = modelMapper.map(user,UserDTO.class);
			return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
		} else {
			return new ResponseEntity<UserDTO>(HttpStatus.NOT_ACCEPTABLE);
		}
	}
	@PostMapping(path = "/updateInspector", consumes = "multipart/form-data")
	public ResponseEntity<UserDTO> UpdateAvatarInspector(String id, MultipartFile avatar, String fullname, String email,
			String phoneNumber, String address) {
		User user = userService.findByIdAndRole(id, "inspector");
		if (user != null) {
			if (avatar !=null) {
				String url = cloudinaryService.uploadFile(avatar);
				user.setAvatar(url);
			}
			user.setUser_Name(fullname);
			user.setEmail(email);
			user.setPhone_Number(phoneNumber);
			user.setAddress(address);
			userService.saveUser(user);
			if(user.getPassword()!=null)
				user.setPassword(new String(Base64.getDecoder().decode(user.getPassword())));
			UserDTO userDTO = modelMapper.map(user,UserDTO.class);
			return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
		} else {
			return new ResponseEntity<UserDTO>(HttpStatus.NOT_ACCEPTABLE);
		}
	}
	
	@PostMapping(path = "/updateadmin", consumes = "multipart/form-data")
	public ResponseEntity<UserDTO> UpdateAvatarAdmin(String id, MultipartFile avatar, String fullname, String email,
			String phoneNumber, String address) {
		User user = userService.findByIdAndRole(id, "admin");
		if (user != null) {
			if (avatar !=null) {
				String url = cloudinaryService.uploadFile(avatar);
				user.setAvatar(url);
			}
			user.setUser_Name(fullname);
			user.setEmail(email);
			user.setPhone_Number(phoneNumber);
			user.setAddress(address);
			userService.saveUser(user);
			if(user.getPassword()!=null)
				user.setPassword(new String(Base64.getDecoder().decode(user.getPassword())));
			UserDTO userDTO = modelMapper.map(user,UserDTO.class);
			return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
		} else {
			return new ResponseEntity<UserDTO>(HttpStatus.NOT_ACCEPTABLE);
		}
	}
}
