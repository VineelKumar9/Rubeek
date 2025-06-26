import React, { useState } from 'react';
import { SolveStep } from '../models/CubeSolver';
import { CubeVisualizer } from './CubeVisualizer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SolutionViewerProps {
  steps: SolveStep[];
  onClose: () => void;
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">No Solution Steps</h2>
          <p className="text-gray-600 mb-4">The cube is already solved!</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Solution Steps</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Step {currentStep + 1} of {steps.length}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="font-semibold text-lg mb-2">Move: {currentStepData.move}</div>
              <div className="text-gray-700">{currentStepData.description}</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <CubeVisualizer cubeState={currentStepData.cubeState} />
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            First Step
          </button>
          <button
            onClick={() => setCurrentStep(steps.length - 1)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Final Step
          </button>
        </div>
      </div>
    </div>
  );
};