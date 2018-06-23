import Vector2D from './vector2d';
class Tile {
    constructor(x = 0, y = 0) {
        this.location = new Vector2D(x, y);
        this.state = 0;
    }
}

module.exports = Tile;