// Candy Cannon Email - Request Launch

// Initialize EmailJS
// NOTE: You need to update this with your EmailJS public key
// Get one at https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
const EMAILJS_SERVICE_ID = 'gmail';
const EMAILJS_TEMPLATE_ID = 'candy_cannon_request';

// Initialize EmailJS if public key is set
if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const candyNames = {
    'sour-punch-twists': 'Sour Punch Twists',
    'lemonheads': 'Lemonheads',
    'mexican-candy': 'Assorted Mexican Candy',
    'peppermint': 'Peppermint',
    'butterscotch': 'Butterscotch Disks',
    'skittles': 'Skittles Fun Size',
    'root-beer-barrels': 'Root Beer Barrels',
    'milky-way': 'Milky Way Miniatures',
    'jolly-rancher': 'Jolly Rancher',
    'm-and-m-peanut': 'M&Ms Fun Size Peanut',
    'snickers-mini': 'Snickers Mini Valentines',
    'crown-milk-truffle': 'Crown Milk Chocolate Truffles',
    'crown-dark-truffle': 'Crown Dark Chocolate Truffles',
    'twix': 'Twix',
    'starburst': 'Starburst',
    'gummy-sunkist': 'Fruit Gummy Sunkist',
    'riesen': 'Riesen',
    'werthers': 'Werthers Original Hard Caramels',
    'lindor-white': 'Lindor White Chocolate',
    'lindor-milk': 'Lindor Milk Chocolate',
    'lindor-dark': 'Lindor Dark Chocolate'
};

class LaunchRequest {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.renderCartSummary();
        this.setupFormListener();
    }

    loadCart() {
        const savedCart = localStorage.getItem('candyCannon-cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
    }

    renderCartSummary() {
        const summaryDiv = document.getElementById('cart-summary');
        
        if (this.cart.length === 0) {
            summaryDiv.innerHTML = `
                <div class="empty-cart-warning">
                    <p>Your cart is empty. Please add candies before requesting a launch.</p>
                    <a href="pricing.html" class="back-btn">Go Back to Pricing</a>
                </div>
            `;
            document.getElementById('launch-request-form').style.display = 'none';
            return;
        }

        let summaryHTML = `<div class="summary-header">Order Summary:</div>`;
        
        let total = 0;
        let totalBarrels = 0;
        const LAUNCH_COST = 75.00;

        this.cart.forEach(item => {
            const candyName = candyNames[item.candy] || item.candy;
            const itemTotal = parseFloat(item.total);
            const fillPercent = parseInt(item.fill);
            
            total += itemTotal;
            totalBarrels += (fillPercent / 100);

            summaryHTML += `
                <div class="summary-item">
                    <span>${candyName} (${item.fill}%)</span>
                    <span class="summary-value">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        summaryHTML += `
            <div class="summary-item">
                <span><strong>Candy Total:</strong></span>
                <span class="summary-value"><strong>$${total.toFixed(2)}</strong></span>
            </div>
            <div class="summary-item">
                <span><strong>Launch Fee:</strong></span>
                <span class="summary-value"><strong>$${LAUNCH_COST.toFixed(2)}</strong></span>
            </div>
            <div class="summary-item total">
                <span><strong>Total Cost:</strong></span>
                <span class="summary-value"><strong>$${(total + LAUNCH_COST).toFixed(2)}</strong></span>
            </div>
            <div class="summary-item">
                <span><strong>Total Barrels:</strong></span>
                <span class="summary-value"><strong>🛢️ ${totalBarrels.toFixed(2)}</strong></span>
            </div>
        `;

        summaryDiv.innerHTML = summaryHTML;
        this.cartSummary = {
            items: this.cart,
            candyTotal: total,
            launchFee: LAUNCH_COST,
            total: total + LAUNCH_COST,
            totalBarrels: totalBarrels
        };
    }

    setupFormListener() {
        const form = document.getElementById('launch-request-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Set minimum date to tomorrow
        const dateInput = document.getElementById('launch-date');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const minDate = tomorrow.toISOString().split('T')[0];
            dateInput.setAttribute('min', minDate);
        }

        // Set time input constraints (8 AM to 10 PM only)
        const timeInput = document.getElementById('launch-time');
        if (timeInput) {
            timeInput.setAttribute('min', '08:00');
            timeInput.setAttribute('max', '22:00');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const launchAddress = document.getElementById('launch-address').value;
        const launchDate = document.getElementById('launch-date').value;
        const launchTime = document.getElementById('launch-time').value;
        const contactEmail = document.getElementById('contact-email').value;
        const contactPhone = document.getElementById('contact-phone').value;
        const specialRequests = document.getElementById('special-requests').value || 'None';

        // Build email content
        const emailContent = this.buildEmailContent(
            launchAddress,
            launchDate,
            launchTime,
            contactEmail,
            contactPhone,
            specialRequests
        );

        this.sendEmail(emailContent, contactEmail);
    }

    buildEmailContent(address, date, time, email, phone, requests) {
        let itemsList = '';
        this.cartSummary.items.forEach(item => {
            const candyName = candyNames[item.candy] || item.candy;
            itemsList += `• ${candyName} (${item.fill}% barrel) - $${item.total}\n`;
        });

        const content = {
            to_email: 'justin.h.lott.jhl@gmail.com',
            customer_email: email,
            customer_phone: phone,
            launch_address: address,
            launch_date: this.formatDate(date),
            launch_time: this.formatTime(time),
            special_requests: requests,
            candy_items: itemsList,
            candy_total: this.cartSummary.candyTotal.toFixed(2),
            launch_fee: this.cartSummary.launchFee.toFixed(2),
            total_cost: this.cartSummary.total.toFixed(2),
            total_barrels: this.cartSummary.totalBarrels.toFixed(2)
        };

        return content;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    sendEmail(emailParams, senderEmail) {
        // Disable submit button
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Check if EmailJS is properly configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
            // Fallback: Use backend API or alternative method
            this.sendViaAPI(emailParams, senderEmail, submitBtn);
        } else {
            // Send via EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams)
                .then(response => {
                    console.log('Email sent successfully!', response);
                    this.showSuccessMessage();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Request to Sugar Breaker';
                })
                .catch(error => {
                    console.error('Failed to send email:', error);
                    this.showErrorMessage('Failed to send request. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Request to Sugar Breaker';
                });
        }
    }

    sendViaAPI(emailParams, senderEmail, submitBtn) {
        // This creates a mailto link as a fallback when EmailJS isn't configured
        const subject = 'Sugar Breaker Candy Cannon Launch Request';
        const body = this.buildEmailBody(emailParams);
        
        // Create mailto link and open it
        const mailtoLink = `mailto:justin.h.lott.jhl@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(senderEmail)}`;
        
        // Open the default email client
        window.location.href = mailtoLink;
        
        // Show success message
        setTimeout(() => {
            this.showSuccessMessage(true);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Request to Sugar Breaker';
        }, 500);
    }

    buildEmailBody(params) {
        return `
Launch Request Details:

CUSTOMER INFORMATION:
Email: ${params.customer_email}
Phone: ${params.customer_phone}

LAUNCH DETAILS:
Requested Date: ${params.launch_date}
Requested Time: ${params.launch_time}
Launch Site Address:
${params.launch_address}

CANDY ORDER:
${params.candy_items}

Candy Total: $${params.candy_total}
Launch Fee: $${params.launch_fee}
---
TOTAL COST: $${params.total_cost}
Total Barrels: 🛢️ ${params.total_barrels}

SPECIAL REQUESTS:
${params.special_requests}

---
Please confirm availability and contact the customer to finalize the booking.
        `;
    }

    showSuccessMessage(isMailto = false) {
        const form = document.getElementById('launch-request-form');
        const successMsg = document.getElementById('success-message');
        
        form.style.display = 'none';
        successMsg.style.display = 'flex';

        if (isMailto) {
            const successContent = successMsg.querySelector('.success-content');
            successContent.innerHTML += `
                <p style="font-size: 0.9em; color: #999; margin-top: 15px;">
                    Note: Your email client will open. Please complete the email sending.
                </p>
            `;
        }
    }

    showErrorMessage(message) {
        alert('Error: ' + message);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LaunchRequest();
});
