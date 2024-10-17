package com.example.EVIAppServer.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.EVIAppServer.model.Mail;
import com.example.EVIAppServer.service.MailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public void sendEmail(Mail mail) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

        mimeMessageHelper.setSubject(mail.getMailSubject());
        mimeMessageHelper.setFrom(new InternetAddress(mail.getMailFrom()));
        mimeMessageHelper.setTo(mail.getMailTo());
        mimeMessageHelper.setText(mail.getMailContent());

        // Thêm tệp đính kèm
        if (mail.getAttachments() != null) {
            for (Map.Entry<String, byte[]> entry : mail.getAttachments().entrySet()) {
                mimeMessageHelper.addAttachment(entry.getKey(), new ByteArrayResource(entry.getValue()));
            }
        }

        javaMailSender.send(mimeMessageHelper.getMimeMessage());
    }
}

