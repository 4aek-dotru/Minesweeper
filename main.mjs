import Game from './game.mjs';
// Убираем стандартный ПКМ по странице
document.addEventListener('contextmenu', event => event.preventDefault());
// Модалки
document.getElementById('game-settings-button').onclick = e => {
    document.getElementById('game-settings-form').style.display = 'flex';
}

document.getElementById('game-settings-custom-button').onclick = e => {
    document.getElementById('game-settings-form-custom').style.display = 'flex';
    document.getElementById('game-settings-form').style.display = 'none';
}
// Кнопки стандартных полей
const settingsButtons = document.querySelectorAll('.difficulty-selector-button');
settingsButtons.forEach((settingsButton) => {
    
    settingsButton.addEventListener('click', () => {
        new Game(settingsButton.dataset.row, settingsButton.dataset.row, settingsButton.dataset.mines)
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

    new Game(values[0], values[1], values[2])
}