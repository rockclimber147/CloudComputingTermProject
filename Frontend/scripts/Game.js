export class HomeElementEnums {
    static GAME_DIV = "game-front"
    static LOBBY_DIV = "home-front"
}



export class Game {
    showGame() {
        document.getElementById(HomeElementEnums.GAME_DIV).style.display = "block";
        document.getElementById(HomeElementEnums.LOBBY_DIV).style.display = "none";
    }

    hideGame() {
        document.getElementById(HomeElementEnums.GAME_DIV).style.display = "none";
        document.getElementById(HomeElementEnums.LOBBY_DIV).style.display = "block";
    }
}