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