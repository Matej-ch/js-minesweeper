document.addEventListener('DOMContentLoaded', () => {
  let squares = [];

  const outputEls = {
    flagsLeft: document.querySelector('#flags-left'),
    result: document.querySelector('#result'),
    grid: document.querySelector('.grid'),
  }

  const gameState = {
    isGameOver: false,
    flags: 0,
    width: 10,
    bombAmount: parseInt(document.getElementById('js-bombs-input').value),
    difficulty: document.getElementById('js-difficulty-input').value,
  }

  //create board
  function shuffleArray(gameArray) {
    let length = gameArray.length;
    let shuffledArray = new Array(length);
    let taken = new Array(length);

    let n = gameArray.length;
    while (n--) {
      let x = Math.floor(Math.random() * length);
      shuffledArray[n] = gameArray[x in taken ? taken[x] : x];
      taken[x] = --length in taken ? taken[length] : length;
    }

    return shuffledArray;
  }

  function createBoard() {

    outputEls.flagsLeft.innerHTML = `${gameState.bombAmount}`;

    //random bombs set
    const bombsArray = Array(gameState.bombAmount).fill('bomb');

    // clean tiles without bombs
    const emptyArray = Array(gameState.width * gameState.width - gameState.bombAmount).fill('valid');

    const gameArray = emptyArray.concat(bombsArray);

    let shuffledArray = shuffleArray(gameArray);

    for (let i = 0; i < gameState.width * gameState.width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', `${i}`);
      square.classList.add(shuffledArray[i]);
      outputEls.grid.appendChild(square);
      squares.push(square);

      square.addEventListener('click', function (e) {
        click(square);
      })

      square.oncontextmenu = function (e) {
        e.preventDefault()
        addFlag(square)
      }
    }


    for (let i = 0; i < squares.length; i++) {

      let total = 0;

      const isLeftEdge = (i % gameState.width === 0);
      const isRightEdge = (i % gameState.width === gameState.width - 1);

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
          total++
        }

        if (i > 9 && !isRightEdge && squares[i + 1 - gameState.width].classList.contains('bomb')) {
          total++
        }

        if (i > 10 && squares[i - gameState.width].classList.contains('bomb')) {
          total++
        }

        if (i > 11 && !isLeftEdge && squares[i - 1 - gameState.width].classList.contains('bomb')) {
          total++
        }

        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
          total++
        }

        if (i < 90 && !isLeftEdge && squares[i - 1 + gameState.width].classList.contains('bomb')) {
          total++
        }

        if (i < 88 && !isRightEdge && squares[i + 1 + gameState.width].classList.contains('bomb')) {
          total++
        }

        if (i < 89 && squares[i + gameState.width].classList.contains('bomb')) {
          total++
        }

        squares[i].setAttribute('data', total);
      }
    }
  }

  createBoard();

  function addFlag(square) {
    if (gameState.isGameOver) return
    if (!square.classList.contains('checked') && (gameState.flags < gameState.bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = '🚩'
        gameState.flags++
        outputEls.flagsLeft.innerHTML = `${gameState.bombAmount - gameState.flags}`
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        gameState.flags--
        outputEls.flagsLeft.innerHTML = `${gameState.bombAmount - gameState.flags}`
      }
    }
  }

  function click(square) {
    let currentId = square.id;
    if (gameState.isGameOver) return;

    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    if (square.classList.contains('bomb')) {

      gameOver(square);

    } else {
      let total = square.getAttribute('data');

      if (parseInt(total) !== 0) {
        square.classList.add('checked');
        if (parseInt(total) === 1) square.classList.add('one');
        if (parseInt(total) === 2) square.classList.add('two');
        if (parseInt(total) === 3) square.classList.add('three');
        if (parseInt(total) === 4) square.classList.add('four');
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add('checked');
  }

  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % gameState.width === 0);
    const isRightEdge = (currentId % gameState.width === gameState.width - 1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + gameState.width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

    }, 10)
  }

  function gameOver() {
    outputEls.result.innerHTML = 'Boom goes the dynamite'
    outputEls.result.classList.add('lose');
    gameState.isGameOver = true;

    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = "💣";
        square.classList.remove('bomb');
        square.classList.add('checked');
      }
    })
  }

  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === gameState.bombAmount) {
        outputEls.result.innerHTML = 'YOU WIN!'
        outputEls.result.classList.add('win');
        gameState.isGameOver = true
      }
    }
  }


  function resetGame() {
    outputEls.grid = document.querySelector('.grid');
    outputEls.flagsLeft = document.querySelector('#flags-left')
    outputEls.result = document.querySelector('#result');
    outputEls.result.classList.remove('win', 'lose');
    gameState.width = 10;
    gameState.bombAmount = parseInt(document.getElementById('js-bombs-input').value);
    gameState.flags = 0;
    squares = [];
    gameState.isGameOver = false;
    document.getElementById('grid').style.width = `${gameState.width * 40}px`;
    document.getElementById('grid').style.height = `${gameState.width * 40}px`;
    createBoard();
  }

  function playAgain() {

  }

  document.querySelector('body').addEventListener('click', e => {
    if (e.target.id === 'js-reset') {
      resetGame();
    }

    if (e.target.id === 'js-play') {
      playAgain();
    }
  })
})
