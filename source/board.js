import Tile from './tile';
import Vector2D from './vector2d';

class Board {
    constructor(width = 8, height = 8) {
        // Define properties
        this.width = width;
        this.height = height;
        this.tiles = [];

        // Initialize content
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this.tiles.push(new Tile(x, y));
            }
        }
    }

    getFlippableTiles() {

    }

    canFlipTile() {

    }

    flipTile() {

    }

    getTile(x, y) {
        return this.tiles.find((tile) => {
            return tile.location.x == x && tile.location.y == y;
        });
        return null;
    }
    getTileByVector2D(v) {
        return this.getTile(v.x, v.y);
    }

    getTiles() {
        return this.tiles;
    }

    setTile(x, y, player) {
        this.getTile(x, y).state = player.id;
    }

    getScore(player) {
        return this.tiles.filter((tile) => {
            return tile.state == player.id;
        }).length;
    }

    compareTiles(v1, v2, invert) {
        var t1 = this.getTileByVector2D(v1);
        var t2 = this.getTileByVector2D(v2);
        if (t1 == undefined || t2 == undefined) return false;
        return (invert) ? t1.state !== t2.state : t1.state == t2.state;
    }

    validateTile(tile = new Tile()) {
        return tile.location.x >= 0 && tile.location.x < this.width && tile.location.y >= 0 && tile.location.y < this.height;
    }

    hasAdjecent(target = new Tile()) {
        return Vector2D.directions_array().some((direction) => {
            return (this.getTileByVector2D(target.location.add(direction)) !== null);
        });
    };

    getClickableTiles() {
        return this.tiles.filter(tile => tile.state == 0).filter(tile => this.hasAdjecent(tile));
    }
}

module.exports = Board;