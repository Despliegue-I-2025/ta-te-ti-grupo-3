const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// 0 = vacío, 1 = jugador humano, 2 = máquina
let board = [0,0,0,0,0,0,0,0,0];

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

// Ver el tablero actual
app.get('/board', (req, res) => {
  res.json({ board });
});

// Jugada del jugador humano
app.post('/move-player', (req, res) => {
  const { position } = req.body;

  if (position < 0 || position > 8) {
    return res.status(400).json({ error: 'Posición inválida.' });
  }

  if (board[position] !== 0) {
    return res.status(400).json({ error: 'Esa casilla ya está ocupada.' });
  }

  board[position] = 1; // Marca del jugador
  res.json({ message: 'Movimiento registrado.', board });
});

// Jugada de la máquina (IA básica)
app.get('/move', (req, res) => {
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

  // Marcar el movimiento en el tablero
  board[move] = 2;

  res.json({ movimiento: move, board });
});

// Reiniciar tablero
app.post('/reset', (req, res) => {
  board = [0,0,0,0,0,0,0,0,0];
  res.json({ message: 'Tablero reiniciado.', board });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
