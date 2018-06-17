(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.game = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _tile = require("./tile");

var _tile2 = _interopRequireDefault(_tile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    // Common variables
    this.style = {};
    this.game = {
      players: [{
        name: "White",
        score: 0
      }, {
        name: "Black",
        score: 0
      }],
      turn: 0,
      // 0 - White, 1 - Black
      grid: [// 0 - Empty, 1- White, 2 - Black
      [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 2, 1, 0, 0, 0], [0, 0, 0, 1, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
      directions: [new _tile2.default(-1, -1), new _tile2.default(0, -1), new _tile2.default(1, -1), new _tile2.default(-1, 0), new _tile2.default(1, 0), new _tile2.default(-1, 1), new _tile2.default(0, 1), new _tile2.default(1, 1)]
    }; // Utility functions

    this._dimensions = null;
  } // P5 setup


  _createClass(Game, [{
    key: "setup",
    value: function setup() {
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
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // 0 - 100
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
      return this.game.players[0].score.toString() + " - " + this.game.players[1].score.toString();
    }
  }, {
    key: "getCurrentPlayer",
    value: function getCurrentPlayer() {
      return this.game.turn == 0 ? "White" : "Black";
    }
  }, {
    key: "drawScoreboard",
    value: function drawScoreboard() {
      fill(this.style.text);
      textSize(this.dimensionsPercent(0, 10).y / 2);
      textAlign(LEFT);
      text(this.game.players[0].name, this.dimensionsPercentX(10), this.dimensionsPercentY(5));
      textAlign(RIGHT);
      text(this.game.players[1].name, this.dimensionsPercentX(90), this.dimensionsPercentY(5));
      textAlign(CENTER);
      text(this.getScore(), this.dimensionsPercentX(50), this.dimensionsPercentY(5));
      textSize(this.dimensionsPercent(0, 10).y / 4);
      text("".concat(this.getCurrentPlayer(), "s turn"), this.dimensionsPercentX(50), this.dimensionsPercentY(10));
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
      this.game.grid.forEach(function (row, y) {
        return row.forEach(function (value, x) {
          var blockPosition = _this.gridBlockPosition(x, y);

          fill(_this.style.block[value]);
          rect(blockPosition.x, blockPosition.y, blockPosition.w, blockPosition.h);
        });
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
      var whites = 0;
      var blacks = 0;
      this.game.grid.forEach(function (row, y) {
        return row.forEach(function (value, x) {
          if (value == 1) {
            console.log("".concat(x + 1, " ").concat(y + 1, " is white."));
            whites++;
          }

          if (value == 2) {
            console.log("".concat(x + 1, " ").concat(y + 1, " is black."));
            blacks++;
          }
        });
      });
      this.game.players[0].score = whites;
      this.game.players[1].score = blacks;
    }
  }, {
    key: "forEachBlock",
    value: function forEachBlock() {
      var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x, y, value) {};
      this.game.grid.forEach(function (row, y) {
        return row.forEach(function (value, x) {
          func(x, y, value);
        });
      });
    }
  }, {
    key: "blockClicked",
    value: function blockClicked(x, y) {
      if (this.getTileState(new _tile2.default(x, y)) == null) {
        this.game.grid[y][x] = 1 + this.game.turn;
        this.processChanges(new _tile2.default(x, y));
        this.game.turn = this.game.turn == 0 ? 1 : 0;
      }
    }
  }, {
    key: "touched",
    value: function touched() {
      var _this2 = this;

      var cursor_x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var cursor_y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.game.grid.forEach(function (row, y) {
        return row.forEach(function (value, x) {
          var blockBoundaries = _this2.gridBlockPosition(x, y);

          if (cursor_x > blockBoundaries.x && cursor_x < blockBoundaries.x + blockBoundaries.w && cursor_y > blockBoundaries.y && cursor_y < blockBoundaries.y + blockBoundaries.h && _this2.hasAdjecent(new _tile2.default(x, y))) {
            _this2.blockClicked(x, y);
          }
        });
      });
    }
  }, {
    key: "Tile",
    value: function Tile() {
      var _x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var _y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      return {
        x: _x,
        y: _y
      };
    }
  }, {
    key: "addTiles",
    value: function addTiles() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tile2.default();
      return {
        x: a.x + b.x,
        y: a.y + b.y
      };
    }
  }, {
    key: "getTileState",
    value: function getTileState() {
      var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      if (point.y < 0 || point.y > 7 || point.x < 0 || point.x > 7) return null;

      switch (this.game.grid[point.y][point.x]) {
        case 0:
          return null;

        case 1:
          return this.game.players[0].name;

        case 2:
          return this.game.players[1].name;
      }
    }
  }, {
    key: "filterDirection",
    value: function filterDirection() {
      var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _tile2.default();
      var filter = arguments[2];
      return filter({
        x: origin.x + direction.x,
        y: origin.y + direction.y
      });
    }
  }, {
    key: "processChanges",
    value: function processChanges() {
      var _this3 = this;

      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      // Check each directions
      this.game.directions.forEach(function (direction) {
        var blocksToSwitch = [];
        var directionPointer = direction; // Keep moving in each direction while encountering blocks of oposite color

        while (_this3.getTileState(_this3.addTiles(target, directionPointer)) !== null && _this3.getTileState(_this3.addTiles(target, directionPointer)) != _this3.getTileState(target)) {
          blocksToSwitch.push(_this3.addTiles(target, directionPointer));
          directionPointer = _this3.addTiles(directionPointer, direction);
        } // After the movement has been finished - if the encountered block is of original colour - claim the passed blocks


        if (_this3.getTileState(target) == _this3.getTileState(_this3.addTiles(target, directionPointer))) {
          blocksToSwitch.forEach(function (block, index) {
            var gameturn = _this3.game.turn;
            var block_x = block.x;
            var block_y = block.y;
            setTimeout(function () {
              _this3.game.grid[block_y][block_x] = 1 + gameturn;

              _this3.updateScore();
            }, 100 * index);
          });
        }
      });
    }
  }, {
    key: "hasAdjecent",
    value: function hasAdjecent() {
      var _this4 = this;

      var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _tile2.default();
      return this.game.directions.some(function (direction) {
        return _this4.getTileState(_this4.addTiles(target, direction)) !== null;
      });
    }
  }]);

  return Game;
}();

module.exports = new Game();

},{"./tile":3}],2:[function(require,module,exports){
"use strict";

module.exports = require('./game.js');

},{"./game.js":1}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tile = function () {
  function Tile() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Tile);

    this.x = x;
    this.y = y;
    this.max_x = 7;
    this.max_y = 7;
    this.min_x = 0;
    this.min_y = 0;
  }

  _createClass(Tile, [{
    key: "isValid",
    value: function isValid() {
      return this.x >= this.min_x && this.x <= this.max_x && this.y >= this.min_y && this.y <= this.max_y;
    }
  }]);

  return Tile;
}();

module.exports = Tile;

},{}]},{},[2])(2)
});
