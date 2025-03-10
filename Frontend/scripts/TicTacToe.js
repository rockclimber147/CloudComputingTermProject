document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".game-cell");
    let currentPlayer = "X"; // Start with "X"

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (cell.textContent === "") { // Only place if empty
                cell.textContent = currentPlayer;
                cell.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark"); // Apply different colors
                currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch turns
            }
        });
    });
});


/** frontend code for once the websocket server is set up
 * makes use of Backend payloads for tictactoe games
 * 
 * 
 * const TicTacToeEvent = {
    START_GAME: 'start game',
    MAKE_MOVE: 'make move',
    UPDATE_BOARD: 'update board',
    GAME_OVER: 'game over',
    ERROR: 'error'
};
  
  const socket = new WebSocket('ws://localhost:8080'); 

let gameId = '';
let playerId = '';  // Assign this when the player logs in or joins the game
let currentPlayer = '';

// When the WebSocket connection opens, we start the game or join the game
socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
    
    // Send start game request (replace with actual logic to get players)
    const startGamePayload = {
        event: 'start game',
        gameId: 'game123',
        lobbyId: 1,
        playerX: 1, // Example player IDs
        playerO: 2,
        board: Array(9).fill(''),  // Empty board at start
        turn: 1  // Player 1 goes first
    };

    socket.send(JSON.stringify(startGamePayload));
});

// Handle incoming WebSocket messages
socket.addEventListener('message', (event) => {
    const payload = JSON.parse(event.data);

    switch (payload.event) {
        case 'start game':
            handleStartGame(payload);
            break;
        case 'update board':
            handleUpdateBoard(payload);
            break;
        case 'game over':
            handleGameOver(payload);
            break;
        case 'error':
            handleError(payload);
            break;
        default:
            console.log('Unknown event type');
            break;
    }
});

// Handle the start of the game
function handleStartGame(payload) {
    gameId = payload.gameId;
    currentPlayer = payload.turn === payload.playerX ? 'X' : 'O'; // Set starting player

    updateGameBoard(payload.board);
}

// Handle board updates
function handleUpdateBoard(payload) {
    updateGameBoard(payload.board);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Toggle turn
}

// Handle game over
function handleGameOver(payload) {
    if (payload.winner) {
        alert(`Player ${payload.winner} wins!`);
    } else {
        alert('It\'s a tie!');
    }
    updateGameBoard(payload.board);
}

// Handle errors
function handleError(payload) {
    alert(`Error: ${payload.message}`);
}

// Function to update the game board in the UI
function updateGameBoard(board) {
    const cells = document.querySelectorAll('.game-cell');
    
    board.forEach((mark, index) => {
        cells[index].textContent = mark;  // update board
    });
}

// Handle player moves when a cell is clicked
document.querySelectorAll('.game-cell').forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (currentPlayer === 'X' || currentPlayer === 'O') {
            const movePayload = {
                event: 'make move',
                gameId: gameId,
                playerId: currentPlayer === 'X' ? 1 : 2,  // utilize player ids
                position: index
            };
            socket.send(JSON.stringify(movePayload));
        }
    });
});
 */