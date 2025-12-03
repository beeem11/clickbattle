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

const collectionTab = document.getElementById('collection-tab');
const collectionScreen = document.getElementById('collection-screen');
const collectionList = document.getElementById('collection-list');
const closeCollection = document.getElementById('close-collection');


let initialtime = 15000; 
let score = 0;
let intervalId;

let tap = 50;
const down = 2;

let achievedItems = {}; 

const items = [
    { id: 'ax', name: '도끼', threshold: 3, src: 'ax.png' },
    { id: 'signs', name: '표지판', threshold: 5, src: 'signs.png' },
    { id: 'chair', name: '의자', threshold: 7, src: 'chair.png' },
    { id: 'table', name: '테이블', threshold: 10, src: 'table.png' },
    { id: 'house', name: '집', threshold: 100, src: 'house.png' }
];

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


function resetGame() {
    initialtime = 15000;
    score = 0;
    tap = 50;

    clearInterval(intervalId);

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
        
        // 획득 여부에 따라 'unlocked' 클래스를 추가합니다. (CSS에서 filter: grayscale을 제어함)
        itemDiv.className = `collection-item ${isUnlocked ? 'unlocked' : ''}`;

        const itemName = isUnlocked ? item.name : '???'; 
        
        // 💡 수정: 미획득 시에는 임시 이미지(예: 'question.png' 또는 빈 문자열)를 사용하거나, 
        // CSS를 활용하여 이미지를 완전히 보이지 않게 처리합니다.
        // 여기서는 CSS의 필터(grayscale)는 유지하고, 미획득 시 아이템 영역 자체에 배경색을 입혀 이미지가 완전히 숨겨지게 합니다.
        
        // 아이템 이미지 경로 (획득 시 실제 이미지, 미획득 시 빈 이미지(또는 투명)를 통해 숨김 처리)
        const imageHtml = isUnlocked 
            ? `<img src="${item.src}" alt="${item.name}">`
            : `<div style="height: 100px; display: flex; align-items: center; justify-content: center; font-size: 50px; color: gray;">?</div>`;
        
        itemDiv.innerHTML = `
            ${imageHtml}
            <p style="font-weight: bold;">${itemName}</p>
            <p style="font-size: 14px; color: ${isUnlocked ? '#4CAF50' : 'gray'};">${isUnlocked ? '획득 완료' : '미획득'}</p>
        `;
        collectionList.appendChild(itemDiv);
    });
}


function updateTimer() {
    initialtime -= 10;
    timer.textContent = time(initialtime);

    if (initialtime <= 0) {
        initialtime = 0;
        timer.textContent = '00:00';
        clearInterval(intervalId);

        result.style.display = 'block';
        restart.style.display = 'block';
        collectionTab.style.display = 'block';
        
        let achievedItem = null;

        if (score >= 10) {
            house.style.display = 'block';
            result.textContent = '집을 완성!';
            achievedItem = 'house';
        } else if (score >= 7) {
            table.style.display = 'block';
            result.textContent = '테이블을 완성!';
            achievedItem = 'table';
        } else if (score >= 5) {
            chair.style.display = 'block';
            result.textContent = '의자를 완성!';
            achievedItem = 'chair';
        } else if (score >= 3) {
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
            score += 1;
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