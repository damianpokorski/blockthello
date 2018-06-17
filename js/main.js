// Common variables
var style = {

};
var game = {
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
        tile(-1, -1), tile(0, -1), tile(1, -1),
        tile(-1, 0), tile(1, 0),
        tile(-1, 1), tile(0, 1), tile(1, 1)
    ]
};
// P5 setup
function setup() {
    style = {
        bg: [color('#574AE2'), color('#222A68')],
        fg: color('#654597'),
        highlight: color('#AB81CD'),
        light: color('#E2ADF2'),
        white: color('#FFAAAA'),
        text: color('#FFFFFF'),
        block: {
            0: color('#FFFFFF33'),
            1: color('#FFFFFFFF'),
            2: color('#F55')
        }
    };
    noStroke();
    createCanvas(window.innerWidth, window.innerHeight);
    console.log([window.innerWidth, innerHeight]);

    drawGrid();
}

// Utility functions
var _dimensions = null;

function dimensions(ratioX = 9, ratioY = 16) {
    if (!_dimensions)
        _dimensions = {
            w: window.innerHeight / ratioY * ratioX,
            h: window.innerHeight,
            x: (window.innerWidth - (window.innerHeight / ratioY * ratioX)) / 2,
            y: 0
        };
    return _dimensions;
}

function dimensionsPercentX(x = 0) {
    return dimensions().x + (dimensions().w / 100) * x;
}

function dimensionsPercentY(y = 0) {
    return dimensions().y + (dimensions().h / 100) * y
}

function dimensionsPercent(x = 0, y = 0) { // 0 - 100
    return {
        x: dimensionsPercentX(x),
        y: dimensionsPercentY(y)
    }
}

function drawPortrait() {
    fill(style.bg[1]);
    rect(dimensions().x, dimensions().y, dimensions().w, dimensions().h);
}

function getScore() {
    return game.players[0].score.toString() + " - " + game.players[1].score.toString();
}

function getCurrentPlayer() {
    return game.turn == 0 ? "White" : "Black";
}

function drawScoreboard() {
    fill(style.text);
    textSize(dimensionsPercent(0, 10).y / 2);
    textAlign(LEFT);
    text(game.players[0].name, dimensionsPercentX(10), dimensionsPercentY(5));
    textAlign(RIGHT);
    text(game.players[1].name, dimensionsPercentX(90), dimensionsPercentY(5));
    textAlign(CENTER);
    text(getScore(), dimensionsPercentX(50), dimensionsPercentY(5));

    textSize(dimensionsPercent(0, 10).y / 4);
    text(`${getCurrentPlayer()}s turn`, dimensionsPercentX(50), dimensionsPercentY(10));
}

function gridBlockPosition(X, Y) {
    var topOffset = dimensionsPercentY(10);
    var eight = dimensions().w / 8;
    return {
        x: dimensions().x + (X * eight) + (eight / 8 / 2),
        y: dimensions().y + (Y * eight) + (eight / 8 / 2) + topOffset,
        w: (eight) - (eight / 8 * 1),
        h: (eight) - (eight / 8 * 1)
    };
}

function drawGrid() {
    fill(style.white);

    game.grid.forEach((row, y) => row.forEach((value, x) => {
        var blockPosition = gridBlockPosition(x, y);
        fill(style.block[value]);
        rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
    }));
}

// Rendering
function draw() {
    clear();
    background(style.bg[0]);
    drawPortrait();
    drawScoreboard();
    drawGrid();
}

function updateScore() {
    var whites = 0;
    var blacks = 0;
    game.grid.forEach((row, y) => row.forEach((value, x) => {
        if (value == 1)
            whites++;
        if (value == 2)
            blacks++;
    }));
    game.players[0].score = whites;
    game.players[1].score = blacks;
}

function forEachBlock(func = (x, y, value) => {}) {
    game.grid.forEach((row, y) => row.forEach((value, x) => {
        func(x, y, value);
    }));
}

function blockClicked(x, y) {
    if (getTileState(tile(x, y)) == null) {
        game.grid[y][x] = 1 + game.turn;
        processChanges(tile(x, y));
        updateScore();
        game.turn = game.turn == 0 ? 1 : 0;
    }
}

function mouseClicked() {
    game.grid.forEach((row, y) => row.forEach((value, x) => {
        var blockBoundaries = gridBlockPosition(x, y);
        if (
            mouseX > blockBoundaries.x &&
            mouseX < blockBoundaries.x + blockBoundaries.w &&
            mouseY > blockBoundaries.y &&
            mouseY < blockBoundaries.y + blockBoundaries.h &&
            hasAdjecent(tile(x, y))
        ) {
            blockClicked(x, y);
        }
    }));
}

function tile(_x = 0, _y = 0) {
    return { x: _x, y: _y };
}

function addTiles(a = tile(), b = tile()) {
    return { x: a.x + b.x, y: a.y + b.y };
}

function getTileState(point = tile()) {
    if (
        point.y < 0 ||
        point.y > 7 ||
        point.x < 0 ||
        point.x > 7
    ) return null;

    switch (game.grid[point.y][point.x]) {
        case 0:
            return null;
        case 1:
            return game.players[0].name;
        case 2:
            return game.players[1].name;
    }
}

function filterDirection(origin = tile(), direction = tile(), filter) {
    return filter({
        x: origin.x + direction.x,
        y: origin.y + direction.y
    });
}

function processChanges(target = tile()) {
    // Check each directions
    game.directions.forEach((direction) => {
        var blocksToSwitch = [];
        var directionPointer = direction;

        // Keep moving in each direction while encountering blocks of oposite color
        while (
            getTileState(addTiles(target, directionPointer)) !== null &&
            getTileState(addTiles(target, directionPointer)) != getTileState(target)
        ) {
            blocksToSwitch.push(addTiles(target, directionPointer));
            directionPointer = addTiles(directionPointer, direction);
        }

        // After the movement has been finished - if the encountered block is of original colour - claim the passed blocks
        if (getTileState(target) == getTileState(addTiles(target, directionPointer))) {
            blocksToSwitch.forEach((block, index) => {
                let gameturn = game.turn;
                let block_x = block.x;
                let block_y = block.y;
                setTimeout(() => {
                    game.grid[block_y][block_x] = 1 + gameturn;
                    console.log('TICK!');
                }, 100 * index);
            });
        }
    });
}

function hasAdjecent(target = tile()) {
    return game.directions.some((direction) => {
        return (getTileState(addTiles(target, direction)) !== null);
    });
}