class Roulette {
  randomDeg;

  // generateRandom() : 회전 각도 0 ~ 360도
  generateRandom = () => {
    let min = 0;
    let max = 360;
    return Math.floor(Math.random() * (max - min));
  };

  // rotateRoulette() : 돌림판 회전시작
  rotateRoulette = () => {
    return new Promise((resolve) => {
      this.randomDeg = this.generateRandom();
      let num = 0;
      let animation = setInterval(() => {
        console.log(num);
        num++;
        panel.style.transform = "rotate(" + 360 * num + "deg)";
        btn.disabled = true;
        btn.style.pointerEvents = "none";

        if (num === 50) {
          console.log("자! 그만~");
          clearInterval(animation);
          panel.style.transform = "rotate(" + this.randomDeg + "deg)";
        }
      }, 50);
      resolve("rotateRoulette finished");
    });
  };

  // displayResult() : 룰렛 결과 메세지를 보여줌
  displayResult = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let message = ["", ""];
        if (this.randomDeg <= 30 || this.randomDeg >= 330) {
          message[0] = "당첨!!";
          message[1] = "CU 3,000원 상품권";
        } else if (this.randomDeg >= 90 && this.randomDeg <= 150) {
          message[0] = "당첨!!";
          message[1] = "스타벅스 아메리카노";
        } else if (this.randomDeg >= 210 && this.randomDeg <= 270) {
          message[0] = "당첨!!";
          message[1] = "햄버거 세트 교환권";
        } else {
          message[0] = "꽝!!";
          message[1] = "다음 기회에";
        }

        // alert(message);
        resultText[0].innerHTML = message[0];
        resultText[1].innerHTML = message[1];

        left.style.backgroundColor = "gray";
        left.style.opacity = 0.5;
        right.style.backgroundColor = "gray";
        right.style.opacity = 0.5;
        result.style.display = "block";

        retryBtn.addEventListener("click", () => {
          retryBtn.href = "#";
          left.style.backgroundColor = "white";
          left.style.opacity = 1;
          right.style.backgroundColor = "white";
          right.style.opacity = 1;
          result.style.display = "none";
          resolve(true);
        });
        // resolve("displayResult finished");
      }, 5000);
    });
  };

  // resetRoulette() : 룰렛 위치 원상복귀
  resetRoulette = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        panel.style.transform = "rotate(" + 0 + "deg)";
        resolve("resetRoulette finished");
      }, 10);
    });
  };

  // enabledRoulette() : disabled 했던 버튼 재활성화
  enabledRoulette = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        btn.disabled = false;
        btn.style.pointerEvents = "auto";
        resolve("enabledRoulette finished");
      }, 2000);
    });
  };

  // btnClick() : start 버튼 클릭시 이벤트 발생
  btnClick = async () => {
    let res = await this.rotateRoulette();
    console.log(res);
    res = await this.displayResult();
    if (res === true) {
      console.log(res);
      res = await this.resetRoulette();
      console.log(res);
      res = await this.enabledRoulette();
      console.log(res);
    }
  };
}

const r = new Roulette();

let panel = document.querySelector(".roulette-panel");
let btn = document.querySelector(".roulette-btn");
let result = document.querySelector(".result");
let resultText = result.querySelectorAll("p");
let retryBtn = document.querySelector(".btn_again");
let left = document.querySelector(".roulette");
let right = document.querySelector(".userCustomize");
btn.addEventListener("click", r.btnClick);

// 참고한 링크
// https://jnoony-code.tistory.com/19
// https://lts0606.tistory.com/572?category=800911
// https://ko.javascript.info/settimeout-setinterval
// http://www.devdic.com/javascript/refer/dom/method:1585/animate()
// https://webdir.tistory.com/506
// https://webzz.tistory.com/369
// https://api.jquery.com/animate/

const canvas = document.querySelector(".roulette-panel");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

const devide = 8; //나눌 갯수 입니다
const degree = 360; //원은 360도..ㅋ
const goalDegree = 270 + degree / devide; //목표지점에서 끝부분 값 입니다

let data = [];
for (let i = 0; i < devide; i++) {
  let json = {
    first: (degree / devide) * i,
    last: (degree / devide) * (i + 1),
    text: i + 1,
  };
  data.push(json);
}

//#1. 부채꼴을 그립니다
data.forEach((item) => {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "gray";
  ctx.moveTo(width / 2, height / 2);
  ctx.arc(
    width / 2,
    height / 2,
    width / 2,
    (Math.PI / 180) * item.first,
    (Math.PI / 180) * item.last,
    false
  );
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
});
//#2. 가운에 원을 그립니다.
ctx.save();
ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = "#B4B4B4";
ctx.moveTo(width / 2, height / 2);
ctx.arc(
  width / 2,
  height / 2,
  width * 0.05,
  (Math.PI / 180) * 0,
  (Math.PI / 180) * 360,
  false
);
ctx.closePath();
ctx.fill();
ctx.restore();
