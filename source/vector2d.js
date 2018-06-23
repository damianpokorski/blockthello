class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;


    }

    static directions() {
        return {
            up: new Vector2D(0, -1),
            down: new Vector2D(0, 1),
            left: new Vector2D(-1, 0),
            right: new Vector2D(1, 0),
            up_left: new Vector2D(-1, -1),
            up_right: new Vector2D(1, -1),
            down_left: new Vector2D(-1, 1),
            down_right: new Vector2D(1, 1)
        }
    }
    static directions_array() {
        return Object.values(this.directions());
    }

    add(other = new Vector2D()) {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }
    substract(other = new Vector2D()) {
        return new Vector2D(this.x - other.x, this.y - other.y);
    }
    multiply(other = new Vector2D()) {
        return new Vector2D(this.x * other.x, this.y * other.y);
    }
    divide(other = new Vector2D()) {
        return new Vector2D(this.x / other.x, this.y / other.y);
    }
}

module.exports = Vector2D;