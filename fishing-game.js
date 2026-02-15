// 🎣 เกมตกปลาไฮโดรเจน - JavaScript
// ระบบ RNG, เศรษฐกิจ, และการแข่งขัน

const fishTypes = [
    // Common (60%)
    { name: 'ปลาไฮโดรเจนเทา', emoji: '🐟', rarity: 'common', value: 10, chance: 30, score: 1 },
    { name: 'ปลาน้ำจืด H₂', emoji: '🐠', rarity: 'common', value: 15, chance: 30, score: 1 },
    // Uncommon (25%)
    { name: 'ปลาไฮโดรเจนฟ้า', emoji: '🐡', rarity: 'uncommon', value: 50, chance: 15, score: 3 },
    { name: 'ปลาเซลล์เชื้อเพลิง', emoji: '🦈', rarity: 'uncommon', value: 60, chance: 10, score: 3 },
    // Rare (10%)
    { name: 'ปลาไฮโดรเจนเขียว', emoji: '🐬', rarity: 'rare', value: 150, chance: 6, score: 10 },
    { name: 'ปลาอิเล็กโทรลิซิส', emoji: '🐳', rarity: 'rare', value: 180, chance: 4, score: 10 },
    // Epic (3%)
    { name: 'ปลาพลังงานสะอาด', emoji: '🦑', rarity: 'epic', value: 400, chance: 2, score: 25 },
    { name: 'ปลาคาร์บอนศูนย์', emoji: '🐙', rarity: 'epic', value: 450, chance: 1, score: 25 },
    // Legendary (1.5%)
    { name: 'มังกรไฮโดรเจน', emoji: '🐉', rarity: 'legendary', value: 1000, chance: 1, score: 100 },
    { name: 'ฟีนิกซ์พลังงาน', emoji: '🦅', rarity: 'legendary', value: 1200, chance: 0.5, score: 100 },
    // Mythic (0.5%)
    { name: 'เทพไฮโดรเจน', emoji: '👑', rarity: 'mythic', value: 5000, chance: 0.3, score: 500 },
    { name: 'จักรพรรดิพลังงาน', emoji: '⚡', rarity: 'mythic', value: 10000, chance: 0.2, score: 1000 }
];

const rodUpgrades = [
    { level: 1, name: 'เบ็ดไม้ไผ่', cost: 0, bonus: 0 },
    { level: 2, name: 'เบ็ดเหล็ก', cost: 200, bonus: 5 },
    { level: 3, name: 'เบ็ดคาร์บอนไฟเบอร์', cost: 500, bonus: 10 },
    { level: 4, name: 'เบ็ดไฮโดรเจน', cost: 1500, bonus: 20 },
    { level: 5, name: 'เบ็ดควอนตัม', cost: 5000, bonus: 35 },
    { level: 6, name: 'เบ็ดเทพเจ้า', cost: 15000, bonus: 50 }
];

let gameData = {
    playerName: '',
    coins: 100,
    rodLevel: 1,
    inventory: [],
    collection: {},
    totalCatches: 0,
    score: 0
};

// Load & Save Functions
function loadGameData(playerName) {
    const saved = localStorage.getItem(`fishingGame_${playerName}`);
    if (saved) {
        gameData = JSON.parse(saved);
    } else {
        gameData = {
            playerName: playerName,
            coins: 100,
            rodLevel: 1,
            inventory: [],
            collection: {},
            totalCatches: 0,
            score: 0
        };
    }
    updateUI();
}

function saveGameData() {
    localStorage.setItem(`fishingGame_${gameData.playerName}`, JSON.stringify(gameData));
    updateLeaderboard();
}

function updateUI() {
    document.getElementById('displayName').innerText = gameData.playerName;
    document.getElementById('playerCoins').innerText = gameData.coins.toLocaleString();
    document.getElementById('rodLevel').innerText = gameData.rodLevel;
    document.getElementById('totalFish').innerText = gameData.totalCatches;
    document.getElementById('playerScore').innerText = gameData.score.toLocaleString();
    updateInventory();
    updateShop();
}

// Fishing Logic
function catchFish() {
    const rodBonus = rodUpgrades[gameData.rodLevel - 1].bonus;
    let roll = Math.random() * 100;
    
    if (roll > 50) {
        roll = roll - (rodBonus / 2);
    }

    let cumulativeChance = 0;
    let caughtFish = null;

    for (let i = fishTypes.length - 1; i >= 0; i--) {
        cumulativeChance += fishTypes[i].chance;
        if (roll <= cumulativeChance) {
            caughtFish = { ...fishTypes[i], id: Date.now() + Math.random() };
            break;
        }
    }

    if (!caughtFish) {
        caughtFish = { ...fishTypes[0], id: Date.now() + Math.random() };
    }

    gameData.inventory.push(caughtFish);
    gameData.totalCatches++;
    gameData.score += caughtFish.score;

    if (!gameData.collection[caughtFish.name]) {
        gameData.collection[caughtFish.name] = 0;
    }
    gameData.collection[caughtFish.name]++;

    saveGameData();
    return caughtFish;
}

function updateInventory() {
    const inv = document.getElementById('inventory');
    if (gameData.inventory.length === 0) {
        inv.innerHTML = '<p style="text-align:center; opacity:0.6; padding: 20px;">ยังไม่มีปลา</p>';
        return;
    }

    inv.innerHTML = gameData.inventory.map(fish => `
        <div class="fish-item rarity-${fish.rarity}">
            <span>${fish.emoji} ${fish.name}</span>
            <span>💰${fish.value}</span>
        </div>
    `).join('');
}

function updateShop() {
    const shop = document.getElementById('shopItems');
    const nextRod = rodUpgrades[gameData.rodLevel];

    if (nextRod) {
        shop.innerHTML = `
            <div class="shop-item">
                <h3 style="margin-bottom: 10px;">🎣 ${nextRod.name}</h3>
                <p>โบนัส: +${nextRod.bonus}% โอกาสปลาหายาก</p>
                <p style="font-size: 1.2rem; margin: 10px 0;"><strong>ราคา: ${nextRod.cost.toLocaleString()} เหรียญ</strong></p>
                <button class="btn" onclick="buyRodUpgrade()" ${gameData.coins < nextRod.cost ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ซื้อ
                </button>
            </div>
        `;
    } else {
        shop.innerHTML = '<p style="text-align:center; font-size: 1.5rem; padding: 30px;">🏆 คุณมีเบ็ดที่ดีที่สุดแล้ว!</p>';
    }
}

function updateLeaderboard() {
    const allPlayers = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fishingGame_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                allPlayers.push(data);
            } catch (e) {
                console.error('Error parsing player data:', e);
            }
        }
    }

    allPlayers.sort((a, b) => b.score - a.score);
    const top10 = allPlayers.slice(0, 10);

    const lb = document.getElementById('leaderboard');
    if (top10.length === 0) {
        lb.innerHTML = '<p style="text-align:center; opacity:0.6; padding: 20px;">ยังไม่มีผู้เล่น</p>';
        return;
    }

    lb.innerHTML = top10.map((player, idx) => `
        <div class="leaderboard-item ${idx < 3 ? 'rank-' + (idx + 1) : ''}">
            <span><strong>#${idx + 1}</strong> ${player.playerName}</span>
            <span>⭐ ${player.score.toLocaleString()}</span>
        </div>
    `).join('');
}

window.buyRodUpgrade = function() {
    const nextRod = rodUpgrades[gameData.rodLevel];
    if (!nextRod) return;
    
    if (gameData.coins >= nextRod.cost) {
        gameData.coins -= nextRod.cost;
        gameData.rodLevel++;
        saveGameData();
        updateUI();
        alert(`🎣 อัพเกรดเบ็ดเป็น ${nextRod.name} สำเร็จ!`);
    } else {
        alert('เหรียญไม่พอ!');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginBtn').addEventListener('click', () => {
        const name = document.getElementById('playerName').value.trim();
        if (!name) {
            alert('กรุณาใส่ชื่อผู้เล่น!');
            return;
        }
        loadGameData(name);
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('gamePanel').style.display = 'block';
        updateLeaderboard();
    });

    document.getElementById('castBtn').addEventListener('click', function() {
        this.disabled = true;
        const result = document.getElementById('fishingResult');
        const anim = document.getElementById('catchAnimation');
        
        result.innerText = '🎣 กำลังตกปลา...';
        
        setTimeout(() => {
            const fish = catchFish();
            anim.innerText = fish.emoji;
            anim.style.display = 'block';
            
            setTimeout(() => {
                anim.style.display = 'none';
                let rarityText = '';
                let rarityColor = '';
                switch(fish.rarity) {
                    case 'common': 
                        rarityText = '⚪ ธรรมดา'; 
                        rarityColor = '#808080';
                        break;
                    case 'uncommon': 
                        rarityText = '🟢 ไม่ธรรมดา'; 
                        rarityColor = '#00ff00';
                        break;
                    case 'rare': 
                        rarityText = '🔵 หายาก'; 
                        rarityColor = '#0080ff';
                        break;
                    case 'epic': 
                        rarityText = '🟣 สุดยอด'; 
                        rarityColor = '#a020f0';
                        break;
                    case 'legendary': 
                        rarityText = '🟠 ตำนาน'; 
                        rarityColor = '#ffa500';
                        break;
                    case 'mythic': 
                        rarityText = '🔴 เทพเจ้า'; 
                        rarityColor = '#ff1493';
                        break;
                }
                result.innerHTML = `
                    <div style="background: rgba(255,255,255,0.95); padding: 25px; border-radius: 30px; display: inline-block; color: #1b3b4f;">
                        <div style="font-size: 4rem; margin-bottom: 10px;">${fish.emoji}</div>
                        <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px;">${fish.name}</div>
                        <div style="color: ${rarityColor}; font-size: 1.2rem; margin-bottom: 10px;">${rarityText}</div>
                        <div style="font-size: 1.1rem;">💰 ${fish.value} | ⭐ +${fish.score}</div>
                    </div>
                `;
                updateUI();
                this.disabled = false;
            }, 600);
        }, 1500);
    });

    document.getElementById('sellAllBtn').addEventListener('click', () => {
        if (gameData.inventory.length === 0) {
            alert('ไม่มีปลาให้ขาย!');
            return;
        }
        
        const totalValue = gameData.inventory.reduce((sum, fish) => sum + fish.value, 0);
        gameData.coins += totalValue;
        const count = gameData.inventory.length;
        gameData.inventory = [];
        
        saveGameData();
        updateUI();
        
        alert(`🎉 ขายปลา ${count} ตัว ได้ ${totalValue.toLocaleString()} เหรียญ!`);
    });

    document.getElementById('showCollectionBtn').addEventListener('click', () => {
        let collectionHTML = '<div style="background: white; padding: 30px; border-radius: 40px; max-width: 700px; margin: 20px auto; max-height: 80vh; overflow-y: auto;">';
        collectionHTML += '<h2 style="text-align: center; margin-bottom: 20px; color: #1b3b4f;">📖 สมุดสะสมปลา</h2>';
        
        fishTypes.forEach(fish => {
            const caught = gameData.collection[fish.name] || 0;
            const opacity = caught > 0 ? 1 : 0.3;
            const bgColor = caught > 0 ? '#f0f8ff' : '#f5f5f5';
            collectionHTML += `
                <div style="display: flex; justify-content: space-between; padding: 15px; opacity: ${opacity}; border-bottom: 1px solid #eee; background: ${bgColor}; margin: 5px 0; border-radius: 15px;">
                    <span style="font-size: 1.1rem;">${fish.emoji} ${fish.name}</span>
                    <span style="font-weight: bold; color: #44bfb0;">จับได้: ${caught} ตัว</span>
                </div>
            `;
        });
        
        const totalCaught = Object.keys(gameData.collection).length;
        const percentage = ((totalCaught / fishTypes.length) * 100).toFixed(1);
        
        collectionHTML += `
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 20px; text-align: center;">
                <strong>ความคืบหน้า: ${totalCaught}/${fishTypes.length} (${percentage}%)</strong>
            </div>
        `;
        
        collectionHTML += '<button class="btn" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; width: 100%;">ปิด</button>';
        collectionHTML += '</div>';
        
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; overflow-y: auto; padding: 20px; display: flex; align-items: center; justify-content: center;';
        modal.innerHTML = collectionHTML;
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        document.body.appendChild(modal);
    });
});
