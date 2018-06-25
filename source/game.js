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

        // Common variables
        this.style = {};

        // Utility functions
        this._dimensions = null;

        // hook for restart button
        window.gameStart = () => this.gameStart();

        // initialize the board and start the game
        this.gameStart();
    }

    gameStart() {
        // Initialize board and set some tiles
        this.board = new Board();
        this.board.setTile(3, 3, this.player.white);
        this.board.setTile(4, 4, this.player.white);
        this.board.setTile(3, 4, this.player.black);
        this.board.setTile(4, 3, this.player.black);

        // Reset turns
        this.turn = 0; // 0 - White, 1 - Black
    }

    getCurrentPlayer() {
        return this.turn == 0 ? this.player.white : this.player.black;
    };

    getNextPlayer() {
        return this.turn == 1 ? this.player.white : this.player.black;
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
                pointer = pointer.add(direction);
            }
            // If passed any blocks and blocks on both sides are the same
            if (passedBlocks.length && this.board.compareTiles(target.location, pointer)) {
                blocksToSwitch = blocksToSwitch.concat(passedBlocks);
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
}

module.exports = new Game();