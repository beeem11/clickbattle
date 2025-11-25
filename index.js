ClickBattle.init("구구"); // 자기 닉네임



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


let initialtime = 15000; 
let score = 0;
let intervalId;

let tap = 50;
const down = 2;


//시간계산
function time(totalMs) {

    //   ? 이해 안감
const seconds = Math.floor(totalMs / 1000); // 전체 밀리초를 1000으로 나누어 초 계산
const milliseconds = totalMs % 100;    // 나머지 밀리초를 계산해서 세자리로 표시


const setseconds = String(seconds).padStart(2, '0');                     //두자리 초 
const setmilliseconds = String(milliseconds).padStart(2, '0');           //세자리 밀리초

return `${setseconds}:${setmilliseconds}`;

};

//타이머세팅
timer.textContent = time(initialtime);


//타이머업데이트
function updateTimer() {

    initialtime -= 10; // 10ms 감소
    
    timer.textContent = time(initialtime);



    // 시간이 0이되면 타이머 중지
    if (initialtime <= 0) {

    initialtime = 0;
    timer.textContent = '00:00';

    clearInterval(intervalId);

    // 결과 보여주기
if (initialtime === 0) {
    if (score >= 7) {
        result.style.display= 'block';
        restart.style.display='block';

        house.style.display='block';
        result.textContent = '집을 완성;;;'


    } else if (score >= 5 && score <7) {
        result.style.display= 'block';
        restart.style.display='block';

        table.style.display='block';
        result.textContent = '테이블을 완성!'


    } else if (score >=0 && score < 5) {
        result.style.display= 'block';
        restart.style.display='block';

        chair.style.display='block';
        result.textContent = '의자를 완성..'
    } ;
}

    };
};




//시작하기 버튼
start.addEventListener('click', () => {
    ClickBattle.recordClick();

    start.remove();
    intervalId = setInterval(updateTimer, 10);        // 10밀리초 간격으로 updateTimer 함수 실행
});




// 못박기
nail.addEventListener('click', () => {
    ClickBattle.recordClick();

    sound.style.display='block';

    //효과음 기능

            //배경크기 계산
            const bodyWidth = document.body.clientWidth 
            const bodyHeight = document.body.clientHeight 

            const desksize = desk.getBoundingClientRect();

            const maxX = bodyWidth - 50;
            const maxY = desksize.top - 50;
                    
            // desk 위치를 고려할 필요 없이 0, 0부터 시작
            const x = Math.random() * maxX; 
            const y = Math.random() * maxY;


            sound.style.left = `${x}px`;
            sound.style.top = `${y}px`;

      


tap += down ;

nail.style.top= tap + '%';


if (tap === 74) {
    score += 1;
    count.textContent = score;

    tap = 50;
    nail.style.top = tap + '%';
    
}

});



//다시 시작
restart.addEventListener('click', () => {
    ClickBattle.recordClick();
    window.location.reload();

}
)
