// Game state variables
let food = 0;
let fun = 0;
let rest = 0;
let actions = 0;
let monsterType = null;

// Badge flags
let hasFullBelly = false;
let hasPlayPal = false;
let hasWellRested = false;
let hasBalancedCare = false;

// Inventory item flags
let hasCookie = false;
let hasCoffee = false;
let hasToy = false;
let hasPillow = false;
let hasVitamin = false;

// DOM Elements
const hungerBar = document.getElementById('hunger-bar');
const happinessBar = document.getElementById('happiness-bar');
const energyBar = document.getElementById('energy-bar');
const hungerValue = document.getElementById('hunger-value');
const happinessValue = document.getElementById('happiness-value');
const energyValue = document.getElementById('energy-value');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const sleepBtn = document.getElementById('sleep-btn');
const cleanBtn = document.getElementById('clean-btn');
const badgesContainer = document.getElementById('badges-container');
const inventory = document.getElementById('inventory-items');
const revealBtn = document.getElementById('reveal-btn');
const monsterImage = document.getElementById('monster-image');
const monsterResult = document.getElementById('monster-result');

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    feedBtn.addEventListener('click', function() { handleAction('feed'); });
    playBtn.addEventListener('click', function() { handleAction('play'); });
    sleepBtn.addEventListener('click', function() { handleAction('sleep'); });
    cleanBtn.addEventListener('click', function() { handleAction('clean'); });
    revealBtn.addEventListener('click', revealMonster);
    
    // Initial UI update
    updateUI();
    
    console.log('Game initialized');
    // Log initial state
    console.log('Initial state:', {
        food: food,
        fun: fun,
        rest: rest,
        actions: actions,
        monsterType: monsterType
    });
});

// Apply stat changes based on individual values
function updateStats(foodChange, funChange, restChange) {
    food = Math.max(0, Math.min(10, food + (foodChange || 0)));
    fun = Math.max(0, Math.min(10, fun + (funChange || 0)));
    rest = Math.max(0, Math.min(10, rest + (restChange || 0)));
}

// Handle action button clicks
function handleAction(actionType) {
    // Update stats based on action
    switch (actionType) {
        case 'feed':
            updateStats(2, 0, -1); // +2 food, -1 energy
            break;
        case 'play':
            updateStats(0, 2, -1); // +2 fun, -1 energy
            break;
        case 'sleep':
            updateStats(-1, 0, 3); // +3 energy, -1 food
            break;
        case 'clean':
            // Cleaning is a neutral action that just increments the action counter
            break;
    }
    
    // Increment action counter
    actions++;
    
    // Check for badges
    checkBadges();
    
    // Update UI
    updateUI();
    
    // Log state for debugging
    console.log(`Action: ${actionType}`);
    console.log('Updated state:', {
        food: food,
        fun: fun,
        rest: rest,
        actions: actions,
        monsterType: monsterType
    });
}

// Check and update badges
function checkBadges() {
    // Full Belly badge (food ≥ 5)
    if (food >= 5 && !hasFullBelly) {
        hasFullBelly = true;
        hasCookie = true;
        addBadge('Cookie', '🍪', 'Hunger +2, Happiness +2, Energy -1');
    }
    
    // Play Pal badge (fun ≥ 5)
    if (fun >= 5 && !hasPlayPal) {
        hasPlayPal = true;
        hasToy = true;
        addBadge('Toy', '🧸', 'Happiness +3, Energy -2');
    }
    
    // Well Rested badge (rest ≥ 5)
    if (rest >= 5 && !hasWellRested) {
        hasWellRested = true;
        hasPillow = true;
        addBadge('Pillow', '🛏️', 'Energy +3, Hunger -1');
    }
    
    // Balanced Care badge (all three stats ≥ 4)
    if (food >= 4 && fun >= 4 && rest >= 4 && !hasBalancedCare) {
        hasBalancedCare = true;
        hasVitamin = true;
        addBadge('Vitamin', '💊', 'Hunger +1, Happiness +1, Energy +1');
    }
    
    // Enable reveal button after 12 actions
    if (actions >= 12) {
        revealBtn.disabled = false;
    }
}

// Add a badge to the UI and its corresponding item to inventory
function addBadge(text, emoji, effects) {
    // Create badge
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = `${emoji} ${text}`;
    badge.setAttribute('aria-label', `Earned badge: ${text}`);
    badgesContainer.appendChild(badge);
    
    // Create corresponding inventory item
    const inventoryItem = document.createElement('button');
    inventoryItem.className = 'inventory-item';
    inventoryItem.textContent = emoji;
    inventoryItem.title = `${text}\n${effects}`;
    
    // Add click handler based on item type
    if (text === 'Cookie') {
        inventoryItem.onclick = function() {
            updateStats(2, 2, -1); // Cookie effects
            hasCookie = false;
            updateUI();
        };
    } else if (text === 'Toy') {
        inventoryItem.onclick = function() {
            updateStats(0, 3, -2); // Toy effects
            hasToy = false;
            updateUI();
        };
    } else if (text === 'Pillow') {
        inventoryItem.onclick = function() {
            updateStats(-1, 0, 3); // Pillow effects
            hasPillow = false;
            updateUI();
        };
    } else if (text === 'Vitamin') {
        inventoryItem.onclick = function() {
            updateStats(1, 1, 1); // Vitamin effects
            hasVitamin = false;
            updateUI();
        };
    }
    
    inventory.appendChild(inventoryItem);
    
    // Visual feedback
    badge.style.animation = 'pop 0.5s ease-out';
    setTimeout(() => {
        badge.style.animation = '';
    }, 500);
}

// Update the UI based on current state
function updateUI() {
    // Update stat bars and values
    hungerBar.style.width = `${food * 10}%`;
    happinessBar.style.width = `${fun * 10}%`;
    energyBar.style.width = `${rest * 10}%`;
    
    hungerValue.textContent = food;
    happinessValue.textContent = fun;
    energyValue.textContent = rest;
    
    // Update action buttons based on action count
    if (actions >= 12) {
        feedBtn.disabled = true;
        playBtn.disabled = true;
        sleepBtn.disabled = true;
        cleanBtn.disabled = true;
    }
    
    // Update monster image based on highest stat (if not revealed yet)
    if (!monsterType) {
        if (actions > 0) {
            monsterImage.src = 'monster-egg-cracked.png';
        } else {
            monsterImage.src = 'monster-egg.png';
        }
    }
    
    // Update inventory display
    updateInventory();
}

// Update inventory display
function updateInventory() {
    // Clear current inventory display
    inventory.innerHTML = '';
    
    // Add each item that the player has
    if (hasCookie) {
        addInventoryItem('Cookie', '🍪', 'Hunger +2, Happiness +2, Energy -1');
    }
    if (hasToy) {
        addInventoryItem('Toy', '🧸', 'Happiness +3, Energy -2');
    }
    if (hasPillow) {
        addInventoryItem('Pillow', '🛏️', 'Energy +3, Hunger -1');
    }
    if (hasVitamin) {
        addInventoryItem('Vitamin', '💊', 'Hunger +1, Happiness +1, Energy +1');
    }
}

// Add an item to the inventory display
function addInventoryItem(name, emoji, effects) {
    const item = document.createElement('button');
    item.className = 'inventory-item';
    item.textContent = emoji;
    item.title = `${name}\n${effects}`;
    
    // Set up click handler for this specific item
    if (name === 'Cookie') {
        item.onclick = function() {
            updateStats(2, 2, -1);
            hasCookie = false;
            updateUI();
        };
    } else if (name === 'Toy') {
        item.onclick = function() {
            updateStats(0, 3, -2);
            hasToy = false;
            updateUI();
        };
    } else if (name === 'Pillow') {
        item.onclick = function() {
            updateStats(-1, 0, 3);
            hasPillow = false;
            updateUI();
        };
    } else if (name === 'Vitamin') {
        item.onclick = function() {
            updateStats(1, 1, 1);
            hasVitamin = false;
            updateUI();
        };
    }
    
    inventory.appendChild(item);
}

// Determine and reveal the monster type
function revealMonster() {
    // Disable reveal button
    revealBtn.disabled = true;
    
    // Determine monster type based on stats and badges
    if (hasBalancedCare) {
        monsterType = 'Harmoni';
        monsterImage.src = 'monster-harmoni.png';
        monsterResult.textContent = 'Your monster evolved into Harmoni! A perfect balance of all traits!';
    } else if (food > fun + 1 && food > rest + 1) {
        monsterType = 'Glutton';
        monsterImage.src = 'monster-glutton.png';
        monsterResult.textContent = 'Your monster evolved into Glutton! It loves to eat!';
    } else if (fun > food + 1 && fun > rest + 1) {
        monsterType = 'Zoomer';
        monsterImage.src = 'monster-zoomer.png';
        monsterResult.textContent = 'Your monster evolved into Zoomer! Always ready to play!';
    } else if (rest > food + 1 && rest > fun + 1) {
        monsterType = 'Dozer';
        monsterImage.src = 'monster-dozer.png';
        monsterResult.textContent = 'Your monster evolved into Dozer! It needs its beauty sleep!';
    } else {
        monsterType = 'Chaoti';
        monsterImage.src = 'monster-chaoti.png';
        monsterResult.textContent = 'Your monster evolved into Chaoti! It\'s a wild one!';
    }
    
    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Start Over';
    resetBtn.className = 'action-btn';
    resetBtn.style.marginTop = '10px';
    resetBtn.addEventListener('click', resetGame);
    monsterResult.appendChild(document.createElement('br'));
    monsterResult.appendChild(resetBtn);
    
    console.log('Monster revealed:', monsterType);
}

// Reset the game to initial state
function resetGame() {
    // Reset stats
    food = 0;
    fun = 0;
    rest = 0;
    actions = 0;
    monsterType = null;
    
    // Reset badges
    hasFullBelly = false;
    hasPlayPal = false;
    hasWellRested = false;
    hasBalancedCare = false;
    
    // Reset inventory
    hasCookie = false;
    hasCoffee = false;
    hasToy = false;
    hasPillow = false;
    hasVitamin = false;
    
    // Reset UI
    badgesContainer.innerHTML = '';
    inventory.innerHTML = '';
    monsterResult.textContent = '';
    revealBtn.disabled = true;
    feedBtn.disabled = false;
    playBtn.disabled = false;
    sleepBtn.disabled = false;
    cleanBtn.disabled = false;
    
    // Update UI
    updateUI();
    
    console.log('Game reset');
    console.log('Current state:', {
        food: food,
        fun: fun,
        rest: rest,
        actions: actions,
        monsterType: monsterType
    });
    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Start Over';
    resetBtn.className = 'action-btn';
    resetBtn.style.marginTop = '10px';
    resetBtn.addEventListener('click', resetGame);
    elements.monsterResult.appendChild(document.createElement('br'));
    elements.monsterResult.appendChild(resetBtn);
    
    console.log('Monster revealed:', state.monsterType);
}

// Reset the game to initial state
function resetGame() {
    // Reset state
    state.food = 0;
    state.fun = 0;
    state.rest = 0;
    state.actions = 0;
    state.badges = {
        fullBelly: false,
        playPal: false,
        wellRested: false,
        balancedCare: false
    };
    state.monsterType = null;
    
    // Reset UI
    elements.badgesContainer.innerHTML = '';
    elements.inventory.innerHTML = '';
    elements.monsterResult.textContent = '';
    elements.revealBtn.disabled = true;
    elements.feedBtn.disabled = false;
    elements.playBtn.disabled = false;
    elements.sleepBtn.disabled = false;
    elements.cleanBtn.disabled = false;
    
    // Update UI
    updateUI();
    
    console.log('Game reset');
    console.log('Current state:', state);
}

// Add a simple animation for badges
const style = document.createElement('style');
style.textContent = `
    @keyframes pop {
        0% { transform: scale(0.8); opacity: 0; }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .inventory-item {
        display: inline-block;
        font-size: 1.5rem;
        margin: 5px;
        padding: 5px 10px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
