import React from 'react';
import { Move } from '../models/RubiksCube';

interface MoveControlsProps {
  onMove: (move: Move) => void;
  disabled?: boolean;
}

export const MoveControls: React.FC<MoveControlsProps> = ({ onMove, disabled = false }) => {
  const moves: Move[] = ['F', 'B', 'L', 'R', 'U', 'D'];
  const inverseMoves: Move[] = ["F'", "B'", "L'", "R'", "U'", "D'"];

  const buttonClass = "w-12 h-12 m-1 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-colors";

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-semibold text-gray-700">Manual Controls</div>
      
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-6 text-center text-sm text-gray-600 mb-2">Clockwise Moves</div>
        {moves.map(move => (
          <button
            key={move}
            onClick={() => onMove(move)}
            disabled={disabled}
            className={buttonClass}
          >
            {move}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-6 text-center text-sm text-gray-600 mb-2">Counter-clockwise Moves</div>
        {inverseMoves.map(move => (
          <button
            key={move}
            onClick={() => onMove(move)}
            disabled={disabled}
            className={buttonClass}
          >
            {move}
          </button>
        ))}
      </div>
    </div>
  );
};