package com.example.EVIAppServer.service;

import jakarta.servlet.http.HttpServletRequest;

public interface VNPayService {
	public String createOrder(int total, String orderInfor, String urlReturn,String vnp_TxnRef);
	 int orderReturn(HttpServletRequest request);
}
