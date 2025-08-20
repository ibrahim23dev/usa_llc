import { DateFormatterDayjsOop } from "../../utils/DateAllUtlsFuntion";

export class WalletTemplate {
  constructor() {
    //
  }

  approvedDeposit(data: {
    email: string;
    tnx: string;
    date: string | Date;
    paymentMethod: string;
    amount: string | number;
    account: string | number;
  }) {
    const dataFormate = new DateFormatterDayjsOop(data.date);
    return {
      receiver_email: data.email,
      title: "Account Application Approved",
      subject: "Account Application Approved ",
      body_text: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit Approved</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background-color: #2ecc71;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
        }
        
        .success-icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            color: #2ecc71;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
        }
        
        .deposit-details {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #2ecc71;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            color: #666;
            font-weight: 500;
        }
        
        .detail-value {
            font-weight: 600;
            color: #333;
        }
        
        .next-steps {
            background-color: #e8f8f0;
            border-left: 4px solid #2ecc71;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 30px;
        }
        
        .next-steps h3 {
            color: #2ecc71;
            margin-bottom: 10px;
        }
        
        .next-steps p {
            color: #555;
            line-height: 1.5;
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 12px;
            border-radius: 5px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: #2ecc71;
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            background-color: #27ae60;
        }
        
        .btn-secondary {
            background-color: white;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
            background-color: #f5f5f5;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
            font-size: 14px;
        }
        
        .footer a {
            color: #2ecc71;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }
            
            .buttons {
                flex-direction: column;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .amount {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
            </div>
            <h1>Deposit Approved</h1>
            <p class="subtitle">Your funds have been successfully credited to your account</p>
        </div>
        
        <div class="deposit-details">
            <div class="amount">$1,250.00</div>
            
            <div class="detail-row">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value">${data.tnx}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${dataFormate.format("MMM D, YYYY - hh:mm A")}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">${data.paymentMethod}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Account</span>
                <span class="detail-value">${data.account}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #2ecc71; font-weight: bold;">Approved</span>
            </div>
        </div>
        
        <div class="next-steps">
            <h3>What's Next?</h3>
            <p>Your funds are now available in your account and ready to use. You can start trading, investing, or withdraw these funds at any time.</p>
        </div>
        
        <div class="buttons">
            <a href="#" class="btn btn-primary">View Account</a>
            <a href="#" class="btn btn-secondary">Make Another Deposit</a>
        </div>
        
        <div class="footer">
            <p>If you have any questions, please contact our <a href="#">support team</a>.</p>
            <p style="margin-top: 10px;">© 2025 Financial Services Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      
      `,
    };
  }
  rejectDeposit(data: {
    email: string;
    tnx: string;
    date: string | Date;
    paymentMethod: string;
    amount: string | number;
    account: string;
  }) {
    const dataFormate = new DateFormatterDayjsOop(data.date);

    return {
      receiver_email: data.email,
      title: "Account Application Rejected",
      subject: "Account Application Rejected ",
      body_text: `

      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit Rejected</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .reject-icon {
            width: 80px;
            height: 80px;
            background-color: #e74c3c;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
        }
        
        .reject-icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        
        h1 {
            color: #e74c3c;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
        }
        
        .deposit-details {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            color: #666;
            font-weight: 500;
        }
        
        .detail-value {
            font-weight: 600;
            color: #333;
        }
        
        .rejection-reason {
            background-color: #fdf0ed;
            border-left: 4px solid #e74c3c;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 30px;
        }
        
        .rejection-reason h3 {
            color: #e74c3c;
            margin-bottom: 10px;
        }
        
        .rejection-reason p {
            color: #555;
            line-height: 1.5;
        }
        
        .next-steps {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 30px;
        }
        
        .next-steps h3 {
            color: #3498db;
            margin-bottom: 10px;
        }
        
        .next-steps ul {
            padding-left: 20px;
            margin-top: 10px;
        }
        
        .next-steps li {
            margin-bottom: 8px;
            color: #555;
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn {
            flex: 1;
            padding: 12px;
            border-radius: 5px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: #3498db;
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            background-color: #2980b9;
        }
        
        .btn-secondary {
            background-color: white;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
            background-color: #f5f5f5;
        }
        
        .support-section {
            margin-top: 30px;
            text-align: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .support-section h3 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .support-section p {
            color: #555;
            margin-bottom: 5px;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
            font-size: 14px;
        }
        
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }
            
            .buttons {
                flex-direction: column;
            }
            
            h1 {
                font-size: 24px;
            }
            
            .amount {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="reject-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </div>
            <h1>Deposit Rejected</h1>
            <p class="subtitle">We were unable to process your deposit request</p>
        </div>
        
        <div class="deposit-details">
            <div class="amount">${data.amount}</div>
            
            <div class="detail-row">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value">TXN-${data.tnx}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${dataFormate.format("MMM D, YYYY - hh:mm A")}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">${data.paymentMethod}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Account</span>
                <span class="detail-value">**** **** **** ${data.account.slice(-4)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #e74c3c; font-weight: bold;">Rejected</span>
            </div>
        </div>
        
        <div class="rejection-reason">
            <h3>Reason for Rejection</h3>
            <p>Your deposit request was rejected due to insufficient funds in your bank account. The bank was unable to process the transaction.</p>
        </div>
        
        <div class="next-steps">
            <h3>What to Do Next</h3>
            <ul>
                <li>Ensure you have sufficient funds in your bank account</li>
                <li>Verify your bank account details are correct</li>
                <li>Check if there are any restrictions on your bank account</li>
                <li>Try a different payment method</li>
            </ul>
        </div>
        
        <div class="buttons">
            <a href="#" class="btn btn-primary">Try Again</a>
            <a href="#" class="btn btn-secondary">Contact Support</a>
        </div>
        
        <div class="support-section">
            <h3>Need Help?</h3>
            <p>Our support team is available 24/7 to assist you</p>
            <p>Email: <strong>support@example.com</strong></p>
            <p>Phone: <strong>+1 (800) 123-4567</strong></p>
        </div>
        
        <div class="footer">
            <p>© 2025 Financial Services Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      
      `,
    };
  }
  transitionNotification(data: {
    email: string;
    tnx: string;
    date?: string | Date;
    currentBalance: string;
    amount: string | number;
  }) {
    const dataFormate = new DateFormatterDayjsOop(data?.date || new Date());

    return {
      receiver_email: data.email,
      title: "Spending Alert",
      subject: "Spending Alert ",
      body_text: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spending Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333333;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 25px 20px;
            line-height: 1.5;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            text-align: center;
            margin: 15px 0;
        }
        .details {
            background-color: #f5f5f5;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Spending Alert</h1>
        </div>
        
        <div class="content">
        
            
            <p>We're letting you know that a transaction was just made on your account:</p>
            
            <div class="amount">${data.amount}</div>
            
            <div class="details">
        
                <p><strong>Date:</strong> ${dataFormate.format("MMM D, YYYY - hh:mm A")}</p><p><strong>Transaction ID:</strong> ${data.tnx}</p>
          
            </div>
            
            <p>Your current balance is <strong>${data.currentBalance}</strong>.</p>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="{{account_url}}" class="button">View Your Account</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #777777;">
                If you didn't make this purchase, please contact us immediately.
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated message from {{company_name}}.</p>
            <p>&copy; {{year}} {{company_name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      
      `,
    };
  }
}
