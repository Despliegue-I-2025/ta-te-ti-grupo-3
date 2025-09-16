const express = require('express');
const app = express();
const PORT = 3000;

// Combinaciones ganadoras
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

app.get('/move', (req, res) => {
  let board;

  // Leer el tablero desde query (?board=[...])
  try {
    board = JSON.parse(req.query.board);
  } catch {
    return res.status(400).json({ error: 'Formato de tablero inválido. Usa ?board=[...]' });
  }

  // Validar tablero
  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ error: 'Tablero inválido. Debe ser un array de 9 posiciones.' });
  }

  const emptyPositions = board
    .map((v, i) => (v === 0 ? i : null))
    .filter(i => i !== null);

  if (emptyPositions.length === 0) {
    return res.status(400).json({ error: 'No hay movimientos disponibles.' });
  }

  let move = null;

  // 1. Intentar ganar
  for (const combo of winningCombinations) {
    const values = combo.map(i => board[i]);
    if (values.filter(v => v === 2).length === 2 && values.includes(0)) {
      move = combo[values.indexOf(0)];
      break;
    }
  }

  // 2. Bloquear al jugador
  if (move === null) {
    for (const combo of winningCombinations) {
      const values = combo.map(i => board[i]);
      if (values.filter(v => v === 1).length === 2 && values.includes(0)) {
        move = combo[values.indexOf(0)];
        break;
      }
    }
  }

  // 3. Si no hay jugada crítica, elegir al azar
  if (move === null) {
    move = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  }

  // Marcar movimiento de la máquina
  board[move] = 2;

  res.json({ movimiento: move, board });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
