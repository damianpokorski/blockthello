(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _tile = require("./tile");

var _tile2 = _interopRequireDefault(_tile);

var _player = require("./player");

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Board = function () {
  function Board() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

    _classCallCheck(this, Board); // Define properties


    this.width = width;
    this.height = height;
    this.tiles = []; // Initialize content

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        this.tiles.push(new _tile2.default(x, y));
      }
    }
  }

  _createClass(Board, [{
    key: "getFlippableTiles",
    value: function getFlippableTiles() {}
  }, {
    key: "canFlipTile",
    value: function canFlipTile() {}
  }, {
    key: "flipTile",
    value: function flipTile() {}
  }, {
    key: "getTile",
    value: function getTile(x, y) {
      return this.tiles.find(function (tile) {
        return tile.location.x == x && tile.location.y == y;
      });
      return null;
    }
  }, {
    key: "getTileByVector2D",
    value: function getTileByVector2D(v) {
      return this.getTile(v.x, v.y);
    }
  }, {
    key: "getTiles",
    value: function getTiles() {
      return this.tiles;
    }
  }, {
    key: "setTile",
    value: function setTile(x, y, player) {
      this.getTile(x, y).state = player.id;
    }
  }, {
    key: "getScore",
    value: function getScore(player) {
      return this.tiles.filter(function (tile) {
        tile.state == player.id;
      }).length;
    }
  }, {
    key: "compareTiles",
    value: function compareTiles(v1, v2, invert) {
      var t1 = this.getTileByVector2D(v1);
      var t2 = this.getTileByVector2D(v2);
      if (t1 == undefined || t2 == undefined) return false;
      return invert ? t1.state !== t2.state : t1.state == t2.state;
    }
  }, {
    key: "validateTile",
    value: function validateTile() {
      var tile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      return tile.location.x >= 0 && tile.location.x < this.width && tile.location.y >= 0 && tile.location.y < this.height;
    }
  }]);

  return Board;
}();

module.exports = Board;

},{"./player":4,"./tile":5}],2:[function(require,module,exports){
"use strict";

var _tile = require("./tile");

var _tile2 = _interopRequireDefault(_tile);

var _board = require("./board");

var _board2 = _interopRequireDefault(_board);

var _player = require("./player");

var _player2 = _interopRequireDefault(_player);

var _vector2d = require("./vector2d");

var _vector2d2 = _interopRequireDefault(_vector2d);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Game = function () {
  function Game() {
    _classCallCheck(this, Game); // Construct static player object


    this.player = {
      none: new _player2.default(0, "None"),
      white: new _player2.default(1, "White"),
      black: new _player2.default(2, "Black")
    };
    console.log(this.players);
    this.board = new _board2.default();
    this.board.setTile(3, 3, this.player.white);
    this.board.setTile(4, 4, this.player.white);
    this.board.setTile(3, 4, this.player.black);
    this.board.setTile(4, 3, this.player.black); // Common variables

    this.style = {};
    this.turn = 0; // 0 - White, 1 - Black
    // Utility functions

    this._dimensions = null;
  } // P5 setup


  _createClass(Game, [{
    key: "setup",
    value: function setup() {
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
    }
  }, {
    key: "dimensions",
    value: function dimensions() {
      var ratioX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
      var ratioY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
      if (!this._dimensions) this._dimensions = {
        w: window.innerHeight / ratioY * ratioX,
        h: window.innerHeight,
        x: (window.innerWidth - window.innerHeight / ratioY * ratioX) / 2,
        y: 0
      };
      return this._dimensions;
    }
  }, {
    key: "dimensionsPercentX",
    value: function dimensionsPercentX() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.dimensions().x + this.dimensions().w / 100 * x;
    }
  }, {
    key: "dimensionsPercentY",
    value: function dimensionsPercentY() {
      var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.dimensions().y + this.dimensions().h / 100 * y;
    }
  }, {
    key: "dimensionsPercent",
    value: function dimensionsPercent() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0; // 0 - 100

      return {
        x: this.dimensionsPercentX(x),
        y: this.dimensionsPercentY(y)
      };
    }
  }, {
    key: "drawPortrait",
    value: function drawPortrait() {
      fill(this.style.bg[1]);
      rect(this.dimensions().x, this.dimensions().y, this.dimensions().w, this.dimensions().h);
    }
  }, {
    key: "getScore",
    value: function getScore() {
      return this.player.white.score + " - " + this.player.black.score;
    }
  }, {
    key: "getCurrentPlayer",
    value: function getCurrentPlayer() {
      return this.turn == 0 ? this.player.white : this.player.black;
    }
  }, {
    key: "getNextPlayer",
    value: function getNextPlayer() {
      return this.turn == 1 ? this.player.white : this.player.black;
    }
  }, {
    key: "drawScoreboard",
    value: function drawScoreboard() {
      fill(this.style.text);
      textSize(this.dimensionsPercent(0, 10).y / 2);
      textAlign(LEFT);
      text(this.player.white.name, this.dimensionsPercentX(10), this.dimensionsPercentY(5));
      textAlign(RIGHT);
      text(this.player.black.name, this.dimensionsPercentX(90), this.dimensionsPercentY(5));
      textAlign(CENTER);
      text(this.getScore(), this.dimensionsPercentX(50), this.dimensionsPercentY(5));
      textSize(this.dimensionsPercent(0, 10).y / 4);
      text("".concat(this.getCurrentPlayer().name, "s turn"), this.dimensionsPercentX(50), this.dimensionsPercentY(10));
    }
  }, {
    key: "gridBlockPosition",
    value: function gridBlockPosition(X, Y) {
      var topOffset = this.dimensionsPercentY(10);
      var eight = this.dimensions().w / 8;
      return {
        x: this.dimensions().x + X * eight + eight / 8 / 2,
        y: this.dimensions().y + Y * eight + eight / 8 / 2 + topOffset,
        w: eight - eight / 8 * 1,
        h: eight - eight / 8 * 1
      };
    }
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      var _this = this;

      fill(this.style.white);
      this.board.tiles.forEach(function (tile) {
        var blockPosition = _this.gridBlockPosition(tile.location.x, tile.location.y);

        fill(_this.style.block[tile.state]);
        rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
      });
    }
  }, {
    key: "draw",
    // Rendering
    value: function draw() {
      clear();
      background(this.style.bg[0]);
      this.drawPortrait();
      this.drawScoreboard();
      this.drawGrid();
    }
  }, {
    key: "updateScore",
    value: function updateScore() {
      this.player.white.score = this.board.getScore(this.player.white);
      this.player.black.score = this.board.getScore(this.player.black);
    }
  }, {
    key: "blockClicked",
    value: function blockClicked() {
      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      this.board.setTile(target.location.x, target.location.y, this.getCurrentPlayer());

      if (this.blocksFlippedByPlacingTile(target).length > 0) {
        this.processChanges(target);
        this.turn = this.turn == 0 ? 1 : 0;
      } else {
        this.board.setTile(target.location.x, target.location.y, this.player.none);
      }
    }
  }, {
    key: "touched",
    value: function touched() {
      var _this2 = this;

      var cursor_x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var cursor_y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.board.tiles.forEach(function (tile) {
        var blockBoundaries = _this2.gridBlockPosition(tile.location.x, tile.location.y);

        if (cursor_x > blockBoundaries.x && cursor_x < blockBoundaries.x + blockBoundaries.w && cursor_y > blockBoundaries.y && cursor_y < blockBoundaries.y + blockBoundaries.h && _this2.hasAdjecent(tile)) {
          _this2.blockClicked(tile);
        }
      });
    }
  }, {
    key: "blocksFlippedByPlacingTile",
    value: function blocksFlippedByPlacingTile() {
      var _this3 = this;

      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      var blocksToSwitch = []; // Check each directions

      _vector2d2.default.directions_array().forEach(function (direction) {
        var passedBlocks = [];
        var pointer = target.location.add(direction); // Keep moving in each direction while encountering blocks of oposite color

        while (_this3.board.getTileByVector2D(pointer) && _this3.board.getTileByVector2D(pointer).state !== 0 && _this3.board.compareTiles(pointer, target.location, true)) {
          passedBlocks.push(pointer);
          console.log(['Passed', [pointer.x, pointer.y]]);
          pointer = pointer.add(direction);
        }

        if (passedBlocks.length) {
          console.log(['Finaly compare', _this3.board.getTileByVector2D(target.location).location, _this3.board.getTileByVector2D(target.location).state, _this3.board.getTileByVector2D(pointer).location, _this3.board.getTileByVector2D(pointer).state]);

          if (_this3.board.compareTiles(target.location, pointer)) {
            blocksToSwitch = blocksToSwitch.concat(passedBlocks);
          }
        }
      });

      return blocksToSwitch;
    }
  }, {
    key: "processChanges",
    value: function processChanges() {
      var _this4 = this;

      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      this.blocksFlippedByPlacingTile(target).forEach(function (block, index) {
        var gameturn = _this4.turn;
        var block_x = block.x;
        var block_y = block.y;

        _this4.board.setTile(block_x, block_y, _this4.getCurrentPlayer());

        _this4.updateScore();
      });
    }
  }, {
    key: "hasAdjecent",
    value: function hasAdjecent() {
      var _this5 = this;

      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      return _vector2d2.default.directions_array().some(function (direction) {
        return _this5.board.getTileByVector2D(target.location.add(direction)) !== null;
      });
    }
  }]);

  return Game;
}();

module.exports = new Game();

},{"./board":1,"./player":4,"./tile":5,"./vector2d":6}],3:[function(require,module,exports){
"use strict";

console.log('HELLO THERE!?');

var game = require('./game.js');

window.setup = function () {
  return game.setup();
};

window.draw = function () {
  return game.draw();
};

window.mouseclicked = function () {
  return game.touched(mouseX, mouseY);
};

window.touchStarted = function () {
  return game.touched(mouseX, mouseY);
};

console.log('Initialized..?');

},{"./game.js":2}],4:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var score = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  _classCallCheck(this, Player);

  this.id = id;
  this.name = name;
  this.score = score;
};

module.exports = Player;

},{}],5:[function(require,module,exports){
"use strict";

var _vector2d = require("./vector2d");

var _vector2d2 = _interopRequireDefault(_vector2d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tile = function Tile() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  _classCallCheck(this, Tile);

  this.location = new _vector2d2.default(x, y);
  this.state = 0;
};

module.exports = Tile;

},{"./vector2d":6}],6:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vector2D = function () {
  function Vector2D() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector2D);

    this.x = x;
    this.y = y;
  }

  _createClass(Vector2D, [{
    key: "add",
    value: function add() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2D();
      return new Vector2D(this.x + other.x, this.y + other.y);
    }
  }, {
    key: "substract",
    value: function substract() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2D();
      return new Vector2D(this.x - other.x, this.y - other.y);
    }
  }, {
    key: "multiply",
    value: function multiply() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2D();
      return new Vector2D(this.x * other.x, this.y * other.y);
    }
  }, {
    key: "divide",
    value: function divide() {
      var other = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2D();
      return new Vector2D(this.x / other.x, this.y / other.y);
    }
  }], [{
    key: "directions",
    value: function directions() {
      return {
        up: new Vector2D(0, -1),
        down: new Vector2D(0, 1),
        left: new Vector2D(-1, 0),
        right: new Vector2D(1, 0),
        up_left: new Vector2D(-1, -1),
        up_right: new Vector2D(1, -1),
        down_left: new Vector2D(-1, 1),
        down_right: new Vector2D(1, 1)
      };
    }
  }, {
    key: "directions_array",
    value: function directions_array() {
      return Object.values(this.directions());
    }
  }]);

  return Vector2D;
}();

module.exports = Vector2D;

},{}]},{},[3]);
