export default class Game {
    _ROWS;
    _COLUMS;
    _MINES;
    _MINES_POS = [];
    _CLICKS = 0;

    constructor (rows, colums, mines) {
        this._ROWS = Number(rows);
        this._COLUMS = Number(colums);
        this._MINES = Number(mines);

        this.buildMinefield()
    }

    buildMinefield() {
        document.getElementById('game-settings-form').style.display = 'none';
        document.getElementById('game-settings-form-custom').style.display = 'none';
        document.getElementById('main-container').style.display = 'none';
        const MINEFIELD = document.getElementById('minefield');
        MINEFIELD.innerHTML = '';
        MINEFIELD.style.display = 'flex';

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

    clickOnCell(cell, first_click = 0) {
        if(first_click == 1){
            console.log(cell)
            this.generateMines(cell);
            return
        }
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

    generateMines(cell) {
        console.log('отработал generateMines');
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
            console.log(this._MINES_POS);
            const isMine = this.isMine(cell);
            console.log(`это мина: ${isMine}`)
            if (isMine == 1) this.generateMines(cell);
            else this.checkNeighbors(cell, 1);
        }else {
            console.error('Слишком много мин!');
            return null
        }
    }
    checkNeighbors(cell, first_click = 0, isCheck = 0) {
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
                    console.log(isMine)
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
            }
        }
        else {
            if(minesCount != 0){
                cell.innerHTML = `${minesCount}`;
                this.openCell(cell);
            }else{
                cell.innerHTML = ``;
                this.openCell(cell);
                for(let neighborCell of neighbors){
                    this.checkNeighbors(neighborCell);
                }
            }
            console.log(`количество мин вокруг: ${minesCount}`)
            if(first_click !== 0){
                if(minesCount != 0){
                    this.generateMines(cell, 1)
                }else {
                    this._CLICKS = 1;
                    this.openCell(cell);
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
    }
    openMines(cell){
        cell.classList = 'cell opened-mine'
        let posX;
        let posY;
        let el;
        for(let i = 0; i < this._MINES_POS.length; i++){
            el = this._MINES_POS[i];
            console.log(el)
            posX = el.x;
            posY = el.y;
            if(posX == cell.dataset.x & posY == cell.dataset.y) continue
            document.querySelector(`.cell[data-x="${posX}"][data-y="${posY}"]`).classList = 'cell mine';
        }
    }
    setFlag(cell) {
        if(cell.classList.contains('opened')) return
        if(cell.classList.contains('flaged')) cell.classList.remove('flaged');
        else cell.classList = 'cell flaged';
    }
}