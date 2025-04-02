const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line at the top

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
// Basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files - be specific about directory
app.use(express.static('public')); // Use a dedicated static directory

// Add routes one by one, starting with just a test route
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'API is online' });
});




// Define API routes BEFORE static file serving
app.post('/api/send-email', async (req, res) => {
    console.log('Received email request:', req.body);
    
    const { email, receiptNumber, orderDetails, totalAmount } = req.body;
    
    if (!email) {
        console.error('Error: No email provided in request body');
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Create HTML for order items
    let orderItemsHtml = '';
    if (orderDetails && Array.isArray(orderDetails)) {
        orderItemsHtml = '<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">' +
            '<tr style="background-color: #f2f2f2;">' +
            '<th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item</th>' +
            '<th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Quantity</th>' +
            '<th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Price</th>' +
            '<th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total</th>' +
            '</tr>';
        
        orderDetails.forEach(item => {
            orderItemsHtml += `<tr>
                <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.price}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">₹${item.totalPrice}</td>
            </tr>`;
        });
        
        orderItemsHtml += '</table>';
    }
    
    // Calculate tax and grand total
    const subTotal = parseFloat(totalAmount);
    const tax = (subTotal * 0.05).toFixed(2); // 5% GST
    const grandTotal = (subTotal + parseFloat(tax)).toFixed(2);

    // Create email HTML template
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
            }
            .footer {
                background-color: #f2f2f2;
                padding: 10px 20px;
                text-align: center;
                font-size: 0.8em;
                color: #666;
            }
            .content {
                padding: 20px;
                background-color: #ffffff;
            }
            .receipt-number {
                font-weight: bold;
                color: #4CAF50;
            }
            .total-row {
                font-weight: bold;
                background-color: #f9f9f9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <p>Dear Customer,</p>
                <p>Thank you for your order with Online Canteen. Your order has been received and is being processed.</p>
                
                <h2>Order Details</h2>
                <p>Receipt Number: <span class="receipt-number">${receiptNumber}</span></p>
                <p>Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
                   ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                
                <h3>Items Ordered</h3>
                ${orderItemsHtml}
                
                <div style="margin-top: 20px; text-align: right;">
                    <p><strong>Subtotal:</strong> ₹${subTotal.toFixed(2)}</p>
                    <p><strong>GST (5%):</strong> ₹${tax}</p>
                    <p style="font-size: 1.2em; color: #4CAF50;"><strong>Total:</strong> ₹${grandTotal}</p>
                </div>
                
                <p>If you have any questions about your order, please contact our customer service at <a href="tel:+918304926017">+91 83049 26017</a> or reply to this email.</p>
                
                <p>We look forward to serving you again soon!</p>
                
                <p>Best regards,<br>Online Canteen Team</p>
            </div>
            <div class="footer">
                <p>Online Canteen | 123 Street, Kerala, India | Tel: +91 83049 26017</p>
                <p>© 2025 Online Canteen. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_FROM || 'adarshsanthosh238@gmail.com', // Set your verified sender in SendGrid
        subject: `Order Confirmation - ${receiptNumber}`,
        text: `Thank you for your order with Online Canteen. Your order (${receiptNumber}) has been received and is being processed. The total amount is ₹${grandTotal}.`,
        html: emailHtml
    };

    try {
        if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
            console.error('SendGrid API Key is missing or invalid. Cannot send email.');
            return res.status(500).json({ success: false, message: 'Server configuration error: Invalid API key' });
        }

        await sgMail.send(mailOptions);
        console.log('Email sent successfully to:', email);
        res.status(200).json({ success: true, message: 'Order confirmation email sent' });
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).json({ success: false, message: 'Error sending confirmation email' });
    }
});

app.get('/api/test-email', async (req, res) => {
    const testEmail = req.query.email || 'adarshsanthosh238@gmail.com';
    console.log('Test email request received for:', testEmail);

    // Check if API key is valid
    if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith('SG.')) {
        console.error('SendGrid API Key is missing or invalid. Cannot send test email.');
        return res.status(500).json({ 
            success: false, 
            message: 'Server configuration error: Invalid API key',
            details: 'The SendGrid API Key is not properly configured. It should start with "SG."'
        });
    }

    const mailOptions = {
        to: testEmail,
        from: process.env.EMAIL_FROM || 'adarshsanthosh238@gmail.com', // Use verified sender
        subject: 'Online Canteen - Test Email',
        text: 'This is a test email from your Online Canteen server.',
        html: '<h1>Test Email</h1><p>This is a test email from your Online Canteen server.</p>'
    };

    try {
        await sgMail.send(mailOptions);
        console.log('Test email sent successfully to:', testEmail);
        res.status(200).json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error.response ? error.response.body : error);
        res.status(500).json({ 
            success: false, 
            message: 'Error sending test email', 
            error: error.message,
            details: error.response ? JSON.stringify(error.response.body) : 'No additional details'
        });
    }
});

// Static file serving AFTER API routes
app.use('/static', express.static(path.join(__dirname, '../public')));


// For any other routes, serve the main HTML file (if you're using a single-page application)
app.get('*', (req, res) => {
    // Using a direct, safe, absolute path to avoid path-to-regexp issues
    const htmlPath = path.resolve(__dirname, '../order.html');
    res.sendFile(htmlPath);
});

// Start the server
