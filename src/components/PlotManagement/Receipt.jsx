export const handleShowReceipt = (bookingData) => {
    try {
        // Validate booking data
        if (!bookingData || typeof bookingData !== 'object') {
            console.error('Invalid booking data:', bookingData);
            return;
        }

        // Create a new window for the receipt
        const receiptWindow = window.open('', '_blank', 'width=800,height=1200,scrollbars=yes');

        if (!receiptWindow) {
            console.error('Failed to open receipt window');
            return;
        }

        // Prepare the receipt HTML
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Plot Booking Receipts</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
                    body { 
                        font-family: 'Quicksand', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333;
                        background-color: #f5f5f5;
                    }
                    .receipt-container { 
                        max-width: 800px; 
                        margin: 0 auto 40px; 
                        padding: 30px; 
                        background: white;
                        border: 1px solid #e0e0e0; 
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        border-radius: 8px;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding-bottom: 20px; 
                        border-bottom: 2px solid #6B66FF; 
                    }
                    .company-name { 
                        font-size: 28px; 
                        font-weight: 700; 
                        color: #6B66FF; 
                        margin-bottom: 10px; 
                    }
                    .company-address { 
                        font-size: 14px; 
                        color: #666; 
                        margin-bottom: 5px; 
                    }
                    .receipt-title { 
                        font-size: 22px; 
                        font-weight: 600; 
                        margin: 30px 0; 
                        text-align: center; 
                        color: #333;
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .section { 
                        margin-bottom: 25px; 
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .section-title { 
                        font-size: 18px; 
                        font-weight: 600; 
                        color: #6B66FF; 
                        margin-bottom: 15px; 
                        border-bottom: 1px solid #e0e0e0; 
                        padding-bottom: 8px; 
                    }
                    .details-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 20px; 
                    }
                    .detail-item { 
                        margin-bottom: 12px; 
                    }
                    .detail-label { 
                        font-weight: 600; 
                        color: #666; 
                        margin-bottom: 5px; 
                        font-size: 14px;
                    }
                    .detail-value { 
                        color: #333; 
                        font-size: 15px;
                    }
                    .payment-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                    }
                    .payment-table th, .payment-table td { 
                        border: 1px solid #e0e0e0; 
                        padding: 12px; 
                        text-align: left; 
                    }
                    .payment-table th { 
                        background-color: #f5f5f5; 
                        font-weight: 600;
                        color: #6B66FF;
                    }
                    .total-row { 
                        font-weight: 600; 
                        background-color: #f9f9f9; 
                    }
                    .highlight { 
                        color: #6B66FF; 
                        font-weight: 600; 
                    }
                    .print-buttons {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .print-button {
                        padding: 10px 20px;
                        background: #6B66FF;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 0 10px;
                        font-family: 'Quicksand', sans-serif;
                        font-weight: 600;
                    }
                    .print-button:hover {
                        background: #5652e5;
                    }
                    @media print { 
                        body { padding: 0; } 
                        .receipt-container { box-shadow: none; border: none; } 
                        .no-print { display: none; } 
                    }
                </style>
            </head>
            <body>
                <!-- Customer Receipt -->
                <div class="receipt-container">
                    <div class="header">
                        <div class="company-name">KM Builders</div>
                        <div class="company-address">123 Business Street, City, State - 123456</div>
                        <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                    </div>

                    <div class="receipt-title">PLOT BOOKING RECEIPT - CUSTOMER COPY</div>

                    <div class="section">
                        <div class="section-title">Plot Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Project</div>
                                <div class="detail-value">${bookingData.projectName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Block</div>
                                <div class="detail-value">${bookingData.blockName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Number</div>
                                <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Area</div>
                                <div class="detail-value">${bookingData.ploatArea || 0} sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Rate</div>
                                <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Booking Code</div>
                                <div class="detail-value highlight">${bookingData.bookingCode || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Client Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${bookingData.clientName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Type</div>
                                <div class="detail-value">${bookingData.clientType || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Email</div>
                                <div class="detail-value">${bookingData.email || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Mobile</div>
                                <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Address</div>
                                <div class="detail-value">${bookingData.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Details</div>
                        <table class="payment-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Plot Cost (${bookingData.ploatArea || 0} sq.ft × ₹${bookingData.plotRate || 0})</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Development Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>PLC Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Other Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Coupon Discount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Total Plot Cost</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Booking Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Due Amount</td>
                                    <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Mode Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Payment Mode</div>
                                <div class="detail-value">${bookingData.payMode || 'Cash'}</div>
                            </div>
                            ${bookingData.payMode === 'Cheque' ? `
                                <div class="detail-item">
                                    <div class="detail-label">Bank Name</div>
                                    <div class="detail-value">${bookingData.bankName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Number</div>
                                    <div class="detail-value">${bookingData.checqueNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Date</div>
                                    <div class="detail-value">${bookingData.checqueDate || 'N/A'}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Company Receipt -->
                <div class="receipt-container">
                    <div class="header">
                        <div class="company-name">KM Builders</div>
                        <div class="company-address">123 Business Street, City, State - 123456</div>
                        <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                    </div>

                    <div class="receipt-title">PLOT BOOKING RECEIPT - COMPANY COPY</div>

                    <!-- Same content as customer receipt -->
                    <div class="section">
                        <div class="section-title">Plot Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Project</div>
                                <div class="detail-value">${bookingData.projectName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Block</div>
                                <div class="detail-value">${bookingData.blockName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Number</div>
                                <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Area</div>
                                <div class="detail-value">${bookingData.ploatArea || 0} sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Rate</div>
                                <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Booking Code</div>
                                <div class="detail-value highlight">${bookingData.bookingCode || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Client Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${bookingData.clientName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Type</div>
                                <div class="detail-value">${bookingData.clientType || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Email</div>
                                <div class="detail-value">${bookingData.email || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Mobile</div>
                                <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Address</div>
                                <div class="detail-value">${bookingData.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Details</div>
                        <table class="payment-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Plot Cost (${bookingData.ploatArea || 0} sq.ft × ₹${bookingData.plotRate || 0})</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Development Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>PLC Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Other Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Coupon Discount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Total Plot Cost</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Booking Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Due Amount</td>
                                    <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Mode Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Payment Mode</div>
                                <div class="detail-value">${bookingData.payMode || 'Cash'}</div>
                            </div>
                            ${bookingData.payMode === 'Cheque' ? `
                                <div class="detail-item">
                                    <div class="detail-label">Bank Name</div>
                                    <div class="detail-value">${bookingData.bankName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Number</div>
                                    <div class="detail-value">${bookingData.checqueNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Date</div>
                                    <div class="detail-value">${bookingData.checqueDate || 'N/A'}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="print-buttons no-print">
                    <button class="print-button" onclick="window.print()">Print Receipts</button>
                    <button class="print-button" onclick="window.close()" style="background: #f44336;">Close</button>
                </div>
            </body>
            </html>
        `;

        // Write the HTML to the new window
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
        receiptWindow.focus();
    } catch (error) {
        console.error('Error generating receipt:', error);
        // Show error message to user
        alert('Failed to generate receipt. Please try again.');
    }
};




export const generatePlotBookingReceipts = (bookingData) => {
    // Open a single window for both receipts
    const receiptWindow = window.open('', '_blank', 'width=800,height=1200,scrollbars=yes');
    if (receiptWindow) {
        receiptWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Plot Booking Receipts</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
                    body { 
                        font-family: 'Quicksand', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333;
                        background-color: #f5f5f5;
                    }
                    .receipt-container { 
                        max-width: 800px; 
                        margin: 0 auto 40px; 
                        padding: 30px; 
                        background: white;
                        border: 1px solid #e0e0e0; 
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        border-radius: 8px;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding-bottom: 20px; 
                        border-bottom: 2px solid #6B66FF; 
                    }
                    .company-name { 
                        font-size: 28px; 
                        font-weight: 700; 
                        color: #6B66FF; 
                        margin-bottom: 10px; 
                    }
                    .company-address { 
                        font-size: 14px; 
                        color: #666; 
                        margin-bottom: 5px; 
                    }
                    .receipt-title { 
                        font-size: 22px; 
                        font-weight: 600; 
                        margin: 30px 0; 
                        text-align: center; 
                        color: #333;
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .payment-plan {
                        text-align: center;
                        font-size: 18px;
                        font-weight: 600;
                        color: #6B66FF;
                        margin: 20px 0;
                        padding: 10px;
                        background: #f0f0ff;
                        border-radius: 5px;
                    }
                    .section { 
                        margin-bottom: 25px; 
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .section-title { 
                        font-size: 18px; 
                        font-weight: 600; 
                        color: #6B66FF; 
                        margin-bottom: 15px; 
                        border-bottom: 1px solid #e0e0e0; 
                        padding-bottom: 8px; 
                    }
                    .details-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 20px; 
                    }
                    .detail-item { 
                        margin-bottom: 12px; 
                    }
                    .detail-label { 
                        font-weight: 600; 
                        color: #666; 
                        margin-bottom: 5px; 
                        font-size: 14px;
                    }
                    .detail-value { 
                        color: #333; 
                        font-size: 15px;
                    }
                    .payment-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                    }
                    .payment-table th, .payment-table td { 
                        border: 1px solid #e0e0e0; 
                        padding: 12px; 
                        text-align: left; 
                    }
                    .payment-table th { 
                        background-color: #f5f5f5; 
                        font-weight: 600;
                        color: #6B66FF;
                    }
                    .total-row { 
                        font-weight: 600; 
                        background-color: #f9f9f9; 
                    }
                    .terms { 
                        margin-top: 30px; 
                        font-size: 13px; 
                        color: #666;
                        line-height: 1.6;
                    }
                    .signature-section { 
                        margin-top: 50px; 
                        display: flex; 
                        justify-content: space-between; 
                    }
                    .signature-box { 
                        text-align: center; 
                        width: 200px; 
                    }
                    .signature-line { 
                        border-top: 1px solid #333; 
                        margin-top: 50px; 
                        width: 100%; 
                    }
                    .footer { 
                        margin-top: 30px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #666; 
                        border-top: 1px solid #e0e0e0; 
                        padding-top: 10px; 
                    }
                    .highlight { 
                        color: #6B66FF; 
                        font-weight: 600; 
                    }
                    .print-buttons {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .print-button {
                        padding: 10px 20px;
                        background: #6B66FF;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 0 10px;
                        font-family: 'Quicksand', sans-serif;
                        font-weight: 600;
                    }
                    .print-button:hover {
                        background: #5652e5;
                    }
                    @media print { 
                        body { padding: 0; } 
                        .receipt-container { box-shadow: none; border: none; } 
                        .no-print { display: none; } 
                    }
                </style>
            </head>
            <body>
                <!-- Customer Receipt -->
                <div class="receipt-container">
                    <div class="header">
                        <div class="company-name">Venture Consultancy Services</div>
                        <div class="company-address">123 Business Street, City, State - 123456</div>
                        <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                    </div>

                    <div class="receipt-title">PLOT BOOKING RECEIPT - CUSTOMER COPY</div>
                    <div class="payment-plan">Payment Plan: ${bookingData.planType || 'N/A'}</div>

                    <div class="section">
                        <div class="section-title">Plot Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Project</div>
                                <div class="detail-value">${projects.find(p => p.projectId === bookingData.projectId)?.siteName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Block</div>
                                <div class="detail-value">${blocks.find(b => b.blockId === bookingData.blockID)?.block || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Number</div>
                                <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Area</div>
                                <div class="detail-value">${bookingData.ploatArea || 'N/A'} sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Rate</div>
                                <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Booking Code</div>
                                <div class="detail-value highlight">${bookingData.bookingCode}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Contact Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${bookingData.buyerCustomerName || bookingData.buyerAssociatName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Contact Type</div>
                                <div class="detail-value">${tabValue === 0 ? 'Customer' : 'Associate'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Phone</div>
                                <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Email</div>
                                <div class="detail-value">${bookingData.emailId || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Address</div>
                                <div class="detail-value">${bookingData.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Details</div>
                        <table class="payment-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Plot Cost (${bookingData.ploatArea} sq.ft × ₹${bookingData.plotRate})</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Development Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>PLC Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Other Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Coupon Discount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Total Plot Cost</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Booking Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Due Amount</td>
                                    <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Mode Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Payment Mode</div>
                                <div class="detail-value">${bookingData.payMode || 'Cash'}</div>
                            </div>
                            ${bookingData.payMode === 'Cheque' ? `
                                <div class="detail-item">
                                    <div class="detail-label">Bank Name</div>
                                    <div class="detail-value">${bookingData.bankName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Account Number</div>
                                    <div class="detail-value">${bookingData.accountNumber || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Number</div>
                                    <div class="detail-value">${bookingData.checqueNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Date</div>
                                    <div class="detail-value">${bookingData.checqueDate || 'N/A'}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Terms & Conditions</div>
                        <div class="terms">
                            <ol>
                                <li>This receipt confirms the booking of the plot mentioned above.</li>
                                <li>The booking amount is non-refundable.</li>
                                <li>The remaining amount must be paid as per the agreed payment schedule.</li>
                                <li>All payments must be made through official payment channels only.</li>
                                <li>In case of any dispute, the company's decision will be final.</li>
                                <li>The plot will be transferred only after the complete payment is received.</li>
                                <li>Any changes in the payment schedule must be approved by the company in writing.</li>
                                <li>The customer/associate is responsible for all applicable taxes and charges.</li>
                            </ol>
                        </div>
                    </div>

                    <div class="signature-section">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div>Customer/Associate Signature</div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div>Authorized Signatory</div>
                        </div>
                    </div>

                    <div class="footer">
                        <div>This is a computer-generated receipt and does not require a signature.</div>
                        <div>Generated on: ${new Date().toLocaleString()}</div>
                    </div>
                </div>

                <!-- Company Receipt -->
                <div class="receipt-container">
                    <div class="header">
                        <div class="company-name">Venture Consultancy Services</div>
                        <div class="company-address">123 Business Street, City, State - 123456</div>
                        <div class="company-address">Phone: +91 1234567890 | Email: info@kmbuilders.com</div>
                    </div>

                    <div class="receipt-title">PLOT BOOKING RECEIPT - COMPANY COPY</div>
                    <div class="payment-plan">Payment Plan: ${bookingData.planType || 'N/A'}</div>

                    <div class="section">
                        <div class="section-title">Plot Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Project</div>
                                <div class="detail-value">${projects.find(p => p.projectId === bookingData.projectId)?.siteName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Block</div>
                                <div class="detail-value">${blocks.find(b => b.blockId === bookingData.blockID)?.block || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Number</div>
                                <div class="detail-value">${bookingData.plotNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Area</div>
                                <div class="detail-value">${bookingData.ploatArea || 'N/A'} sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Plot Rate</div>
                                <div class="detail-value">₹${new Intl.NumberFormat('en-IN').format(bookingData.plotRate || 0)} per sq.ft</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Booking Code</div>
                                <div class="detail-value highlight">${bookingData.bookingCode}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Contact Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Name</div>
                                <div class="detail-value">${bookingData.buyerCustomerName || bookingData.buyerAssociatName || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Contact Type</div>
                                <div class="detail-value">${tabValue === 0 ? 'Customer' : 'Associate'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Phone</div>
                                <div class="detail-value">${bookingData.mobileNo || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Email</div>
                                <div class="detail-value">${bookingData.emailId || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Address</div>
                                <div class="detail-value">${bookingData.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Details</div>
                        <table class="payment-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Plot Cost (${bookingData.ploatArea} sq.ft × ₹${bookingData.plotRate})</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.poatCoast || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Development Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.developmentAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>PLC Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.plcAmount || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Other Charges</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.otherCharges || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Coupon Discount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.couponDiscount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Total Plot Cost</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.totalPlotCost || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Booking Amount</td>
                                    <td>${new Intl.NumberFormat('en-IN').format(bookingData.bookingAmount || 0)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Due Amount</td>
                                    <td class="highlight">${new Intl.NumberFormat('en-IN').format(bookingData.dueAmount || 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="section-title">Payment Mode Details</div>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Payment Mode</div>
                                <div class="detail-value">${bookingData.payMode || 'Cash'}</div>
                            </div>
                            ${bookingData.payMode === 'Cheque' ? `
                                <div class="detail-item">
                                    <div class="detail-label">Bank Name</div>
                                    <div class="detail-value">${bookingData.bankName || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Account Number</div>
                                    <div class="detail-value">${bookingData.accountNumber || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Number</div>
                                    <div class="detail-value">${bookingData.checqueNo || 'N/A'}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Cheque Date</div>
                                    <div class="detail-value">${bookingData.checqueDate || 'N/A'}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Terms & Conditions</div>
                        <div class="terms">
                            <ol>
                                <li>This receipt confirms the booking of the plot mentioned above.</li>
                                <li>The booking amount is non-refundable.</li>
                                <li>The remaining amount must be paid as per the agreed payment schedule.</li>
                                <li>All payments must be made through official payment channels only.</li>
                                <li>In case of any dispute, the company's decision will be final.</li>
                                <li>The plot will be transferred only after the complete payment is received.</li>
                                <li>Any changes in the payment schedule must be approved by the company in writing.</li>
                                <li>The customer/associate is responsible for all applicable taxes and charges.</li>
                            </ol>
                        </div>
                    </div>

                    <div class="signature-section">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div>Customer/Associate Signature</div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div>Authorized Signatory</div>
                        </div>
                    </div>

                    <div class="footer">
                        <div>This is a computer-generated receipt and does not require a signature.</div>
                        <div>Generated on: ${new Date().toLocaleString()}</div>
                    </div>
                </div>

                <div class="print-buttons no-print">
                    <button class="print-button" onclick="window.print()">Print Receipts</button>
                    <button class="print-button" onclick="window.close()" style="background: #f44336;">Close</button>
                </div>
            </body>
            </html>
        `);
        receiptWindow.document.close();
        receiptWindow.focus();
    }
};