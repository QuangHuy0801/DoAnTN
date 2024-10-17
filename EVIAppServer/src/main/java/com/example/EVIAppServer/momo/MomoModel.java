package com.example.EVIAppServer.momo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MomoModel {
 public String partnerCode;
 public String orderId ;
 public String storeId ;
 public String redirectUrl ;
 public String ipnUrl ;
 public String requestId ;
 public String requestType ;
 public String amount;
 public String partnerUserId;
 public String orderType;
 public String transId;
 public String resultCode;
 public String message;
 public String payType;
 public String responseTime; 
 public String orderInfo;
 public String extraData;
 public String  signature;
 
public MomoModel() {
	super();
}

public MomoModel(String partnerCode, String orderId, String storeId, String redirectUrl, String ipnUrl,
		String requestId, String requestType, String amount, String partnerUserId, String orderType, String transId,
		String resultCode, String message, String payType, String responseTime, String orderInfo, String extraData,
		String signature) {
	super();
	this.partnerCode = partnerCode;
	this.orderId = orderId;
	this.storeId = storeId;
	this.redirectUrl = redirectUrl;
	this.ipnUrl = ipnUrl;
	this.requestId = requestId;
	this.requestType = requestType;
	this.amount = amount;
	this.partnerUserId = partnerUserId;
	this.orderType = orderType;
	this.transId = transId;
	this.resultCode = resultCode;
	this.message = message;
	this.payType = payType;
	this.responseTime = responseTime;
	this.orderInfo = orderInfo;
	this.extraData = extraData;
	this.signature = signature;
}
}
