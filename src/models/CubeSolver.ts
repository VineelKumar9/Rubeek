import { RubiksCube, Move, CubeState } from './RubiksCube';

export interface SolveStep {
  move: Move;
  cubeState: CubeState;
  description: string;
}

export class CubeSolver {
  private cube: RubiksCube;
  private solutionSteps: SolveStep[] = [];

  constructor(cube: RubiksCube) {
    this.cube = cube;
  }

  public solve(): SolveStep[] {
    this.solutionSteps = [];
    
    if (this.cube.isSolved()) {
      return this.solutionSteps;
    }

    // Simple layer-by-layer solving approach
    // This is a basic implementation focusing on functionality
    this.solveWhiteCross();
    this.solveWhiteCorners();
    this.solveMiddleLayer();
    this.solveYellowCross();
    this.solveYellowCorners();
    this.positionLastLayer();
    this.orientLastLayer();

    return this.solutionSteps;
  }

  private executeMove(move: Move, description: string): void {
    this.cube.executeMove(move);
    this.solutionSteps.push({
      move,
      cubeState: this.cube.getState(),
      description
    });
  }

  private solveWhiteCross(): void {
    // Simplified white cross solving
    // This is a basic implementation that tries to get white edges to the correct position
    for (let attempts = 0; attempts < 20 && !this.isWhiteCrossSolved(); attempts++) {
      this.executeMove('F', 'Working on white cross - front rotation');
      if (this.isWhiteCrossSolved()) break;
      this.executeMove('R', 'Working on white cross - right rotation');
      if (this.isWhiteCrossSolved()) break;
      this.executeMove('U', 'Working on white cross - up rotation');
      if (this.isWhiteCrossSolved()) break;
      this.executeMove('D', 'Working on white cross - down rotation');
    }
  }

  private isWhiteCrossSolved(): boolean {
    const state = this.cube.getState();
    return (
      state.F[1][1] === 'w' && state.F[0][1] === 'w' && state.F[1][0] === 'w' && 
      state.F[1][2] === 'w' && state.F[2][1] === 'w'
    );
  }

  private solveWhiteCorners(): void {
    // Simplified white corner solving
    for (let attempts = 0; attempts < 15 && !this.areWhiteCornersSolved(); attempts++) {
      this.executeMove('R', 'Positioning white corners - right rotation');
      this.executeMove('U', 'Positioning white corners - up rotation');
      this.executeMove("R'", 'Positioning white corners - right inverse');
      this.executeMove("U'", 'Positioning white corners - up inverse');
    }
  }

  private areWhiteCornersSolved(): boolean {
    const state = this.cube.getState();
    return (
      state.F[0][0] === 'w' && state.F[0][2] === 'w' && 
      state.F[2][0] === 'w' && state.F[2][2] === 'w'
    );
  }

  private solveMiddleLayer(): void {
    // Simplified middle layer solving
    for (let attempts = 0; attempts < 20; attempts++) {
      this.executeMove('R', 'Working on middle layer - right rotation');
      this.executeMove('U', 'Working on middle layer - up rotation');
      this.executeMove("R'", 'Working on middle layer - right inverse');
      this.executeMove("U'", 'Working on middle layer - up inverse');
      this.executeMove("F'", 'Working on middle layer - front inverse');
      this.executeMove('U', 'Working on middle layer - up rotation');
      this.executeMove('F', 'Working on middle layer - front rotation');
    }
  }

  private solveYellowCross(): void {
    // OLL (Orientation of Last Layer) - Yellow cross
    for (let attempts = 0; attempts < 10; attempts++) {
      this.executeMove('F', 'Creating yellow cross - F');
      this.executeMove('R', 'Creating yellow cross - R');
      this.executeMove('U', 'Creating yellow cross - U');
      this.executeMove("R'", 'Creating yellow cross - R\'');
      this.executeMove("U'", 'Creating yellow cross - U\'');
      this.executeMove("F'", 'Creating yellow cross - F\'');
    }
  }

  private solveYellowCorners(): void {
    // OLL - Orient yellow corners
    for (let attempts = 0; attempts < 15; attempts++) {
      this.executeMove('R', 'Orienting yellow corners - R');
      this.executeMove('U', 'Orienting yellow corners - U');
      this.executeMove("R'", 'Orienting yellow corners - R\'');
      this.executeMove('U', 'Orienting yellow corners - U');
      this.executeMove('R', 'Orienting yellow corners - R');
      this.executeMove('U', 'Orienting yellow corners - U');
      this.executeMove('U', 'Orienting yellow corners - U');
      this.executeMove("R'", 'Orienting yellow corners - R\'');
    }
  }

  private positionLastLayer(): void {
    // PLL (Permutation of Last Layer) - Position corners
    for (let attempts = 0; attempts < 8; attempts++) {
      this.executeMove("R'", 'Positioning last layer - R\'');
      this.executeMove('F', 'Positioning last layer - F');
      this.executeMove("R'", 'Positioning last layer - R\'');
      this.executeMove('B', 'Positioning last layer - B');
      this.executeMove('B', 'Positioning last layer - B');
      this.executeMove('R', 'Positioning last layer - R');
      this.executeMove("F'", 'Positioning last layer - F\'');
      this.executeMove("R'", 'Positioning last layer - R\'');
      this.executeMove('B', 'Positioning last layer - B');
      this.executeMove('B', 'Positioning last layer - B');
      this.executeMove('R', 'Positioning last layer - R');
      this.executeMove('R', 'Positioning last layer - R');
      this.executeMove("U'", 'Positioning last layer - U\'');
    }
  }

  private orientLastLayer(): void {
    // Final adjustments
    for (let attempts = 0; attempts < 5; attempts++) {
      this.executeMove('R', 'Final orientation - R');
      this.executeMove('U', 'Final orientation - U');
      this.executeMove("R'", 'Final orientation - R\'');
      this.executeMove("F'", 'Final orientation - F\'');
      this.executeMove('R', 'Final orientation - R');
      this.executeMove('F', 'Final orientation - F');
    }
  }
}