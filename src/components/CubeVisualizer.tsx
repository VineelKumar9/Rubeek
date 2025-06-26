import React from 'react';
import { CubeState, CubeColor } from '../models/RubiksCube';

interface CubeVisualizerProps {
  cubeState: CubeState;
  className?: string;
}

const colorMap: Record<CubeColor, string> = {
  'w': '#FFFFFF', // White
  'y': '#FFFF00', // Yellow
  'r': '#FF0000', // Red
  'o': '#FFA500', // Orange
  'b': '#0000FF', // Blue  
  'g': '#00FF00', // Green
};

export const CubeVisualizer: React.FC<CubeVisualizerProps> = ({ cubeState, className = '' }) => {
  const renderFace = (face: CubeColor[][], faceLabel: string, x: number, y: number) => {
    return (
      <g key={faceLabel} transform={`translate(${x}, ${y})`}>
        <text x="45" y="-10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
          {faceLabel}
        </text>
        {face.map((row, i) =>
          row.map((color, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * 30}
              y={i * 30}
              width="28"
              height="28"
              fill={colorMap[color]}
              stroke="#333"
              strokeWidth="2"
              rx="2"
            />
          ))
        )}
      </g>
    );
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <svg width="450" height="360" viewBox="0 0 450 360" className="border border-gray-300 rounded-lg bg-gray-50">
        {/* Layout: Unfolded cube view */}
        {/* Top row: Up face */}
        {renderFace(cubeState.U, 'U', 135, 20)}
        
        {/* Middle row: Left, Front, Right, Back */}
        {renderFace(cubeState.L, 'L', 45, 110)}
        {renderFace(cubeState.F, 'F', 135, 110)}
        {renderFace(cubeState.R, 'R', 225, 110)}
        {renderFace(cubeState.B, 'B', 315, 110)}
        
        {/* Bottom row: Down face */}
        {renderFace(cubeState.D, 'D', 135, 200)}
        
        {/* Legend */}
        <g transform="translate(20, 280)">
          <text x="0" y="0" fontSize="12" fontWeight="bold" fill="#333">Colors:</text>
          {Object.entries(colorMap).map(([letter, color], index) => (
            <g key={letter} transform={`translate(${index * 60}, 15)`}>
              <rect x="0" y="0" width="15" height="15" fill={color} stroke="#333" strokeWidth="1" rx="1"/>
              <text x="20" y="12" fontSize="11" fill="#333">{letter.toUpperCase()}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};