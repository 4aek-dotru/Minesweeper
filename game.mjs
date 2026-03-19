export default class Game {
    _ROWS;
    _COLUMS;
    _MINES;
    _MINES_POS = [];
    _CLICKS = 0;
    _ALL_CELLS;
    _MINES_FOR_COUNTING;
    _SEC_IN_GAME = 0;
    _MINUTES_IN_GAME = 0;
    _HOURS_IN_GAME = 0;
    _TIMER_ID;

    constructor (rows, colums, mines) {
        this._ROWS = Number(rows);
        this._COLUMS = Number(colums);
        this._MINES = Number(mines);
        this._ALL_CELLS = this._ROWS * this._COLUMS;
        this.buildMinefield()
    }

    buildMinefield() {
        document.getElementById('restart-in-game').innerHTML = '😊';
        document.getElementById('time-in-game').innerHTML = '0 мин. 0 сек.';
        document.getElementById('game-settings-form').style.display = 'none';
        document.getElementById('game-settings-form-custom').style.display = 'none';
        document.getElementById('main-container').style.display = 'none';
        document.getElementById('minefield-container').style.display = 'flex';
        this._MINES_FOR_COUNTING = this._MINES;
        document.getElementById('count-mines').innerText = `${this._MINES_FOR_COUNTING}`;
        const MINEFIELD = document.getElementById('minefield');
        MINEFIELD.innerHTML = '';

        let pos_y = 1;
        for(let i = 0; i < this._ROWS; i++){
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            MINEFIELD.appendChild(rowDiv);
            let pos_x = 1;
            for(let i = 0; i < this._COLUMS; i++){
                const rowCell = document.createElement('div');
                rowCell.dataset.x = pos_x;
                rowCell.dataset.y = pos_y;
                rowCell.className = 'cell';
                rowCell.addEventListener('click', e =>{
                    if (this._CLICKS == 0) this.clickOnCell(e.currentTarget, 1);
                    else this.clickOnCell(e.currentTarget);
                })
                rowCell.addEventListener('contextmenu', e => {
                    this.setFlag(e.currentTarget);
                })
                rowDiv.appendChild(rowCell);
                pos_x++
            }
            pos_y++
        }
    }
    destroy() {
        if (this._TIMER_ID) {
            clearInterval(this._TIMER_ID);
            this._TIMER_ID = null;
        }
    }
    timer() {
        this._TIMER_ID = setInterval(() => {
            const timerContainer = document.getElementById('time-in-game');
            this._SEC_IN_GAME++;
            if(this._SEC_IN_GAME == 59){
                this._MINUTES_IN_GAME++;
                this._SEC_IN_GAME = 0;
            }
            timerContainer.innerHTML = `${this._MINUTES_IN_GAME} мин. ${this._SEC_IN_GAME} сек.`
        }, 1000);
    }

    clickOnCell(cell, first_click = 0) {
        
        if(first_click == 1){
            this.generateMines(cell, 1);
            this.timer();
            return
        }else {
            if(cell.classList == 'cell opened'){
                this.checkNeighbors(cell, 0, 1)
                return
            }
            if(cell.classList == 'cell flaged'){
                return
            }
            if(this.isMine(cell) == 0){
                this.checkNeighbors(cell);
            }else{
                this.openMines(cell);
            }
        }
    }

    generateMines(cell) {
        if (this._MINES < this._ROWS * this._COLUMS) {
            this._MINES_POS = [];
            
            const flatArray = new Array(this._ROWS * this._COLUMS).fill(0);
            for (let i = 0; i < this._MINES; i++) {
                flatArray[i] = 1;
            }
            for (let i = flatArray.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [flatArray[i], flatArray[randomIndex]] = [flatArray[randomIndex], flatArray[i]];
            }
            let k = 0;
            for(let i = 1; i <= this._ROWS; i++){
                for(let j = 1; j <= this._COLUMS; j++){
                    const Mine = {
                        x: j,
                        y: i,
                        isMine: Boolean(flatArray[k])
                    }
                    if(Mine.isMine){this._MINES_POS.push(Mine)}
                    k++
                }
            }
            const isMine = this.isMine(cell);
            if (isMine == 1) this.generateMines(cell);
            else this.checkNeighbors(cell, 1);
        }else {
            console.error('Слишком много мин!');
            return null
        }
    }
    checkNeighbors(cell, first_click = 0, isCheck = 0) {
        if (cell.classList.contains('opened') && isCheck === 0) {
            return;
        }
        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);
        let minesCount = 0;
        let flagsCount = 0;
        let neighbors = [];
        for(let i = -1; i < 2; i++){
            for(let k = -1; k < 2; k++){
                if(i == 0 & k == 0) continue
                const neighbor = document.querySelector(`.cell[data-x="${x + k}"][data-y="${y + i}"]:not(.opened)`);

                if(neighbor != null) {
                    if(neighbor.classList.contains('flaged')) flagsCount++;
                    else neighbors.push(neighbor);

                    const isMine = this.isMine(neighbor);
                    minesCount = minesCount + isMine;
                }
            }
        }
        if(isCheck == 1) {
            if(flagsCount == minesCount) {
                for(let neighborCell of neighbors){
                    
                    if(this.isMine(neighborCell) == 1) this.openMines(neighborCell);
                    else {
                        this.checkNeighbors(neighborCell);
                    }
                }
            }else {
                for(let neighborCell of neighbors){
                    neighborCell.classList.add('checked');
                    setTimeout(() => {
                        neighborCell.classList.remove('checked');
                    }, 200)
                }
            }
        }else {
            if(first_click !== 0){
                if(minesCount != 0){
                    this.generateMines(cell, 1)
                    return
                }else {
                    cell.innerHTML = ``;
                    this._CLICKS = 1;
                    this.openCell(cell);

                    for(let neighborCell of neighbors){
                        this.checkNeighbors(neighborCell);
                    }
                    return
                }
            }
            if(minesCount != 0){
                cell.innerHTML = `${minesCount}`;
                if(minesCount == 1) cell.style.color = 'blue';
                if(minesCount == 2) cell.style.color = 'green';
                if(minesCount == 3) cell.style.color = 'red';
                if(minesCount == 4) cell.style.color = 'darkblue';
                if(minesCount == 5) cell.style.color = 'darkred';
                if(minesCount == 6) cell.style.color = 'darkcyan';
                if(minesCount == 7) cell.style.color = 'purple';
                if(minesCount == 8) cell.style.color = 'grey';
                this.openCell(cell);
            }else{
                cell.innerHTML = ``;
                this.openCell(cell);
                for(let neighborCell of neighbors){
                    this.checkNeighbors(neighborCell);
                }
            }
        }
    }
    isMine(neighbor) {
        for(let mines_pos of this._MINES_POS) {
            if(mines_pos.x == neighbor.dataset.x & mines_pos.y == neighbor.dataset.y) {
                return 1;
            }
        }
        return 0
    }

    openCell(cell){
        cell.classList = 'cell opened';
        this._ALL_CELLS--;
        if(this._ALL_CELLS - this._MINES == 0){
            document.getElementById('restart-game').disabled = false;
            document.getElementById('main-menu').disabled = false;
            this.endGame(true)
        }
    }
    openMines(cell){
        cell.classList = 'cell opened-mine';
        for(let i = 0; i < this._MINES_POS.length; i++){
            const el = this._MINES_POS[i];
            const posX = el.x;
            const posY = el.y;
            if(posX == cell.dataset.x & posY == cell.dataset.y) continue
            document.querySelector(`.cell[data-x="${posX}"][data-y="${posY}"]`).classList = 'cell mine';
        }
        this.endGame(false);
    }
    setFlag(cell) {
        if(cell.classList.contains('opened')) return
        if(cell.classList.contains('flaged')) {
            cell.classList.remove('flaged');
            this._MINES_FOR_COUNTING++;
            document.getElementById('count-mines').innerText = `${this._MINES_FOR_COUNTING}`;
        }
        else {
            cell.classList = 'cell flaged';
            this._MINES_FOR_COUNTING--;
            document.getElementById('count-mines').innerText = `${this._MINES_FOR_COUNTING}`;
        }
    }
    endGame(end) {
        clearInterval(this._TIMER_ID);
        const text = end  ? 'Вы выйграли!' : 'Вы проиграли';
        const smile = end ? '😎' : '😵';
        document.getElementById('restart-in-game').innerHTML = `${smile}`;
        document.getElementById('end-game-text').innerText = `${text}`;
        document.getElementById('container-end-game').classList = `container-end-game`;
    }
}