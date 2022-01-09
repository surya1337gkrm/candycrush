import React, { useState, useEffect } from 'react';
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import blank from './images/blank.png';
import ScoreBoard from './components/scoreBoard';

const width = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [colorArrangement, setColorArrangement] = useState([]);
  const [squareDragged, setSquareDragged] = useState(null);
  const [squareReplaced, setSquareReplaced] = useState(null);
  const [score, setScore] = useState(0);

  const checkColOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const colOfThree = [i, i + width, i + width * 2];
      const decidedColor = colorArrangement[i];
      const isBlank = colorArrangement[i] === blank;
      if (
        colOfThree.every(
          (square) => colorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScore((prevScore) => prevScore + 3);
        colOfThree.forEach((sq) => (colorArrangement[sq] = blank));
        return true;
      }
    }
  };

  const checkColOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const colOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = colorArrangement[i];
      const isBlank = colorArrangement[i] === blank;
      if (
        colOfFour.every(
          (square) => colorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScore((prevScore) => prevScore + 4);
        colOfFour.forEach((sq) => (colorArrangement[sq] = blank));
        return true;
      }
    }
  };

  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = colorArrangement[i];
      const isBlank = colorArrangement[i] === blank;
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => colorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScore((prevScore) => prevScore + 3);
        rowOfThree.forEach((sq) => (colorArrangement[sq] = blank));
        return true;
      }
    }
  };

  const checkRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = colorArrangement[i];
      const isBlank = colorArrangement[i] === blank;
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 61, 62, 63,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (square) => colorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScore((prevScore) => prevScore + 4);
        rowOfFour.forEach((sq) => (colorArrangement[sq] = blank));
        return true;
      }
    }
  };

  const moveSquares = () => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && colorArrangement[i] === blank) {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        colorArrangement[i] = candyColors[randomColor];
      }
      if (colorArrangement[i + width] === blank) {
        colorArrangement[i + width] = colorArrangement[i];
        colorArrangement[i] = blank;
      }
    }
  };

  const dragStart = (e) => {
    setSquareDragged(e.target);
  };
  const dragDrop = (e) => {
    setSquareReplaced(e.target);
  };
  const dragEnd = (e) => {
    const squreDraggedID = +squareDragged.getAttribute('data-id');
    const squreReplacedID = +squareReplaced.getAttribute('data-id');

    colorArrangement[squreReplacedID] = squareDragged.getAttribute('src');
    colorArrangement[squreDraggedID] = squareReplaced.getAttribute('src');

    const validMoves = [
      squreDraggedID - 1,
      squreDraggedID + 1,
      squreDraggedID - width,
      squreDraggedID + width,
    ];

    const validMove = validMoves.includes(squreReplacedID);

    const isColOfFour = checkColOfFour();
    const isColOfThree = checkColOfThree();
    const isRowOfFour = checkRowOfFour();
    const isRowOfThree = checkRowOfThree();

    if (
      squreReplacedID &&
      validMove &&
      (isColOfFour || isColOfThree || isRowOfFour || isRowOfThree)
    ) {
      setSquareDragged(null);
      setSquareReplaced(null);
    } else {
      colorArrangement[squreReplacedID] = squareReplaced.getAttribute('src');
      colorArrangement[squreDraggedID] = squareDragged.getAttribute('src');
      setColorArrangement([...colorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkColOfFour();
      checkColOfThree();
      checkRowOfFour();
      checkRowOfThree();
      moveSquares();

      setColorArrangement([...colorArrangement]);
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [
    checkColOfThree,
    checkColOfFour,
    checkRowOfFour,
    checkRowOfThree,
    moveSquares,
    colorArrangement,
  ]);

  return (
    <div className='app'>
      <div className='game'>
        {colorArrangement.map((candyColor, i) => (
          <img
            key={i}
            src={candyColor}
            style={{ backgroundColor: candyColor }}
            alt={candyColor}
            data-id={i}
            draggable={true}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
            }}
            onDrop={dragDrop}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <br/>
      <ScoreBoard score={score} />
    </div>
  );
};

export default App;
