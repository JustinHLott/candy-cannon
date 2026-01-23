// Candy Cannon Cart - JavaScript

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

const candyImages = {
    'sour-punch-twists': 'images/Sour_punch_twists.png',
    'lemonheads': 'images/Lemonheads.png',
    'mexican-candy': 'images/Assorted_Mexican_candy.png',
    'peppermint': 'images/Peppermint.png',
    'butterscotch': 'images/Butterscotch_disks.png',
    'skittles': 'images/Skittles_fun_size.png',
    'root-beer-barrels': 'images/Root_beer_barrels.png',
    'milky-way': 'images/Milky_Way_miniatures.png',
    'jolly-rancher': 'images/Jolly_rancher.png',
    'm-and-m-peanut': 'images/Mms_fun_size_peanut.png',
    'snickers-mini': 'images/Snickers_mini_valentines.png',
    'crown-milk-truffle': 'images/Crown_Milk_chocolate_truffles.png',
    'crown-dark-truffle': 'images/Crown_Dark_Chocolate_truffles.png',
    'twix': 'images/Twix.png',
    'starburst': 'images/Starburst.png',
    'gummy-sunkist': 'images/Fruit_gummy_Sunkist.png',
    'riesen': 'images/Riesen.png',
    'werthers': 'images/Werthers_original_hard_caramels.png',
    'lindor-white': 'images/Lindor_white_chocolate.png',
    'lindor-milk': 'images/Lindor_milk_chocolate.png',
    'lindor-dark': 'images/Lindor_dark_chocolate.png'
};

class ShoppingCart {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.renderCart();
        this.setupClearCartButton();
    }

    loadCart() {
        const savedCart = localStorage.getItem('candyCannon-cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('candyCannon-cart', JSON.stringify(this.cart));
    }

    setupClearCartButton() {
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
        }
    }

    renderCart() {
        const cartContent = document.getElementById('cart-content');

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <p>Go back to add some delicious candy to your cannon!</p>
                </div>
            `;
            return;
        }

        let tableHTML = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th style="width: 5%;"></th>
                        <th style="width: 35%;">Candy Name</th>
                        <th style="width: 20%;">Barrel %</th>
                        <th style="width: 20%;">Price</th>
                        <th style="width: 15%;">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        const LAUNCH_COST = 75.00;
        let total = 0;
        let totalBarrels = 0;

        this.cart.forEach((item, index) => {
            const candyName = candyNames[item.candy] || item.candy;
            const candyImage = candyImages[item.candy] || '';
            const itemTotal = parseFloat(item.total);
            const fillPercent = parseInt(item.fill);
            
            total += itemTotal;
            totalBarrels += (fillPercent / 100);

            tableHTML += `
                <tr>
                    <td><img src="${candyImage}" alt="${candyName}" class="cart-item-image"></td>
                    <td><span class="candy-name">${candyName}</span></td>
                    <td><span class="barrel-fill">${item.fill}%</span></td>
                    <td><span class="item-price">$${itemTotal.toFixed(2)}</span></td>
                    <td><button class="remove-btn" onclick="cart.removeItem(${index})">Remove</button></td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        tableHTML += `
            <div class="cart-summary">
                <div class="summary-rows">
                    <div class="summary-row">
                        <span class="summary-label">Items in Cart:</span>
                        <span class="summary-value items-count">${this.cart.length}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Total Barrels:</span>
                        <span class="summary-value barrels-count">🛢️ ${totalBarrels.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Candy Total:</span>
                        <span class="summary-value">$${total.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Launch Cost:</span>
                        <span class="summary-value">$${LAUNCH_COST.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span class="summary-label">Total:</span>
                        <span class="summary-value">$${(total + LAUNCH_COST).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        cartContent.innerHTML = tableHTML;
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.renderCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    }
}

// Initialize cart when DOM is ready
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
