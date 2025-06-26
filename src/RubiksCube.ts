/**
 * Rubik's Cube representation and solver
 * 
 * Cube faces are represented as:
 * - 0: Front (F) - White
 * - 1: Right (R) - Red  
 * - 2: Back (B) - Yellow
 * - 3: Left (L) - Orange
 * - 4: Up (U) - Green
 * - 5: Down (D) - Blue
 * 
 * Each face is a 3x3 grid with positions:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */

export type Face = number[][];
export type CubeState = Face[];
export type Move = 'F' | 'R' | 'B' | 'L' | 'U' | 'D' | "F'" | "R'" | "B'" | "L'" | "U'" | "D'";

export class RubiksCube {
  private state: CubeState;
  private moveHistory: Move[] = [];
  
  // Color mappings for display
  private colors = ['w', 'r', 'y', 'o', 'g', 'b']; // white, red, yellow, orange, green, blue

  constructor() {
    this.state = this.createSolvedCube();
  }

  private createSolvedCube(): CubeState {
    const cube: CubeState = [];
    for (let face = 0; face < 6; face++) {
      cube[face] = [];
      for (let row = 0; row < 3; row++) {
        cube[face][row] = [];
        for (let col = 0; col < 3; col++) {
          cube[face][row][col] = face;
        }
      }
    }
    return cube;
  }

  // Get current state as color string for rendering
  getCubeString(): string {
    let result = '';
    // Order: U, R, F, D, L, B (standard net layout)
    const faceOrder = [4, 1, 0, 5, 3, 2]; // Up, Right, Front, Down, Left, Back
    
    for (const faceIndex of faceOrder) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          result += this.colors[this.state[faceIndex][row][col]];
        }
      }
    }
    return result;
  }

  // Deep copy state
  private copyState(): CubeState {
    return this.state.map(face => face.map(row => [...row]));
  }

  // Rotate a face 90 degrees clockwise
  private rotateFaceClockwise(face: Face): void {
    const temp = this.copyFace(face);
    face[0][0] = temp[2][0]; face[0][1] = temp[1][0]; face[0][2] = temp[0][0];
    face[1][0] = temp[2][1]; face[1][1] = temp[1][1]; face[1][2] = temp[0][1];
    face[2][0] = temp[2][2]; face[2][1] = temp[1][2]; face[2][2] = temp[0][2];
  }

  // Rotate a face 90 degrees counter-clockwise
  private rotateFaceCounterClockwise(face: Face): void {
    const temp = this.copyFace(face);
    face[0][0] = temp[0][2]; face[0][1] = temp[1][2]; face[0][2] = temp[2][2];
    face[1][0] = temp[0][1]; face[1][1] = temp[1][1]; face[1][2] = temp[2][1];
    face[2][0] = temp[0][0]; face[2][1] = temp[1][0]; face[2][2] = temp[2][0];
  }

  private copyFace(face: Face): Face {
    return face.map(row => [...row]);
  }

  // Execute a move
  move(move: Move): void {
    this.moveHistory.push(move);
    
    switch (move) {
      case 'F': this.moveFront(); break;
      case "F'": this.moveFrontPrime(); break;
      case 'R': this.moveRight(); break;
      case "R'": this.moveRightPrime(); break;
      case 'B': this.moveBack(); break;
      case "B'": this.moveBackPrime(); break;
      case 'L': this.moveLeft(); break;
      case "L'": this.moveLeftPrime(); break;
      case 'U': this.moveUp(); break;
      case "U'": this.moveUpPrime(); break;
      case 'D': this.moveDown(); break;
      case "D'": this.moveDownPrime(); break;
    }
  }

  private moveFront(): void {
    this.rotateFaceClockwise(this.state[0]);
    const temp = [this.state[4][2][0], this.state[4][2][1], this.state[4][2][2]];
    this.state[4][2][0] = this.state[3][2][2];
    this.state[4][2][1] = this.state[3][1][2];
    this.state[4][2][2] = this.state[3][0][2];
    this.state[3][0][2] = this.state[5][0][1];
    this.state[3][1][2] = this.state[5][0][0];
    this.state[3][2][2] = temp[0];
    this.state[5][0][0] = this.state[1][2][0];
    this.state[5][0][1] = this.state[1][1][0];
    this.state[1][0][0] = temp[2];
    this.state[1][1][0] = temp[1];
    this.state[1][2][0] = temp[0];
  }

  private moveFrontPrime(): void {
    this.rotateFaceCounterClockwise(this.state[0]);
    const temp = [this.state[4][2][0], this.state[4][2][1], this.state[4][2][2]];
    this.state[4][2][0] = this.state[1][2][0];
    this.state[4][2][1] = this.state[1][1][0];
    this.state[4][2][2] = this.state[1][0][0];
    this.state[1][0][0] = this.state[5][0][2];
    this.state[1][1][0] = this.state[5][0][1];
    this.state[1][2][0] = this.state[5][0][0];
    this.state[5][0][0] = this.state[3][1][2];
    this.state[5][0][1] = this.state[3][0][2];
    this.state[5][0][2] = temp[2];
    this.state[3][0][2] = temp[1];
    this.state[3][1][2] = temp[0];
    this.state[3][2][2] = temp[2];
  }

  private moveRight(): void {
    this.rotateFaceClockwise(this.state[1]);
    const temp = [this.state[0][0][2], this.state[0][1][2], this.state[0][2][2]];
    this.state[0][0][2] = this.state[5][0][2];
    this.state[0][1][2] = this.state[5][1][2];
    this.state[0][2][2] = this.state[5][2][2];
    this.state[5][0][2] = this.state[2][2][0];
    this.state[5][1][2] = this.state[2][1][0];
    this.state[5][2][2] = this.state[2][0][0];
    this.state[2][0][0] = this.state[4][2][2];
    this.state[2][1][0] = this.state[4][1][2];
    this.state[2][2][0] = this.state[4][0][2];
    this.state[4][0][2] = temp[0];
    this.state[4][1][2] = temp[1];
    this.state[4][2][2] = temp[2];
  }

  private moveRightPrime(): void {
    this.rotateFaceCounterClockwise(this.state[1]);
    const temp = [this.state[0][0][2], this.state[0][1][2], this.state[0][2][2]];
    this.state[0][0][2] = this.state[4][0][2];
    this.state[0][1][2] = this.state[4][1][2];
    this.state[0][2][2] = this.state[4][2][2];
    this.state[4][0][2] = this.state[2][2][0];
    this.state[4][1][2] = this.state[2][1][0];
    this.state[4][2][2] = this.state[2][0][0];
    this.state[2][0][0] = this.state[5][2][2];
    this.state[2][1][0] = this.state[5][1][2];
    this.state[2][2][0] = this.state[5][0][2];
    this.state[5][0][2] = temp[0];
    this.state[5][1][2] = temp[1];
    this.state[5][2][2] = temp[2];
  }

  private moveBack(): void {
    this.rotateFaceClockwise(this.state[2]);
    const temp = [this.state[4][0][0], this.state[4][0][1], this.state[4][0][2]];
    this.state[4][0][0] = this.state[1][0][2];
    this.state[4][0][1] = this.state[1][1][2];
    this.state[4][0][2] = this.state[1][2][2];
    this.state[1][0][2] = this.state[5][2][2];
    this.state[1][1][2] = this.state[5][2][1];
    this.state[1][2][2] = this.state[5][2][0];
    this.state[5][2][0] = this.state[3][2][0];
    this.state[5][2][1] = this.state[3][1][0];
    this.state[5][2][2] = this.state[3][0][0];
    this.state[3][0][0] = temp[2];
    this.state[3][1][0] = temp[1];
    this.state[3][2][0] = temp[0];
  }

  private moveBackPrime(): void {
    this.rotateFaceCounterClockwise(this.state[2]);
    const temp = [this.state[4][0][0], this.state[4][0][1], this.state[4][0][2]];
    this.state[4][0][0] = this.state[3][2][0];
    this.state[4][0][1] = this.state[3][1][0];
    this.state[4][0][2] = this.state[3][0][0];
    this.state[3][0][0] = this.state[5][2][2];
    this.state[3][1][0] = this.state[5][2][1];
    this.state[3][2][0] = this.state[5][2][0];
    this.state[5][2][0] = this.state[1][2][2];
    this.state[5][2][1] = this.state[1][1][2];
    this.state[5][2][2] = this.state[1][0][2];
    this.state[1][0][2] = temp[0];
    this.state[1][1][2] = temp[1];
    this.state[1][2][2] = temp[2];
  }

  private moveLeft(): void {
    this.rotateFaceClockwise(this.state[3]);
    const temp = [this.state[0][0][0], this.state[0][1][0], this.state[0][2][0]];
    this.state[0][0][0] = this.state[4][0][0];
    this.state[0][1][0] = this.state[4][1][0];
    this.state[0][2][0] = this.state[4][2][0];
    this.state[4][0][0] = this.state[2][2][2];
    this.state[4][1][0] = this.state[2][1][2];
    this.state[4][2][0] = this.state[2][0][2];
    this.state[2][0][2] = this.state[5][2][0];
    this.state[2][1][2] = this.state[5][1][0];
    this.state[2][2][2] = this.state[5][0][0];
    this.state[5][0][0] = temp[2];
    this.state[5][1][0] = temp[1];
    this.state[5][2][0] = temp[0];
  }

  private moveLeftPrime(): void {
    this.rotateFaceCounterClockwise(this.state[3]);
    const temp = [this.state[0][0][0], this.state[0][1][0], this.state[0][2][0]];
    this.state[0][0][0] = this.state[5][2][0];
    this.state[0][1][0] = this.state[5][1][0];
    this.state[0][2][0] = this.state[5][0][0];
    this.state[5][0][0] = this.state[2][2][2];
    this.state[5][1][0] = this.state[2][1][2];
    this.state[5][2][0] = this.state[2][0][2];
    this.state[2][0][2] = this.state[4][2][0];
    this.state[2][1][2] = this.state[4][1][0];
    this.state[2][2][2] = this.state[4][0][0];
    this.state[4][0][0] = temp[0];
    this.state[4][1][0] = temp[1];
    this.state[4][2][0] = temp[2];
  }

  private moveUp(): void {
    this.rotateFaceClockwise(this.state[4]);
    const temp = [this.state[0][0][0], this.state[0][0][1], this.state[0][0][2]];
    this.state[0][0][0] = this.state[1][0][0];
    this.state[0][0][1] = this.state[1][0][1];
    this.state[0][0][2] = this.state[1][0][2];
    this.state[1][0][0] = this.state[2][0][0];
    this.state[1][0][1] = this.state[2][0][1];
    this.state[1][0][2] = this.state[2][0][2];
    this.state[2][0][0] = this.state[3][0][0];
    this.state[2][0][1] = this.state[3][0][1];
    this.state[2][0][2] = this.state[3][0][2];
    this.state[3][0][0] = temp[0];
    this.state[3][0][1] = temp[1];
    this.state[3][0][2] = temp[2];
  }

  private moveUpPrime(): void {
    this.rotateFaceCounterClockwise(this.state[4]);
    const temp = [this.state[0][0][0], this.state[0][0][1], this.state[0][0][2]];
    this.state[0][0][0] = this.state[3][0][0];
    this.state[0][0][1] = this.state[3][0][1];
    this.state[0][0][2] = this.state[3][0][2];
    this.state[3][0][0] = this.state[2][0][0];
    this.state[3][0][1] = this.state[2][0][1];
    this.state[3][0][2] = this.state[2][0][2];
    this.state[2][0][0] = this.state[1][0][0];
    this.state[2][0][1] = this.state[1][0][1];
    this.state[2][0][2] = this.state[1][0][2];
    this.state[1][0][0] = temp[0];
    this.state[1][0][1] = temp[1];
    this.state[1][0][2] = temp[2];
  }

  private moveDown(): void {
    this.rotateFaceClockwise(this.state[5]);
    const temp = [this.state[0][2][0], this.state[0][2][1], this.state[0][2][2]];
    this.state[0][2][0] = this.state[3][2][0];
    this.state[0][2][1] = this.state[3][2][1];
    this.state[0][2][2] = this.state[3][2][2];
    this.state[3][2][0] = this.state[2][2][0];
    this.state[3][2][1] = this.state[2][2][1];
    this.state[3][2][2] = this.state[2][2][2];
    this.state[2][2][0] = this.state[1][2][0];
    this.state[2][2][1] = this.state[1][2][1];
    this.state[2][2][2] = this.state[1][2][2];
    this.state[1][2][0] = temp[0];
    this.state[1][2][1] = temp[1];
    this.state[1][2][2] = temp[2];
  }

  private moveDownPrime(): void {
    this.rotateFaceCounterClockwise(this.state[5]);
    const temp = [this.state[0][2][0], this.state[0][2][1], this.state[0][2][2]];
    this.state[0][2][0] = this.state[1][2][0];
    this.state[0][2][1] = this.state[1][2][1];
    this.state[0][2][2] = this.state[1][2][2];
    this.state[1][2][0] = this.state[2][2][0];
    this.state[1][2][1] = this.state[2][2][1];
    this.state[1][2][2] = this.state[2][2][2];
    this.state[2][2][0] = this.state[3][2][0];
    this.state[2][2][1] = this.state[3][2][1];
    this.state[2][2][2] = this.state[3][2][2];
    this.state[3][2][0] = temp[0];
    this.state[3][2][1] = temp[1];
    this.state[3][2][2] = temp[2];
  }

  // Execute multiple moves
  executeSequence(moves: Move[]): void {
    moves.forEach(move => this.move(move));
  }

  // Scramble the cube
  scramble(moves: number = 20): Move[] {
    const allMoves: Move[] = ['F', 'R', 'B', 'L', 'U', 'D', "F'", "R'", "B'", "L'", "U'", "D'"];
    const scrambleMoves: Move[] = [];
    
    for (let i = 0; i < moves; i++) {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      scrambleMoves.push(randomMove);
      this.move(randomMove);
    }
    
    return scrambleMoves;
  }

  // Check if cube is solved
  isSolved(): boolean {
    for (let face = 0; face < 6; face++) {
      const centerColor = this.state[face][1][1];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (this.state[face][row][col] !== centerColor) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // Reset to solved state
  reset(): void {
    this.state = this.createSolvedCube();
    this.moveHistory = [];
  }

  // Get move history
  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  // Clone the cube
  clone(): RubiksCube {
    const newCube = new RubiksCube();
    newCube.state = this.copyState();
    newCube.moveHistory = [...this.moveHistory];
    return newCube;
  }
}