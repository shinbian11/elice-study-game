let data = [];

// generateRandom() : 회전 각도 0 ~ 360도
generateRandom = () => {
  let min = 0;
  let max = 360;
  return Math.floor(Math.random() * (max - min));
};

// rotateRoulette() : 돌림판 회전시작
rotateRoulette = () => {
  return new Promise((resolve) => {
    let randomDeg = generateRandom();
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
        panel.style.transform = "rotate(" + randomDeg + "deg)";
      }
    }, 50);
    resolve(randomDeg);
  });
};

// displayResult() : 룰렛 결과 메세지를 보여줌
displayResult = (randomDeg) => {
  let answerDeg = degreesToRadians(randomDeg);
  // console.log("당첨각도 : ", degreesToRadians((answerDeg + 270) % 360));
  console.log("당첨각도, 라디안 : ", randomDeg, answerDeg);
  return new Promise((resolve) => {
    setTimeout(() => {
      let message = ["", ""];
      data.forEach((d) => {
        console.log("시작각도 끝각도 데이터 : ", d.first, d.last, d.text);
      });
      // if (randomDeg <= 30 || randomDeg >= 330) {
      //   message[0] = "당첨!!";
      //   message[1] = "CU 3,000원 상품권";
      // } else if (randomDeg >= 90 && randomDeg <= 150) {
      //   message[0] = "당첨!!";
      //   message[1] = "스타벅스 아메리카노";
      // } else if (randomDeg >= 210 && randomDeg <= 270) {
      //   message[0] = "당첨!!";
      //   message[1] = "햄버거 세트 교환권";
      // } else {
      //   message[0] = "꽝!!";
      //   message[1] = "다음 기회에";
      // }

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
        right.style.backgroundColor = "aquamarine";
        right.style.opacity = 1;
        result.style.display = "none";
        resolve(true);
      });
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
  let res = await rotateRoulette();
  console.log(res);
  res = await displayResult(res);
  if (res === true) {
    console.log(res);
    res = await resetRoulette();
    console.log(res);
    res = await enabledRoulette();
    console.log(res);
  }
};

degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// addInput() : 선택지 추가
addInput = () => {
  let customize = document.querySelectorAll("#customize");

  if (customize.length < 8) {
    let El = `<input type="text" id="customize" placeholder="원하는 선택지를 추가해주세요"/>`;
    userText.insertAdjacentHTML("beforeend", El);
  } else {
    alert("8개 이상의 선택지를 만들 수 없습니다");
  }
};

// renderRoulette() :  룰렛 그리기
renderRoulette = () => {
  rouletteCanvas.style.display = "block";
  let customize = document.querySelectorAll("#customize");
  let len = customize.length;
  // customize.forEach((data) => console.log(data.value));

  const canvas = document.querySelector(".roulette-panel");
  let width = canvas.width;
  let height = canvas.height;
  const ctx = canvas.getContext("2d");

  // ctx 초기화
  ctx.clearRect(0, 0, width, height);

  const devide = len; // 나눌 개수
  const degree = 360; // 전체는 360도
  const goalDegree = 270 + degree / devide; // 목표지점에서 끝부분 값

  for (let i = 0; i < devide; i++) {
    let json = {
      first: (degree / devide) * i,
      last: (degree / devide) * (i + 1),
      text: `${i + 1}번`,
    };
    data.push(json);
  }

  // 부채꼴을 그리기

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
      degreesToRadians(item.first),
      degreesToRadians(item.last),
      false
    );

    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    let half = Math.abs(item.first - item.last) / 2;
    let degg = item.first + half;
    let xx = ((Math.cos(degreesToRadians(degg)) * width) / 2) * 0.7 + width / 2;
    let yy =
      ((Math.sin(degreesToRadians(degg)) * width) / 2) * 0.7 + height / 2;
    let minus = ctx.measureText(item.text).width / 2;

    ctx.font = "bold 15px sans-serif";
    ctx.fillText(item.text, xx - minus, yy);
    ctx.restore();
  });

  // 원을 그리기
  // ctx.save();
  // ctx.beginPath();
  // ctx.lineWidth = 2;
  // ctx.fillStyle = "#B4B4B4";
  // ctx.moveTo(width / 2, height / 2);
  // ctx.arc(
  //   width / 2,
  //   height / 2,
  //   width * 0.05,
  //   (Math.PI / 180) * 0,
  //   (Math.PI / 180) * 360,
  //   false
  // );

  // ctx.closePath();

  // ctx.fill();
  // ctx.restore();
};

let panel = document.querySelector(".roulette-panel");
let btn = document.querySelector(".roulette-btn");
let rouletteCanvas = document.querySelector(".roulette-canvas");
let result = document.querySelector(".result");
let resultText = result.querySelectorAll("p");
let retryBtn = document.querySelector(".btn_again");
let left = document.querySelector(".roulette");
let right = document.querySelector(".userCustomize");
let userText = document.querySelector(".userText");
let addBtn = document.querySelector("#addBtn");
let startBtn = document.querySelector("#startBtn");

btn.addEventListener("click", btnClick);
addBtn.addEventListener("click", addInput);
startBtn.addEventListener("click", renderRoulette);

// 참고한 링크
// https://jnoony-code.tistory.com/19
// https://lts0606.tistory.com/572?category=800911
// https://ko.javascript.info/settimeout-setinterval
// http://www.devdic.com/javascript/refer/dom/method:1585/animate()
// https://webdir.tistory.com/506
// https://webzz.tistory.com/369
// https://api.jquery.com/animate
// 기타 등등
