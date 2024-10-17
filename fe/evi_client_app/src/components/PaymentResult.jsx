// PaymentResult.js
import { useEffect, useState } from "react";

const PaymentResult = () => {
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentDetails = {
      vnp_Amount: urlParams.get("vnp_Amount"),
      vnp_BankCode: urlParams.get("vnp_BankCode"),
      vnp_CardType: urlParams.get("vnp_CardType"),
      vnp_OrderInfo: urlParams.get("vnp_OrderInfo"),
      vnp_PayDate: urlParams.get("vnp_PayDate"),
      vnp_ResponseCode: urlParams.get("vnp_ResponseCode"),
      vnp_SecureHash: urlParams.get("vnp_SecureHash"),
      vnp_TmnCode: urlParams.get("vnp_TmnCode"),
      vnp_TransactionNo: urlParams.get("vnp_TransactionNo"),
      vnp_TransactionStatus: urlParams.get("vnp_TransactionStatus"),
      vnp_TxnRef: urlParams.get("vnp_TxnRef"),
    };
    setPaymentInfo(paymentDetails);
  }, []);

  return (
    <div>
      <h1>Payment Result</h1>
      <ul>
        <li>
          <strong>Amount:</strong> {paymentInfo.vnp_Amount}
        </li>
        <li>
          <strong>Bank Code:</strong> {paymentInfo.vnp_BankCode}
        </li>
        <li>
          <strong>Card Type:</strong> {paymentInfo.vnp_CardType}
        </li>
        <li>
          <strong>Order Info:</strong> {paymentInfo.vnp_OrderInfo}
        </li>
        <li>
          <strong>Pay Date:</strong> {paymentInfo.vnp_PayDate}
        </li>
        <li>
          <strong>Response Code:</strong> {paymentInfo.vnp_ResponseCode}
        </li>
        <li>
          <strong>Secure Hash:</strong> {paymentInfo.vnp_SecureHash}
        </li>
        <li>
          <strong>Terminal Code:</strong> {paymentInfo.vnp_TmnCode}
        </li>
        <li>
          <strong>Transaction No:</strong> {paymentInfo.vnp_TransactionNo}
        </li>
        <li>
          <strong>Transaction Status:</strong>{" "}
          {paymentInfo.vnp_TransactionStatus}
        </li>
        <li>
          <strong>Transaction Ref:</strong> {paymentInfo.vnp_TxnRef}
        </li>
      </ul>
    </div>
  );
};

export default PaymentResult;
