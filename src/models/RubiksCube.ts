export type CubeColor = 'w' | 'y' | 'r' | 'o' | 'b' | 'g';
export type Face = CubeColor[][];
export type CubeState = {
  F: Face; // Front
  B: Face; // Back
  L: Face; // Left
  R: Face; // Right
  U: Face; // Up
  D: Face; // Down
};

export type Move = 'F' | 'B' | 'L' | 'R' | 'U' | 'D' | "F'" | "B'" | "L'" | "R'" | "U'" | "D'";

export class RubiksCube {
  private state: CubeState;
  private moveHistory: Move[] = [];

  constructor(initialState?: CubeState) {
    if (initialState) {
      this.state = this.deepCopyState(initialState);
    } else {
      this.state = this.createSolvedCube();
    }
  }

  private createSolvedCube(): CubeState {
    return {
      F: [['w', 'w', 'w'], ['w', 'w', 'w'], ['w', 'w', 'w']], // Front - White
      B: [['y', 'y', 'y'], ['y', 'y', 'y'], ['y', 'y', 'y']], // Back - Yellow
      L: [['g', 'g', 'g'], ['g', 'g', 'g'], ['g', 'g', 'g']], // Left - Green
      R: [['b', 'b', 'b'], ['b', 'b', 'b'], ['b', 'b', 'b']], // Right - Blue
      U: [['r', 'r', 'r'], ['r', 'r', 'r'], ['r', 'r', 'r']], // Up - Red
      D: [['o', 'o', 'o'], ['o', 'o', 'o'], ['o', 'o', 'o']]  // Down - Orange
    };
  }

  private deepCopyState(state: CubeState): CubeState {
    const copy: CubeState = {} as CubeState;
    Object.keys(state).forEach(face => {
      copy[face as keyof CubeState] = state[face as keyof CubeState].map(row => [...row]);
    });
    return copy;
  }

  private rotateFaceClockwise(face: Face): Face {
    const newFace: Face = [['w', 'w', 'w'], ['w', 'w', 'w'], ['w', 'w', 'w']];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newFace[j][2 - i] = face[i][j];
      }
    }
    return newFace;
  }

  private rotateFaceCounterClockwise(face: Face): Face {
    const newFace: Face = [['w', 'w', 'w'], ['w', 'w', 'w'], ['w', 'w', 'w']];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newFace[2 - j][i] = face[i][j];
      }
    }
    return newFace;
  }

  public executeMove(move: Move): void {
    const newState = this.deepCopyState(this.state);
    
    switch (move) {
      case 'F':
        this.rotateFront(newState, true);
        break;
      case "F'":
        this.rotateFront(newState, false);
        break;
      case 'B':
        this.rotateBack(newState, true);
        break;
      case "B'":
        this.rotateBack(newState, false);
        break;
      case 'L':
        this.rotateLeft(newState, true);
        break;
      case "L'":
        this.rotateLeft(newState, false);
        break;
      case 'R':
        this.rotateRight(newState, true);
        break;
      case "R'":
        this.rotateRight(newState, false);
        break;
      case 'U':
        this.rotateUp(newState, true);
        break;
      case "U'":
        this.rotateUp(newState, false);
        break;
      case 'D':
        this.rotateDown(newState, true);
        break;
      case "D'":
        this.rotateDown(newState, false);
        break;
    }
    
    this.state = newState;
    this.moveHistory.push(move);
  }

  private rotateFront(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.F = this.rotateFaceClockwise(state.F);
      // Rotate adjacent edges
      const temp = [state.U[2][0], state.U[2][1], state.U[2][2]];
      state.U[2][0] = state.L[2][2];
      state.U[2][1] = state.L[1][2];
      state.U[2][2] = state.L[0][2];
      state.L[0][2] = state.D[0][2];
      state.L[1][2] = state.D[0][1];
      state.L[2][2] = state.D[0][0];
      state.D[0][0] = state.R[2][0];
      state.D[0][1] = state.R[1][0];
      state.D[0][2] = state.R[0][0];
      state.R[0][0] = temp[0];
      state.R[1][0] = temp[1];
      state.R[2][0] = temp[2];
    } else {
      state.F = this.rotateFaceCounterClockwise(state.F);
      // Rotate adjacent edges (reverse)
      const temp = [state.U[2][0], state.U[2][1], state.U[2][2]];
      state.U[2][0] = state.R[0][0];
      state.U[2][1] = state.R[1][0];
      state.U[2][2] = state.R[2][0];
      state.R[0][0] = state.D[0][2];
      state.R[1][0] = state.D[0][1];
      state.R[2][0] = state.D[0][0];
      state.D[0][0] = state.L[2][2];
      state.D[0][1] = state.L[1][2];
      state.D[0][2] = state.L[0][2];
      state.L[0][2] = temp[2];
      state.L[1][2] = temp[1];
      state.L[2][2] = temp[0];
    }
  }

  private rotateBack(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.B = this.rotateFaceClockwise(state.B);
      const temp = [state.U[0][0], state.U[0][1], state.U[0][2]];
      state.U[0][0] = state.R[0][2];
      state.U[0][1] = state.R[1][2];
      state.U[0][2] = state.R[2][2];
      state.R[0][2] = state.D[2][2];
      state.R[1][2] = state.D[2][1];
      state.R[2][2] = state.D[2][0];
      state.D[2][0] = state.L[2][0];
      state.D[2][1] = state.L[1][0];
      state.D[2][2] = state.L[0][0];
      state.L[0][0] = temp[2];
      state.L[1][0] = temp[1];
      state.L[2][0] = temp[0];
    } else {
      state.B = this.rotateFaceCounterClockwise(state.B);
      const temp = [state.U[0][0], state.U[0][1], state.U[0][2]];
      state.U[0][0] = state.L[2][0];
      state.U[0][1] = state.L[1][0];
      state.U[0][2] = state.L[0][0];
      state.L[0][0] = state.D[2][2];
      state.L[1][0] = state.D[2][1];
      state.L[2][0] = state.D[2][0];
      state.D[2][0] = state.R[2][2];
      state.D[2][1] = state.R[1][2];
      state.D[2][2] = state.R[0][2];
      state.R[0][2] = temp[0];
      state.R[1][2] = temp[1];
      state.R[2][2] = temp[2];
    }
  }

  private rotateLeft(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.L = this.rotateFaceClockwise(state.L);
      const temp = [state.U[0][0], state.U[1][0], state.U[2][0]];
      state.U[0][0] = state.B[2][2];
      state.U[1][0] = state.B[1][2];
      state.U[2][0] = state.B[0][2];
      state.B[0][2] = state.D[2][0];
      state.B[1][2] = state.D[1][0];
      state.B[2][2] = state.D[0][0];
      state.D[0][0] = state.F[0][0];
      state.D[1][0] = state.F[1][0];
      state.D[2][0] = state.F[2][0];
      state.F[0][0] = temp[0];
      state.F[1][0] = temp[1];
      state.F[2][0] = temp[2];
    } else {
      state.L = this.rotateFaceCounterClockwise(state.L);
      const temp = [state.U[0][0], state.U[1][0], state.U[2][0]];
      state.U[0][0] = state.F[0][0];
      state.U[1][0] = state.F[1][0];
      state.U[2][0] = state.F[2][0];
      state.F[0][0] = state.D[0][0];
      state.F[1][0] = state.D[1][0];
      state.F[2][0] = state.D[2][0];
      state.D[0][0] = state.B[2][2];
      state.D[1][0] = state.B[1][2];
      state.D[2][0] = state.B[0][2];
      state.B[0][2] = temp[2];
      state.B[1][2] = temp[1];
      state.B[2][2] = temp[0];
    }
  }

  private rotateRight(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.R = this.rotateFaceClockwise(state.R);
      const temp = [state.U[0][2], state.U[1][2], state.U[2][2]];
      state.U[0][2] = state.F[0][2];
      state.U[1][2] = state.F[1][2];
      state.U[2][2] = state.F[2][2];
      state.F[0][2] = state.D[0][2];
      state.F[1][2] = state.D[1][2];
      state.F[2][2] = state.D[2][2];
      state.D[0][2] = state.B[2][0];
      state.D[1][2] = state.B[1][0];
      state.D[2][2] = state.B[0][0];
      state.B[0][0] = temp[2];
      state.B[1][0] = temp[1];
      state.B[2][0] = temp[0];
    } else {
      state.R = this.rotateFaceCounterClockwise(state.R);
      const temp = [state.U[0][2], state.U[1][2], state.U[2][2]];
      state.U[0][2] = state.B[2][0];
      state.U[1][2] = state.B[1][0];
      state.U[2][2] = state.B[0][0];
      state.B[0][0] = state.D[2][2];
      state.B[1][0] = state.D[1][2];
      state.B[2][0] = state.D[0][2];
      state.D[0][2] = state.F[0][2];
      state.D[1][2] = state.F[1][2];
      state.D[2][2] = state.F[2][2];
      state.F[0][2] = temp[0];
      state.F[1][2] = temp[1];
      state.F[2][2] = temp[2];
    }
  }

  private rotateUp(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.U = this.rotateFaceClockwise(state.U);
      const temp = [state.F[0][0], state.F[0][1], state.F[0][2]];
      state.F[0][0] = state.R[0][0];
      state.F[0][1] = state.R[0][1];
      state.F[0][2] = state.R[0][2];
      state.R[0][0] = state.B[0][0];
      state.R[0][1] = state.B[0][1];
      state.R[0][2] = state.B[0][2];
      state.B[0][0] = state.L[0][0];
      state.B[0][1] = state.L[0][1];
      state.B[0][2] = state.L[0][2];
      state.L[0][0] = temp[0];
      state.L[0][1] = temp[1];
      state.L[0][2] = temp[2];
    } else {
      state.U = this.rotateFaceCounterClockwise(state.U);
      const temp = [state.F[0][0], state.F[0][1], state.F[0][2]];
      state.F[0][0] = state.L[0][0];
      state.F[0][1] = state.L[0][1];
      state.F[0][2] = state.L[0][2];
      state.L[0][0] = state.B[0][0];
      state.L[0][1] = state.B[0][1];
      state.L[0][2] = state.B[0][2];
      state.B[0][0] = state.R[0][0];
      state.B[0][1] = state.R[0][1];
      state.B[0][2] = state.R[0][2];
      state.R[0][0] = temp[0];
      state.R[0][1] = temp[1];
      state.R[0][2] = temp[2];
    }
  }

  private rotateDown(state: CubeState, clockwise: boolean): void {
    if (clockwise) {
      state.D = this.rotateFaceClockwise(state.D);
      const temp = [state.F[2][0], state.F[2][1], state.F[2][2]];
      state.F[2][0] = state.L[2][0];
      state.F[2][1] = state.L[2][1];
      state.F[2][2] = state.L[2][2];
      state.L[2][0] = state.B[2][0];
      state.L[2][1] = state.B[2][1];
      state.L[2][2] = state.B[2][2];
      state.B[2][0] = state.R[2][0];
      state.B[2][1] = state.R[2][1];
      state.B[2][2] = state.R[2][2];
      state.R[2][0] = temp[0];
      state.R[2][1] = temp[1];
      state.R[2][2] = temp[2];
    } else {
      state.D = this.rotateFaceCounterClockwise(state.D);
      const temp = [state.F[2][0], state.F[2][1], state.F[2][2]];
      state.F[2][0] = state.R[2][0];
      state.F[2][1] = state.R[2][1];
      state.F[2][2] = state.R[2][2];
      state.R[2][0] = state.B[2][0];
      state.R[2][1] = state.B[2][1];
      state.R[2][2] = state.B[2][2];
      state.B[2][0] = state.L[2][0];
      state.B[2][1] = state.L[2][1];
      state.B[2][2] = state.L[2][2];
      state.L[2][0] = temp[0];
      state.L[2][1] = temp[1];
      state.L[2][2] = temp[2];
    }
  }

  public shuffle(moves: number = 20): Move[] {
    const possibleMoves: Move[] = ['F', 'B', 'L', 'R', 'U', 'D', "F'", "B'", "L'", "R'", "U'", "D'"];
    const shuffleMoves: Move[] = [];
    
    for (let i = 0; i < moves; i++) {
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      this.executeMove(randomMove);
      shuffleMoves.push(randomMove);
    }
    
    this.moveHistory = shuffleMoves;
    return shuffleMoves;
  }

  public isSolved(): boolean {
    const faces = Object.keys(this.state) as Array<keyof CubeState>;
    for (const face of faces) {
      const centerColor = this.state[face][1][1];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.state[face][i][j] !== centerColor) {
            return false;
          }
        }
      }
    }
    return true;
  }

  public getState(): CubeState {
    return this.deepCopyState(this.state);
  }

  public getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  public reset(): void {
    this.state = this.createSolvedCube();
    this.moveHistory = [];
  }

  public getColorString(): string {
    let result = '';
    // Order: Front, Right, Back, Left, Up, Down
    const faceOrder: Array<keyof CubeState> = ['F', 'R', 'B', 'L', 'U', 'D'];
    
    for (const face of faceOrder) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          result += this.state[face][i][j];
        }
      }
    }
    return result;
  }
}