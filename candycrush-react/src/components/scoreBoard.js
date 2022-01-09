import React from 'react';
const ScoreBoard = ({ score }) => {
  return (
    <div className='score-board'>
      <h4>Score : {score}</h4>
    </div>
  );
};

export default ScoreBoard;
