class Tile {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;

        this.max_x = 7;
        this.max_y = 7;
        this.min_x = 0;
        this.min_y = 0;
    }

    isValid() {
        return (
            this.x >= this.min_x &&
            this.x <= this.max_x &&
            this.y >= this.min_y &&
            this.y <= this.max_y
        );
    }

    add(other = new Tile()) {
        return new Tile(this.x + other.x, this.y + other.y);
    }

    substract(other = new Tile()) {
        return new Tile(this.x - other.x, this.y - other.y);
    }
}

module.exports = Tile;