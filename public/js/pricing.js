// Candy Cannon Pricing - JavaScript

class PricingCalculator {
    constructor() {
        this.selectedCandy = null;
        this.selectedFill = null;
        this.candyPrice = 0;
        this.fillMultiplier = 1.0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Candy button listeners
        document.querySelectorAll('.candy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCandy(e.target.closest('.candy-btn')));
        });

        // Barrel button listeners
        document.querySelectorAll('.barrel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectFill(e.target.closest('.barrel-btn')));
        });

        // Add to cart button
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => this.addToCart());
    }

    selectCandy(btn) {
        // Remove active class from all candy buttons
        document.querySelectorAll('.candy-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');

        // Store selection
        this.selectedCandy = btn.dataset.candy;
        this.candyPrice = parseFloat(btn.dataset.price);

        // Update summary
        const candyName = btn.querySelector('.candy-name').textContent;
        document.getElementById('selected-candy').textContent = candyName;
        document.getElementById('base-price').textContent = `$${this.candyPrice.toFixed(2)}`;

        this.updateTotal();
        this.checkFormValidity();
    }

    selectFill(btn) {
        // Remove active class from all barrel buttons
        document.querySelectorAll('.barrel-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');

        // Store selection
        this.selectedFill = btn.dataset.fill;
        this.fillMultiplier = parseFloat(btn.dataset.multiplier);

        // Update summary
        document.getElementById('selected-fill').textContent = `${btn.dataset.fill}% Full`;

        this.updateTotal();
        this.checkFormValidity();
    }

    updateTotal() {
        if (this.candyPrice && this.fillMultiplier) {
            const adjustedPrice = this.candyPrice * this.fillMultiplier;
            document.getElementById('total-price').textContent = `$${adjustedPrice.toFixed(2)}`;
        }
    }

    checkFormValidity() {
        const addBtn = document.querySelector('.add-to-cart-btn');
        if (this.selectedCandy && this.selectedFill) {
            addBtn.disabled = false;
        } else {
            addBtn.disabled = true;
        }
    }

    addToCart() {
        const fillPercent = this.selectedFill;
        const totalPrice = (this.candyPrice * this.fillMultiplier).toFixed(2);
        
        const orderDetails = {
            candy: this.selectedCandy,
            candyPrice: this.candyPrice,
            fill: fillPercent,
            multiplier: this.fillMultiplier,
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage
        let cart = JSON.parse(localStorage.getItem('candyCannon-cart')) || [];
        cart.push(orderDetails);
        localStorage.setItem('candyCannon-cart', JSON.stringify(cart));

        // Show success message
        this.showSuccessMessage(fillPercent, totalPrice);
    }

    showSuccessMessage(fill, price) {
        const btn = document.querySelector('.add-to-cart-btn');
        const originalText = btn.textContent;

        btn.textContent = `✓ Added! ($${price})`;
        btn.style.background = 'linear-gradient(135deg, #11b981 0%, #059669 100%)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            
            // Reset form
            this.resetForm();
        }, 2000);
    }

    resetForm() {
        document.querySelectorAll('.candy-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.barrel-btn').forEach(b => b.classList.remove('active'));
        
        this.selectedCandy = null;
        this.selectedFill = null;
        this.candyPrice = 0;
        this.fillMultiplier = 1.0;

        document.getElementById('selected-candy').textContent = 'Not selected';
        document.getElementById('selected-fill').textContent = 'Not selected';
        document.getElementById('base-price').textContent = '$0.00';
        document.getElementById('total-price').textContent = '$0.00';

        this.checkFormValidity();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PricingCalculator();
});
