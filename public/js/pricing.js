// Candy Cannon Pricing - JavaScript with Modal Selection

const candyNames = {
    'sour-punch-twists': 'Sour Punch Twists',
    'salt-water-taffy': 'Salt Water Taffy',
    'lemonheads': 'Lemonheads',
    'mexican-candy': 'Assorted Mexican Candy',
    'peppermint': 'Peppermint',
    'butterscotch': 'Butterscotch Disks',
    'skittles': 'Skittles Fun Size',
    'root-beer-barrels': 'Root Beer Barrels',
    'milky-way': 'Milky Way Miniatures',
    'laffy-taffy': 'Laffy Taffy',
    'jolly-rancher': 'Jolly Rancher',
    'm-and-m-peanut': 'M&Ms Fun Size Peanut',
    'snickers-mini': 'Snickers Mini Valentines',
    'tootsie-roll-mini': 'Tootsie Roll Mini',
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
    'salt-water-taffy': 'images/Salt_water_taffy.png',
    'lemonheads': 'images/Lemonheads.png',
    'mexican-candy': 'images/Assorted_Mexican_candy.png',
    'peppermint': 'images/Peppermint.png',
    'butterscotch': 'images/Butterscotch_disks.png',
    'skittles': 'images/Skittles_fun_size.png',
    'root-beer-barrels': 'images/Root_beer_barrels.png',
    'milky-way': 'images/Milky_Way_miniatures.png',
    'laffy-taffy': 'images/Laffy_taffy.png',
    'jolly-rancher': 'images/Jolly_rancher.png',
    'm-and-m-peanut': 'images/Mms_fun_size_peanut.png',
    'snickers-mini': 'images/Snickers_mini_valentines.png',
    'tootsie-roll-mini': 'images/Tootsie_roll_mini.png',
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

class PricingApp {
    constructor() {
        this.selections = [];
        this.currentCandy = null;
        this.currentPrice = 0;
        this.selectedBarrel = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Candy button listeners
        document.querySelectorAll('.candy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.openBarrelModal(e.target.closest('.candy-btn')));
        });

        // Modal barrel option listeners
        document.querySelectorAll('.barrel-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectBarrelOption(e.target.closest('.barrel-option-btn')));
        });

        // Modal buttons
        document.querySelector('.modal-ok-btn').addEventListener('click', () => this.confirmSelection());
        document.querySelector('.modal-cancel-btn').addEventListener('click', () => this.closeBarrelModal());
        document.querySelector('.close').addEventListener('click', () => this.closeBarrelModal());

        // Add to cart
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => this.addAllToCart());

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('barrelModal');
            if (e.target === modal) {
                this.closeBarrelModal();
            }
        });
    }

    openBarrelModal(candyBtn) {
        this.currentCandy = candyBtn.dataset.candy;
        this.currentPrice = parseFloat(candyBtn.dataset.price);
        
        const candyName = candyNames[this.currentCandy];
        document.getElementById('modal-candy-name').textContent = `Select barrel fill level for: ${candyName}`;
        
        // Reset barrel selection
        document.querySelectorAll('.barrel-option-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.selectedBarrel = null;
        document.querySelector('.modal-ok-btn').disabled = true;

        // Show modal
        document.getElementById('barrelModal').style.display = 'block';
    }

    closeBarrelModal() {
        document.getElementById('barrelModal').style.display = 'none';
        this.currentCandy = null;
        this.selectedBarrel = null;
    }

    selectBarrelOption(btn) {
        // Remove active from all
        document.querySelectorAll('.barrel-option-btn').forEach(b => b.classList.remove('active'));
        
        // Add active to selected
        btn.classList.add('active');

        this.selectedBarrel = {
            fill: btn.dataset.fill,
            multiplier: parseFloat(btn.dataset.multiplier)
        };

        // Enable OK button
        document.querySelector('.modal-ok-btn').disabled = false;
    }

    confirmSelection() {
        if (!this.currentCandy || !this.selectedBarrel) return;

        const selection = {
            candy: this.currentCandy,
            candyName: candyNames[this.currentCandy],
            candyImage: candyImages[this.currentCandy],
            candyPrice: this.currentPrice,
            fill: this.selectedBarrel.fill,
            multiplier: this.selectedBarrel.multiplier,
            total: (this.currentPrice * this.selectedBarrel.multiplier).toFixed(2)
        };

        this.selections.push(selection);
        this.closeBarrelModal();
        this.updatePreview();
        this.updateSummary();
    }

    updatePreview() {
        const previewDiv = document.getElementById('selections-preview');
        
        if (this.selections.length === 0) {
            previewDiv.innerHTML = '<p class="empty-preview">No items selected yet. Click on a candy to add it!</p>';
            return;
        }

        let html = '<div class="preview-items">';
        
        this.selections.forEach((selection, index) => {
            html += `
                <div class="preview-item">
                    <div class="preview-item-image">
                        <img src="${selection.candyImage}" alt="${selection.candyName}">
                    </div>
                    <div class="preview-item-details">
                        <div class="preview-item-name">${selection.candyName}</div>
                        <div class="preview-item-info">${selection.fill}% Barrel | $${selection.total}</div>
                    </div>
                    <button class="preview-item-remove" onclick="app.removeSelection(${index})">✕</button>
                </div>
            `;
        });

        html += '</div>';
        previewDiv.innerHTML = html;
    }

    removeSelection(index) {
        this.selections.splice(index, 1);
        this.updatePreview();
        this.updateSummary();
    }

    updateSummary() {
        let totalPrice = 0;
        let totalBarrels = 0;

        this.selections.forEach(selection => {
            totalPrice += parseFloat(selection.total);
            totalBarrels += (parseInt(selection.fill) / 100);
        });

        document.getElementById('total-items').textContent = this.selections.length;
        document.getElementById('total-barrels').textContent = `🛢️ ${totalBarrels.toFixed(2)}`;
        document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;

        // Enable add to cart if selections exist
        const addBtn = document.querySelector('.add-to-cart-btn');
        if (this.selections.length > 0) {
            addBtn.disabled = false;
        } else {
            addBtn.disabled = true;
        }
    }

    addAllToCart() {
        // Store all selections in localStorage
        let cart = JSON.parse(localStorage.getItem('candyCannon-cart')) || [];
        
        this.selections.forEach(selection => {
            cart.push({
                candy: selection.candy,
                candyPrice: selection.candyPrice,
                fill: selection.fill,
                multiplier: selection.multiplier,
                total: selection.total,
                timestamp: new Date().toISOString()
            });
        });

        localStorage.setItem('candyCannon-cart', JSON.stringify(cart));

        // Show success message
        this.showSuccessMessage();
    }

    showSuccessMessage() {
        const btn = document.querySelector('.add-to-cart-btn');
        const originalText = btn.textContent;
        const itemCount = this.selections.length;

        btn.textContent = `✓ Added ${itemCount} item(s)!`;
        btn.style.background = 'linear-gradient(135deg, #11b981 0%, #059669 100%)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            
            // Reset form
            this.resetForm();
        }, 2000);
    }

    resetForm() {
        this.selections = [];
        this.updatePreview();
        this.updateSummary();
    }
}

// Initialize when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PricingApp();
});
