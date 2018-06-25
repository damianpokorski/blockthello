class Engine {
    constructor() {
        // Hook up p5 global events
        window.setup = () => this.setup();
        window.draw = () => this.draw();
        window.mouseclicked = () => this.touched(mouseX, mouseY);
        window.touchStarted = () => this.touched(mouseX, mouseY);

        // Initialize game
        this.game = require('./game.js');
        this.game.engine = this;

    }

    setup() {
        this.style = {
            bg: color('#6CA6C1'), // 'Moonstone Blue'
            text: color('#343434'), // 'Jet' Black
            block: {
                0: color('#BCD6E2'), // Empty tile
                1: color('#F7FFF7'), // 'Mint Cream' 	White tile
                2: color('#343434') // 'Jet' 		Black tile
            }
        };
        noStroke();
        createCanvas(window.innerWidth, window.innerHeight);
        this.drawGrid();
    }

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

    // Rendering
    draw() {
        clear();
        background(this.style.bg);
        this.drawScoreboard();
        this.drawGrid();
    };

    drawGrid() {
        this.game.board.tiles.forEach((tile) => {
            var blockPosition = this.gridBlockPosition(tile.location.x, tile.location.y);
            fill(this.style.block[tile.state]);
            rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
        });
    };

    drawScoreboard() {
        // Background
        fill(this.style.text);

        // White
        textSize(this.dimensionsPercent(0, 10).y / 2);
        textAlign(LEFT);
        text(this.game.player.white.name, this.dimensionsPercentX(10), this.dimensionsPercentY(5));

        // Black
        textAlign(RIGHT);
        text(this.game.player.black.name, this.dimensionsPercentX(90), this.dimensionsPercentY(5));

        // Score
        textAlign(CENTER);
        text(this.game.board.getScore(this.game.player.white) + ' - ' + this.game.board.getScore(this.game.player.black), this.dimensionsPercentX(50), this.dimensionsPercentY(5));

        // Turn indicator
        textSize(this.dimensionsPercent(0, 10).y / 4);
        text(`${this.game.getCurrentPlayer().name}s turn`, this.dimensionsPercentX(50), this.dimensionsPercentY(10));
    };

    // Calculates which tile was clicked out 
    touched(cursor_x = 0, cursor_y = 0) {
        this.game.board
            .getClickableTiles()
            .forEach((tile) => {
                var blockBoundaries = this.gridBlockPosition(tile.location.x, tile.location.y);
                if (
                    cursor_x > blockBoundaries.x &&
                    cursor_x < blockBoundaries.x + blockBoundaries.w &&
                    cursor_y > blockBoundaries.y &&
                    cursor_y < blockBoundaries.y + blockBoundaries.h
                ) {
                    this.game.blockClicked(tile);
                }
            });
    };

    gridBlockPosition(X, Y) {
        var topOffset = this.dimensionsPercentY(10);
        var _width = this.dimensions().w / this.game.board.width;
        var _height = this.dimensions().h / this.game.board.height;
        var smaller = _width < _height ? _width : _height;
        return {
            x: this.dimensions().x + (X * smaller) + (smaller / 8 / 2),
            y: this.dimensions().y + (Y * smaller) + (smaller / 8 / 2) + topOffset,
            w: (smaller) - (smaller / 8 * 1),
            h: (smaller) - (smaller / 8 * 1)
        };
    };

}

module.exports = new Engine();