/**
 * SVG Cube Renderer
 * Renders a 3D-looking cube from the cube state string
 */

export function getCubeSvg(cubeString: string, size: number = 300): string {
  const colors: { [key: string]: string } = {
    'w': '#ffffff', // white
    'r': '#ff0000', // red
    'y': '#ffff00', // yellow
    'o': '#ff8000', // orange
    'g': '#00ff00', // green
    'b': '#0000ff'  // blue
  };

  const strokeColor = '#000000';
  const strokeWidth = 2;
  const faceSize = size / 4;
  const squareSize = faceSize / 3;

  // Parse cube string into faces
  // Order: U(up), R(right), F(front), D(down), L(left), B(back)
  const faces = {
    U: cubeString.slice(0, 9),   // Up face
    R: cubeString.slice(9, 18),  // Right face  
    F: cubeString.slice(18, 27), // Front face
    D: cubeString.slice(27, 36), // Down face
    L: cubeString.slice(36, 45), // Left face
    B: cubeString.slice(45, 54)  // Back face
  };

  let svg = `<svg width="${size}" height="${size * 0.75}" viewBox="0 0 ${size} ${size * 0.75}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Draw the cube in net format
  // Layout:
  //     [U]
  // [L] [F] [R] [B]
  //     [D]

  // Up face
  svg += drawFace(faces.U, faceSize, 0, colors, strokeColor, strokeWidth, squareSize);
  
  // Left face  
  svg += drawFace(faces.L, 0, faceSize, colors, strokeColor, strokeWidth, squareSize);
  
  // Front face
  svg += drawFace(faces.F, faceSize, faceSize, colors, strokeColor, strokeWidth, squareSize);
  
  // Right face
  svg += drawFace(faces.R, faceSize * 2, faceSize, colors, strokeColor, strokeWidth, squareSize);
  
  // Back face
  svg += drawFace(faces.B, faceSize * 3, faceSize, colors, strokeColor, strokeWidth, squareSize);
  
  // Down face
  svg += drawFace(faces.D, faceSize, faceSize * 2, colors, strokeColor, strokeWidth, squareSize);

  svg += '</svg>';
  return svg;
}

function drawFace(
  faceString: string, 
  x: number, 
  y: number, 
  colors: { [key: string]: string },
  strokeColor: string,
  strokeWidth: number,
  squareSize: number
): string {
  let faceSvg = '';
  
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const color = colors[faceString[i]] || '#cccccc';
    
    const squareX = x + col * squareSize;
    const squareY = y + row * squareSize;
    
    faceSvg += `<rect x="${squareX}" y="${squareY}" width="${squareSize}" height="${squareSize}" 
                fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
  }
  
  return faceSvg;
}