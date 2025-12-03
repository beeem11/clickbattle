const nail = document.getElementById('nail');
const desk = document.getElementById('desk');
const count = document.getElementById('count');
const timer = document.getElementById('timer');
const start = document.getElementById('start');
const result = document.getElementById('result');
const restart = document.getElementById('restart');
const sound = document.getElementById('sound');

const house = document.getElementById('house');
const table = document.getElementById('table');
const chair = document.getElementById('chair');
const signs = document.getElementById('signs');
const ax = document.getElementById('ax');
const decoration = document.getElementById('decoration');
const boat = document.getElementById('boat');

const collectionTab = document.getElementById('collection-tab');
const collectionScreen = document.getElementById('collection-screen');
const collectionList = document.getElementById('collection-list');
const closeCollection = document.getElementById('close-collection');

const zombie = document.getElementById('zombie');
const eventMessage = document.getElementById('event-message'); 
const eventTimerDisplay = document.getElementById('event-timer');

let isZombieActive = false;
let zombieMovementInterval;
let eventTimerInterval; 

let initialtime = 15000; 
let score = 0;
let intervalId;

let tap = 50;
const down = 2;

let achievedItems = {}; 

const items = [
    { id: 'ax', name: '도끼', threshold: 5, src: 'ax.png' }, 
    { id: 'signs', name: '표지판', threshold: 7, src: 'signs.png' }, 
    { id: 'decoration', name: '순록장식', threshold: 9, src: 'decoration.png' }, 
    { id: 'chair', name: '의자', threshold: 11, src: 'chair.png' }, 
    { id: 'table', name: '테이블', threshold: 12, src: 'table.png' }, 
    { id: 'boat', name: '보트', threshold: 13, src: 'boat.png' }, 
    { id: 'house', name: '집', threshold: 13, src: 'house.png' }, 
];

// 💡 새로운 이벤트 제어 변수
let willEventTrigger = false;
let eventTriggerTime = 0; // 이벤트가 시작될 시간 (ms)

function time(totalMs) {
    const seconds = Math.floor(totalMs / 1000);
    const milliseconds = Math.floor(totalMs % 1000 / 10); 
    const setseconds = String(seconds).padStart(2, '0');
    const setmilliseconds = String(milliseconds).padStart(2, '0');
    return `${setseconds}:${setmilliseconds}`;
}

timer.textContent = time(initialtime);


function saveCollection(itemId) {
    achievedItems[itemId] = true;
}


function setupEventChance() {
    // 💡 게임 시작 시 30% 확률로 이벤트 발동 여부 결정
    if (Math.random() < 0.4) {
        willEventTrigger = true;
        // 5초 ~ 10초 사이의 임의 시간에 발동되도록 설정
        // 15000ms (총 시간) - (5000ms 이벤트 지속 시간 + 5000ms 여유 시간) = 5000ms
        // 즉, 5000ms ~ 10000ms 시점에 이벤트가 시작되어야 5초 지속 후 게임이 끝나지 않음
        const minTime = 5000; 
        const maxTime = initialtime - 5000; 
        eventTriggerTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    } else {
        willEventTrigger = false;
        eventTriggerTime = 0;
    }
}


function resetGame() {
    initialtime = 15000;
    score = 0;
    tap = 50;

    clearInterval(intervalId);
    clearInterval(zombieMovementInterval); 
    clearInterval(eventTimerInterval); 
    isZombieActive = false; 
    zombie.style.display = 'none'; 
    eventMessage.style.display = 'none'; 

    count.textContent = score;
    timer.textContent = time(initialtime);
    nail.style.top = tap + '%';

    result.style.display = 'none';
    restart.style.display = 'none';
    collectionTab.style.display = 'block'; 

    house.style.display = 'none';
    table.style.display = 'none';
    chair.style.display = 'none';
    signs.style.display = 'none';
    ax.style.display = 'none';
    decoration.style.display = 'none';
    boat.style.display = 'none';
    
    // 💡 이벤트 확률 초기 설정
    setupEventChance();

    if (!document.getElementById('start')) {
        document.body.appendChild(start);
    }
}

function renderCollection() {
    const collected = achievedItems; 
    collectionList.innerHTML = ''; 

    items.forEach(item => {
        const isUnlocked = collected[item.id] === true; 
        const itemDiv = document.createElement('div');
        
        itemDiv.className = `collection-item ${isUnlocked ? 'unlocked' : ''}`;

        const itemName = isUnlocked ? item.name : '???'; 
        
        const imageHtml = isUnlocked 
            ? `<img src="${item.src}" alt="${item.name}">`
            : `<div style="height: 100px; display: flex; align-items: center; justify-content: center; font-size: 50px; color: gray;">?</div>`;
        
        itemDiv.innerHTML = `
            ${imageHtml}
            <p style="font-weight: bold;">${itemName}</p>
            <p style="font-size: 14px; color: ${isUnlocked ? '#4CAF50' : 'gray'};">${isUnlocked ? '획득 완료' : `필요 점수: ${item.threshold}`}</p>
        `;
        collectionList.appendChild(itemDiv);
    });
}

function moveZombie() {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;
    
    const maxX = bodyWidth - zombie.clientWidth;
    const maxY = bodyHeight * 0.7 - zombie.clientHeight; 

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    zombie.style.left = `${x}px`;
    zombie.style.top = `${y}px`;
}

function startZombieEvent() {
    isZombieActive = true;
    zombie.style.display = 'block';
    eventMessage.style.display = 'block'; 
    moveZombie(); 

    zombieMovementInterval = setInterval(moveZombie, 500);

    let timeLeft = 5;
    eventTimerDisplay.textContent = timeLeft;

    eventTimerInterval = setInterval(() => {
        timeLeft--;
        eventTimerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(eventTimerInterval);
            isZombieActive = false;
            zombie.style.display = 'none';
            eventMessage.style.display = 'none'; 
            clearInterval(zombieMovementInterval);
            zombieMovementInterval = null;
        }
    }, 1000);
}


function updateTimer() {
    initialtime -= 10;
    timer.textContent = time(initialtime);
    
    // 💡 게임 시작 시 결정된 이벤트 발생 시간이 되었는지 확인
    if (willEventTrigger && !isZombieActive && initialtime <= (15000 - eventTriggerTime) && initialtime > 0) {
        startZombieEvent();
        willEventTrigger = false; // 이벤트는 한 번만 발동
    }

    if (initialtime <= 0) {
        initialtime = 0;
        timer.textContent = '00:00';
        clearInterval(intervalId);

        result.style.display = 'block';
        restart.style.display = 'block';
        collectionTab.style.display = 'block';
        
        isZombieActive = false;
        clearInterval(zombieMovementInterval);
        clearInterval(eventTimerInterval); 
        zombie.style.display = 'none';
        eventMessage.style.display = 'none'; 
        
        let achievedItem = null;

        if (score >= 13) {
            house.style.display = 'block';
            result.textContent = '집을 완성!';
            achievedItem = 'house';
        } else if (score >= 12) {
                boat.style.display = 'block';
                result.textContent = '보트를 완성 ㄷㄷ';
                achievedItem = 'boat';

        } else if (score >= 11) {
            table.style.display = 'block';
            result.textContent = '테이블을 완성!';
            achievedItem = 'table';
        } else if (score >= 9) {
            chair.style.display = 'block';
            result.textContent = '의자를 완성!';
            achievedItem = 'chair';
        } else if (score >= 7) {
            decoration.style.display = 'block';
            result.textContent = '이건뭐야?';
            achievedItem = 'decoration';
        } else if (score >= 5) {
            signs.style.display = 'block';
            result.textContent = '표지판을 완성!';
            achievedItem = 'signs';
            
        } else {
            ax.style.display = 'block';
            result.textContent = '겨우 도끼를 완성...';
            achievedItem = 'ax';
        }

        if (achievedItem) {
            saveCollection(achievedItem);
        }
    }
}


start.addEventListener('click', () => {
    start.remove(); 
    collectionTab.style.display = 'none'; 
    intervalId = setInterval(updateTimer, 10);
});


nail.addEventListener('click', () => {
    if (initialtime > 0) { 
        sound.style.display='block';

        const bodyWidth = document.body.clientWidth 
        const desksize = desk.getBoundingClientRect();

        const maxX = bodyWidth - 50;
        const maxY = desksize.top - 50;
                
        const x = Math.random() * maxX; 
        const y = Math.random() * maxY;


        sound.style.left = `${x}px`;
        sound.style.top = `${y}px`;


        tap += down ;
        nail.style.top= tap + '%';

        if (tap >= 74) { 
            const points = isZombieActive ? 2 : 1;
            score += points;
            count.textContent = score;

            tap = 50;
            nail.style.top = tap + '%';
        }
    }
});


restart.addEventListener('click', () => {
    resetGame(); 
});


collectionTab.addEventListener('click', () => {
    renderCollection();         
    collectionScreen.style.display = 'block'; 
});

closeCollection.addEventListener('click', () => {
    collectionScreen.style.display = 'none'; 
});

resetGame();