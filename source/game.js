import Tile from './tile';

class Game {
    constructor() {
        // Common variables
        this.style = {};
        this.game = {
            players: [{
                    name: "White",
                    score: 0
                },
                {
                    name: "Black",
                    score: 0
                }
            ],
            turn: 0, // 0 - White, 1 - Black
            grid: [ // 0 - Empty, 1- White, 2 - Black
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            directions: [
                new Tile(-1, -1), new Tile(0, -1), new Tile(1, -1),
                new Tile(-1, 0), new Tile(1, 0),
                new Tile(-1, 1), new Tile(0, 1), new Tile(1, 1)
            ]
        };

        // Utility functions
        this._dimensions = null;
    }


    // P5 setup
    setup() {
        console.log("SETTING UP");
        this.style = {
            bg: [color('#574AE2'), color('#222A68')],
            fg: color('#654597'),
            highlight: color('#AB81CD'),
            light: color('#E2ADF2'),
            white: color('#FFAAAA'),
            text: color('#FFFFFF'),
            block: {
                0: color('#FFFFFF33'),
                1: color('#FFF'),
                2: color('#000')
            }
        };
        noStroke();
        createCanvas(window.innerWidth, window.innerHeight);
        console.log([window.innerWidth, innerHeight]);
        this.drawGrid();
    };

    dimensions(ratioX = 9, ratioY = 16) {
        if (!this._dimensions)
            this._dimensions = {
                w: window.innerHeight / ratioY * ratioX,
                h: window.innerHeight,
                x: (window.innerWidth - (window.innerHeight / ratioY * ratioX)) / 2,
                y: 0
            };
        return this._dimensions;
    };

    dimensionsPercentX(x = 0) {
        return this.dimensions().x + (this.dimensions().w / 100) * x;
    };

    dimensionsPercentY(y = 0) {
        return this.dimensions().y + (this.dimensions().h / 100) * y
    };

    dimensionsPercent(x = 0, y = 0) { // 0 - 100
        return {
            x: this.dimensionsPercentX(x),
            y: this.dimensionsPercentY(y)
        }
    };

    drawPortrait() {
        fill(this.style.bg[1]);
        rect(this.dimensions().x, this.dimensions().y, this.dimensions().w, this.dimensions().h);
    };

    getScore() {
        return this.game.players[0].score.toString() + " - " + this.game.players[1].score.toString();
    };

    getCurrentPlayer() {
        return this.game.turn == 0 ? "White" : "Black";
    };

    drawScoreboard() {
        fill(this.style.text);
        textSize(this.dimensionsPercent(0, 10).y / 2);
        textAlign(LEFT);
        text(this.game.players[0].name, this.dimensionsPercentX(10), this.dimensionsPercentY(5));
        textAlign(RIGHT);
        text(this.game.players[1].name, this.dimensionsPercentX(90), this.dimensionsPercentY(5));
        textAlign(CENTER);
        text(this.getScore(), this.dimensionsPercentX(50), this.dimensionsPercentY(5));

        textSize(this.dimensionsPercent(0, 10).y / 4);
        text(`${this.getCurrentPlayer()}s turn`, this.dimensionsPercentX(50), this.dimensionsPercentY(10));
    };

    gridBlockPosition(X, Y) {
        var topOffset = this.dimensionsPercentY(10);
        var eight = this.dimensions().w / 8;
        return {
            x: this.dimensions().x + (X * eight) + (eight / 8 / 2),
            y: this.dimensions().y + (Y * eight) + (eight / 8 / 2) + topOffset,
            w: (eight) - (eight / 8 * 1),
            h: (eight) - (eight / 8 * 1)
        };
    };

    drawGrid() {
        fill(this.style.white);

        this.game.grid.forEach((row, y) => row.forEach((value, x) => {
            var blockPosition = this.gridBlockPosition(x, y);
            fill(this.style.block[value]);
            rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
        }));
    };

    // Rendering
    draw() {
        clear();
        background(this.style.bg[0]);
        this.drawPortrait();
        this.drawScoreboard();
        this.drawGrid();
    };

    updateScore() {
        var whites = 0;
        var blacks = 0;
        this.game.grid.forEach((row, y) => row.forEach((value, x) => {
            if (value == 1) {
                console.log(`${x+1} ${y+1} is white.`);
                whites++;
            }

            if (value == 2) {
                console.log(`${x+1} ${y+1} is black.`);
                blacks++;
            }

        }));
        this.game.players[0].score = whites;
        this.game.players[1].score = blacks;
    };

    forEachBlock(func = (x, y, value) => {}) {
        this.game.grid.forEach((row, y) => row.forEach((value, x) => {
            func(x, y, value);
        }));
    };

    blockClicked(x, y) {
        if (this.getTileState(new Tile(x, y)) == null) {
            this.game.grid[y][x] = 1 + this.game.turn;
            this.processChanges(new Tile(x, y));
            this.game.turn = this.game.turn == 0 ? 1 : 0;
        }
    };

    touched(cursor_x = 0, cursor_y = 0) {
        this.game.grid.forEach((row, y) => row.forEach((value, x) => {
            var blockBoundaries = this.gridBlockPosition(x, y);
            if (
                cursor_x > blockBoundaries.x &&
                cursor_x < blockBoundaries.x + blockBoundaries.w &&
                cursor_y > blockBoundaries.y &&
                cursor_y < blockBoundaries.y + blockBoundaries.h &&
                this.hasAdjecent(new Tile(x, y))
            ) {
                this.blockClicked(x, y);
            }
        }));
    };

    Tile(_x = 0, _y = 0) {
        return { x: _x, y: _y };
    };

    addTiles(a = new Tile(), b = new Tile()) {
        return { x: a.x + b.x, y: a.y + b.y };
    };

    getTileState(point = new Tile()) {
        if (
            point.y < 0 ||
            point.y > 7 ||
            point.x < 0 ||
            point.x > 7
        ) return null;

        switch (this.game.grid[point.y][point.x]) {
            case 0:
                return null;
            case 1:
                return this.game.players[0].name;
            case 2:
                return this.game.players[1].name;
        }
    };

    filterDirection(origin = new Tile(), direction = new Tile(), filter) {
        return filter({
            x: origin.x + direction.x,
            y: origin.y + direction.y
        });
    };

    processChanges(target = new Tile()) {
        // Check each directions
        this.game.directions.forEach((direction) => {
            var blocksToSwitch = [];
            var directionPointer = direction;

            // Keep moving in each direction while encountering blocks of oposite color
            while (
                this.getTileState(this.addTiles(target, directionPointer)) !== null &&
                this.getTileState(this.addTiles(target, directionPointer)) != this.getTileState(target)
            ) {
                blocksToSwitch.push(this.addTiles(target, directionPointer));
                directionPointer = this.addTiles(directionPointer, direction);
            }

            // After the movement has been finished - if the encountered block is of original colour - claim the passed blocks
            if (this.getTileState(target) == this.getTileState(this.addTiles(target, directionPointer))) {
                blocksToSwitch.forEach((block, index) => {
                    let gameturn = this.game.turn;
                    let block_x = block.x;
                    let block_y = block.y;
                    setTimeout(() => {
                        this.game.grid[block_y][block_x] = 1 + gameturn;
                        this.updateScore();
                    }, 100 * index);
                });
            }
        });
    };

    hasAdjecent(target = new Tile()) {
        return this.game.directions.some((direction) => {
            return (this.getTileState(this.addTiles(target, direction)) !== null);
        });
    };
}

module.exports = new Game();