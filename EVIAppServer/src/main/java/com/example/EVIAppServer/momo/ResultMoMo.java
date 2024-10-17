package com.example.EVIAppServer.momo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultMoMo {
	public String t;
	public String partnerCode;
	public String requestId;
	public String deeplink;
	public String deeplinkMiniApp;
	public String orderId;
	public String amount;
	public String responseTime;
	public String message;
	public String resultCode;
	public String payUrl;
	public String qrCodeUrl;

	public ResultMoMo() {
		super();
	}

	public ResultMoMo(String t, String deeplink, String deeplinkMiniApp, String partnerCode, String orderId,
			String requestId, String amount, String responseTime, String message, String resultCode, String payUrl,String qrCodeUrl) {
		super();
		this.t = t;
		this.deeplink = deeplink;
		this.deeplinkMiniApp = deeplinkMiniApp;
		this.partnerCode = partnerCode;
		this.orderId = orderId;
		this.requestId = requestId;
		this.amount = amount;
		this.responseTime = responseTime;
		this.message = message;
		this.resultCode = resultCode;
		this.payUrl = payUrl;
		this.qrCodeUrl = qrCodeUrl;
	}

	

}
