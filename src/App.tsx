import React, { useState, useRef } from 'react';
import { RubiksCube, Move } from './RubiksCube';
import { CubeSolver, SolveStep } from './CubeSolver';
import { getCubeSvg } from './CubeRenderer';
import { Play, RotateCcw, Shuffle, Square, ChevronRight, ChevronLeft } from 'lucide-react';

function App() {
  const [cube] = useState(() => new RubiksCube());
  const [cubeState, setCubeState] = useState(cube.getCubeString());
  const [isScrambled, setIsScrambled] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<SolveStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrambleMoves, setScrambleMoves] = useState<Move[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCubeDisplay = () => {
    setCubeState(cube.getCubeString());
  };

  const handleMove = (move: Move) => {
    cube.move(move);
    updateCubeDisplay();
  };

  const handleScramble = () => {
    cube.reset();
    const moves = cube.scramble(20);
    setScrambleMoves(moves);
    setIsScrambled(true);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
    updateCubeDisplay();
  };

  const handleReset = () => {
    cube.reset();
    setIsScrambled(false);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
    setScrambleMoves([]);
    setIsPlaying(false);
    updateCubeDisplay();
  };

  const handleSolve = () => {
    if (!isScrambled) {
      alert('Please scramble the cube first!');
      return;
    }
    
    const solver = new CubeSolver(cube);
    const steps = solver.solve();
    setSolutionSteps(steps);
    setCurrentStepIndex(0);
  };

  const playNextStep = () => {
    if (currentStepIndex < solutionSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const toggleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(playNextStep, 2000);
    }
  };

  const moves: Move[] = ['F', 'R', 'B', 'L', 'U', 'D', "F'", "R'", "B'", "L'", "U'", "D'"];

  const currentStep = solutionSteps[currentStepIndex];
  const displayCubeState = currentStep ? currentStep.cubeState : cubeState;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rubik's Cube Solver</h1>
          <p className="text-gray-600">Object-oriented cube solver with step-by-step visualization</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cube Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Square className="mr-2" />
              Cube Visualization
            </h2>
            
            <div className="flex justify-center mb-6">
              <div 
                className="border rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: getCubeSvg(displayCubeState, 300) }}
              />
            </div>

            {/* Cube Status */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                cube.isSolved() 
                  ? 'bg-green-100 text-green-800'
                  : isScrambled 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {cube.isSolved() ? '✓ Solved' : isScrambled ? '✗ Scrambled' : '● Ready'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleScramble}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Scramble
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              
              <button
                onClick={handleSolve}
                disabled={!isScrambled}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Solve
              </button>
            </div>

            {/* Scramble Moves Display */}
            {scrambleMoves.length > 0 && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Scramble Sequence:</h4>
                <div className="flex flex-wrap gap-1">
                  {scrambleMoves.map((move, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm">
                      {move}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls and Solution */}
          <div className="space-y-6">
            {/* Manual Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Manual Controls</h2>
              <div className="grid grid-cols-6 gap-2">
                {moves.map((move) => (
                  <button
                    key={move}
                    onClick={() => handleMove(move)}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-mono text-sm"
                  >
                    {move}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Click moves to manually rotate cube faces. ' indicates counter-clockwise rotation.
              </p>
            </div>

            {/* Solution Steps */}
            {solutionSteps.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Solution Steps</h2>
                
                {/* Step Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={playPrevStep}
                    disabled={currentStepIndex === 0}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Step {currentStepIndex + 1} of {solutionSteps.length}
                    </span>
                    <button
                      onClick={toggleAutoPlay}
                      className={`flex items-center px-4 py-2 rounded transition-colors ${
                        isPlaying 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isPlaying ? 'Stop' : 'Auto Play'}
                    </button>
                  </div>
                  
                  <button
                    onClick={playNextStep}
                    disabled={currentStepIndex >= solutionSteps.length - 1}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Step Display */}
                {currentStep && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{currentStep.description}</h4>
                    {currentStep.moves.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-sm text-gray-600 mr-2">Moves:</span>
                        {currentStep.moves.map((move, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm font-mono">
                            {move}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / solutionSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Object-Oriented Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• RubiksCube class handles state and rotations</li>
                <li>• CubeSolver implements layer-by-layer solving</li>
                <li>• Modular architecture with clean separation</li>
                <li>• Type-safe implementation with TypeScript</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Solving Algorithm</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Step 1: Solve white cross on bottom</li>
                <li>• Step 2: Complete white layer corners</li>
                <li>• Step 3: Solve middle layer edges</li>
                <li>• Step 4-7: Solve yellow layer (OLL/PLL)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;