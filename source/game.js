import Tile from './tile';
import Board from './board';
import Player from './player';
import Vector2D from './vector2d';

class Game {
    constructor() {
        // Construct static player object
        this.player = {
            none: new Player(0, "None"),
            white: new Player(1, "White"),
            black: new Player(2, "Black")
        };
        console.log(this.players);

        this.board = new Board();
        this.board.setTile(3, 3, this.player.white);
        this.board.setTile(4, 4, this.player.white);
        this.board.setTile(3, 4, this.player.black);
        this.board.setTile(4, 3, this.player.black);
        // Common variables
        this.style = {};
        this.turn = 0; // 0 - White, 1 - Black

        // Utility functions
        this._dimensions = null;
    }

    // P5 setup
    setup() {
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
        return this.player.white.score + " - " + this.player.black.score;
    };

    getCurrentPlayer() {
        return this.turn == 0 ? this.player.white : this.player.black;
    };

    getNextPlayer() {
        return this.turn == 1 ? this.player.white : this.player.black;
    };

    drawScoreboard() {
        fill(this.style.text);
        textSize(this.dimensionsPercent(0, 10).y / 2);
        textAlign(LEFT);
        text(this.player.white.name, this.dimensionsPercentX(10), this.dimensionsPercentY(5));
        textAlign(RIGHT);
        text(this.player.black.name, this.dimensionsPercentX(90), this.dimensionsPercentY(5));
        textAlign(CENTER);
        text(this.getScore(), this.dimensionsPercentX(50), this.dimensionsPercentY(5));

        textSize(this.dimensionsPercent(0, 10).y / 4);
        text(`${this.getCurrentPlayer().name}s turn`, this.dimensionsPercentX(50), this.dimensionsPercentY(10));
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

        this.board.tiles.forEach((tile) => {
            var blockPosition = this.gridBlockPosition(tile.location.x, tile.location.y);
            fill(this.style.block[tile.state]);
            rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
        });
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
        this.player.white.score = this.board.getScore(this.player.white);
        this.player.black.score = this.board.getScore(this.player.black);
    };

    blockClicked(target = new Tile()) {
        this.board.setTile(target.location.x, target.location.y, this.getCurrentPlayer());
        if (this.blocksFlippedByPlacingTile(target).length > 0) {
            this.processChanges(target);
            this.turn = this.turn == 0 ? 1 : 0;
        } else {
            this.board.setTile(target.location.x, target.location.y, this.player.none);
        }
    };

    touched(cursor_x = 0, cursor_y = 0) {
        this.board.tiles.forEach((tile) => {
            var blockBoundaries = this.gridBlockPosition(tile.location.x, tile.location.y);
            if (
                cursor_x > blockBoundaries.x &&
                cursor_x < blockBoundaries.x + blockBoundaries.w &&
                cursor_y > blockBoundaries.y &&
                cursor_y < blockBoundaries.y + blockBoundaries.h &&
                this.hasAdjecent(tile)
            ) {
                this.blockClicked(tile);
            }
        });
    };

    blocksFlippedByPlacingTile(target = new Tile()) {
        var blocksToSwitch = [];

        // Check each directions
        Vector2D.directions_array().forEach((direction) => {
            var passedBlocks = [];
            var pointer = target.location.add(direction);
            // Keep moving in each direction while encountering blocks of oposite color
            while (
                this.board.getTileByVector2D(pointer) &&
                this.board.getTileByVector2D(pointer).state !== 0 &&
                this.board.compareTiles(pointer, target.location, true)
            ) {
                passedBlocks.push(pointer);
                console.log(['Passed', [pointer.x, pointer.y]]);
                pointer = pointer.add(direction);
            }
            if (passedBlocks.length) {
                console.log([
                    'Finaly compare',
                    this.board.getTileByVector2D(target.location).location,
                    this.board.getTileByVector2D(target.location).state,
                    this.board.getTileByVector2D(pointer).location,
                    this.board.getTileByVector2D(pointer).state,
                ]);
                if (this.board.compareTiles(target.location, pointer)) {
                    blocksToSwitch = blocksToSwitch.concat(passedBlocks);
                }
            }
        });
        return blocksToSwitch;
    }

    processChanges(target = new Tile()) {
        this.blocksFlippedByPlacingTile(target).forEach((block, index) => {
            let gameturn = this.turn;
            let block_x = block.x;
            let block_y = block.y;
            this.board.setTile(block_x, block_y, this.getCurrentPlayer());
            this.updateScore();
        });
    };

    hasAdjecent(target = new Tile()) {
        return Vector2D.directions_array().some((direction) => {
            return (this.board.getTileByVector2D(target.location.add(direction)) !== null);
        });
    };
}

module.exports = new Game();