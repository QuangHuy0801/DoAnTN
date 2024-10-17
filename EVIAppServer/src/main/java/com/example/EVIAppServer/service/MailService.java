package com.example.EVIAppServer.service;

import com.example.EVIAppServer.model.Mail;

import jakarta.mail.MessagingException;

public interface MailService 
{
	 public void sendEmail(Mail mail) throws MessagingException;
}
