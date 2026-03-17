import Game from './game.mjs';
let rowsInFirstGame;
let columsInFirstGame;
let minesInFirstGame;
let _game;
// Убираем стандартный ПКМ по странице
document.addEventListener('contextmenu', event => event.preventDefault());
// Модалки
document.getElementById('game-settings-button').onclick = e => {
    document.getElementById('game-settings-form').style.display = 'flex';
}
document.getElementById('back-to-basic-settings').onclick = e => {
    document.getElementById('game-settings-form').style.display = 'flex';
    document.getElementById('game-settings-form-custom').style.display = 'none';
}

document.getElementById('game-settings-custom-button').onclick = e => {
    document.getElementById('game-settings-form-custom').style.display = 'flex';
    document.getElementById('game-settings-form').style.display = 'none';
}
// Кнопки стандартных полей
const settingsButtons = document.querySelectorAll('.difficulty-selector-button');
settingsButtons.forEach((settingsButton) => {
    
    settingsButton.addEventListener('click', () => {
        rowsInFirstGame = settingsButton.dataset.row;
        columsInFirstGame = settingsButton.dataset.row;
        minesInFirstGame = settingsButton.dataset.mines;
        _game = new Game(rowsInFirstGame, columsInFirstGame, minesInFirstGame)
    })
})
// Кастомные поля
document.getElementById('game-settings-form-custom').onsubmit = e => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const values = [];
    const FD = new FormData(e.currentTarget);
    FD.forEach((value, key) => {
        values.push(value);
    })
    rowsInFirstGame = values[0];
    columsInFirstGame = values[1];
    minesInFirstGame = values[2];
    if(rowsInFirstGame < 4) alert('Мало строк');
    else if(columsInFirstGame < 4) alert('Мало столбцов');
    else if((columsInFirstGame * rowsInFirstGame - minesInFirstGame) < 12) alert('Много мин');
    else _game = new Game(values[0], values[1], values[2]);
}
document.getElementById('restart-in-game').onclick = e => {
    _game.destroy();
    _game = null;
    _game = new Game(rowsInFirstGame, columsInFirstGame, minesInFirstGame)
}
document.getElementById('restart-game').onclick = e => {
    document.getElementById('container-end-game').classList = ``;
    _game = null;
    _game = new Game(rowsInFirstGame, columsInFirstGame, minesInFirstGame)
}
document.getElementById('main-menu').onclick = e => {
    _game = null;
    document.getElementById('container-end-game').classList = ``;
    document.getElementById('main-container').style.display = 'flex';
    document.getElementById('minefield-container').style.display = 'none';
    document.getElementById('minefield').innerHTML = ``;
}