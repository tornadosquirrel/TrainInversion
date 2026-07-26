//피아노 생성

const piano = document.querySelector("#piano");

const whiteNotes = [0, 2, 4, 5, 7, 9, 11];
const blackNotes = [1, 3, 6, 8, 10];
let blackIndex = 0;


const whiteLayer = document.createElement("div");
whiteLayer.classList.add("white-layer");
piano.append(whiteLayer);

const blackLayer = document.createElement("div");
blackLayer.classList.add("black-layer");
piano.append(blackLayer);


for (let i = 0; i < 17; i++) {

  const whiteKey = document.createElement("div");

  whiteKey.classList.add("white");

  whiteKey.dataset.index = i;

  const note = whiteNotes[i % 7] + Math.floor(i / 7) * 12;
  whiteKey.dataset.note = note;

  whiteLayer.append(whiteKey);


  if (i % 7 !== 2 && i % 7 !== 6) {

    const blackKey = document.createElement("div");

    blackKey.classList.add("black");

    blackKey.dataset.whiteIndex = i; //whiteIndex 1은 Bb, 2는 Eb, 4는 Gb...

    const note = blackNotes[blackIndex % 5] + Math.floor(blackIndex / 5) * 12;
    blackKey.dataset.note = note;
    blackIndex++;

    const whiteIndex = Number(blackKey.dataset.whiteIndex);

    blackKey.style.left = `calc((${whiteIndex} + 1) * var(--white-width) - var(--black-width) / 2)`;

    blackLayer.append(blackKey);
  }

}

//색칠 없애기 함수
function clearKeys() {

  const keys = document.querySelectorAll(".white, .black");

  keys.forEach(key => {
    key.classList.remove("root");
    key.classList.remove("third");
    key.classList.remove("fifth");
    key.classList.remove("chord-color");
  });

}

//모드들
const modes = ["기본모드", "음 찾기 모드"];
let currentModeIndex = 0;
const modeButton = document.querySelector("#mode");

//색칠하기 함수
function paint(chord) {

  clearKeys();

  const keys = document.querySelectorAll(".white, .black");

  keys.forEach(key => {

    const note = Number(key.dataset.note);

    if (currentModeIndex === 0) {

      if (note === chord.root) {
        key.classList.add("root");
      }

      if (note === chord.third) {
        key.classList.add("third");
      }

      if (note === chord.fifth) {
        key.classList.add("fifth");
      }
    }
    else if (currentModeIndex === 1) {
      if (note === chord.root) {
        key.classList.add("chord-color");
      }

      if (note === chord.third) {
        key.classList.add("chord-color");
      }

      if (note === chord.fifth) {
        key.classList.add("chord-color");
      }
    }

  });

}

//근음들
const roots = [
  { name: "C", note: 0 },
  { name: "D♭", note: 1 },
  { name: "D", note: 2 },
  { name: "E♭", note: 3 },
  { name: "E", note: 4 },
  { name: "F", note: 5 },
  { name: "G♭", note: 6 },
  { name: "G", note: 7 },
  { name: "A♭", note: 8 },
  { name: "A", note: 9 },
  { name: "B♭", note: 10 },
  { name: "B", note: 11 }
]

//36개 코드 모양 생성
const problems = []

for (const root of roots) {

  problems.push({

    name: root.name,
    inversion: 0,
    root: root.note,
    third: root.note + 4,
    fifth: root.note + 7,
  });

  problems.push({

    name: root.name,
    inversion: 1,
    root: root.note + 12,
    third: root.note + 4,
    fifth: root.note + 7,
  });

  problems.push({

    name: root.name,
    inversion: 2,
    root: root.note + 12,
    third: root.note + 16,
    fifth: root.note + 7,
  });

}

//문제 읽기
let currentProblem = 0;
let timer = null;

const chordDisplay = document.querySelector("#chord-display");
const startButton = document.querySelector("#start-btn");
const subDisplay = document.querySelector("#sub-display");

const inversionNames = [
  "기본형",
  "1전위",
  "2전위"
];

const noteNames = ["1음", "3음", "5음"];
let currentNoteIndex = 0;

function renderProblem(problem) {
  chordDisplay.textContent = `${problem.name}`;

}

//문제 띄우기
function showProblem(problem) {

  renderProblem(problem);
  paint(problem);
}


function nextProblem() {

  const problem = problems[currentProblem];

  showProblem(problem);

  currentProblem++;
}

//시작버튼
let isPlaying = false;
let isCycle = false;

let currentCycle = 0;
let maxCycle = 1;

const INTERVAL = 5000;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  timer = setInterval(() => {
    console.log(currentProblem)
    if (currentProblem >= problems.length) {

      clearInterval(timer);

      currentCycle++;

      if (currentCycle < maxCycle) {
        currentProblem = 0;
        currentNoteIndex++;

        chordDisplay.textContent = noteNames[currentNoteIndex];
        subDisplay.textContent = noteNames[currentNoteIndex];

        startTimer();      // 다음 사이클
      } else {
        finishGame();
      }

      return;
    }

    nextProblem();

  }, INTERVAL);
}

async function initCycle() {
  if (!isCycle) {

    shuffle(problems);

    currentProblem = 0;
    currentCycle = 0;
    currentNoteIndex = 0;

    maxCycle = currentModeIndex === 0 ? 1 : 3;

    if (currentModeIndex === 1) {
      chordDisplay.textContent = noteNames[0];
      subDisplay.textContent = noteNames[0];
    }

    isPlaying = true;
    isCycle = true;
    startButton.textContent = "일시정지";

    startTimer();
  }
  else if (isPlaying) {

    clearInterval(timer);
    isPlaying = false;
    startButton.textContent = "다시시작";

  }

  else {

    isPlaying = true;
    startButton.textContent = "일시정지";

    startTimer();
  }
}

function finishGame() {
  isPlaying = false;
  isCycle = false;

  currentCycle = 0;
  currentProblem = 0;
  currentNoteIndex = 0;

  clearKeys();

  chordDisplay.textContent = "전위 연습";
  subDisplay.textContent = "";

  startButton.textContent = "시작";
}

startButton.addEventListener("click", () => {
  initCycle();

});

//모드변경버튼
modeButton.addEventListener("click", () => {
  if (!isPlaying && !isCycle && currentModeIndex === 0) {
    chordDisplay.textContent = `음 찾기 모드`;
    currentModeIndex = (currentModeIndex + 1) % modes.length;
  }
  else if (!isPlaying && !isCycle) {
    chordDisplay.textContent = `전위 연습`;
    currentModeIndex = (currentModeIndex + 1) % modes.length;
  }
})
