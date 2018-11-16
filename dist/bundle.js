/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/board.js":
/*!**********************!*\
  !*** ./lib/board.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Diamond = __webpack_require__(/*! ./diamond */ "./lib/diamond.js");


class Board {
  constructor(ctx) {
    this.board = Array.from(Array(7), () => new Array(7));
    this.oldX = 0;
    this.oldY = 0;
    this.newX = 0;
    this.newY = 0;
    this.ctx = ctx;
    this.addDiamonds();
    this.attachEvent();
  }

  isMatch(diamond) {
    const dirs = [[-1, 0], [0, -1]];
    for (let i = 0; i < 2; i++) {
      const match = this.traverseUpLeft(diamond, dirs[i], 1);
      if (match) return true;
    }
    return false;
  }

  // When populating the board, ensure there are no matches
  traverseUpLeft(diamond, dir, count) {
    // debugger
    if (count === 3) return true;
    const xNew = diamond.rowIdx + dir[0];
    const yNew = diamond.colIdx + dir[1];
    if (xNew < 0 || yNew < 0) return false;

    const nextDiamond = this.board[xNew][yNew];
    if (diamond.color === nextDiamond.color) {
      return this.traverseUpLeft(nextDiamond, dir, count + 1);
    } else {
      return false;
    }
  }

  randomColor() {
    const colors = ["red", "yellow", "orange", "lime", "fuchsia", "blue"];
    const ranIndex = Math.floor(Math.random() * colors.length);
    return colors[ranIndex];
  }

  addDiamonds() {
    for (var j = 0; j < 7; j++) {
      for (var i = 0; i < 7; i++) {
        let randColor = this.randomColor();
        let diamond = new Diamond(j, i, 20, randColor);
        this.board[i][j] = diamond;
        while (this.isMatch(diamond)) {
          diamond.color = this.randomColor();
        }
      }
    }
  }

  // When user is playing game - called after swaps
  findMatches() {
    let matches = [];
    const explored = [];
    const dirs = [[1, 0], [0, 1]];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        let diamond = this.board[i][j];
        if (!explored.includes(diamond)) {
          for (let d = 0; d < 2; d++) {
            matches = this.traverseDownRight(
              matches,
              explored,
              diamond,
              dirs[d]
            );
          }
        }
      }
    }

    // console.log(matches);

    // for (let m = 0; m < matches.length; m++) {
    //   matches[m].color = "black";
    //   matches[m].exist = false;
    //   matches[m].drawDiamond(this.ctx);
    // }

    this.shiftBoard(matches);
  }

  traverseDownRight(matches, explored, diamond, dir, path = []) {
    // debugger;
    explored.push(diamond);
    path.push(diamond);
    if (path.length > 2) {
      // console.log(path);
    }
    const xNew = diamond.rowIdx + dir[0];
    const yNew = diamond.colIdx + dir[1];
    // debugger

    if (xNew > 6 || yNew > 6) {
      if (path.length > 2) {
        return matches.concat(path);
      } else {
        return matches;
      }
    }
    let nextDiamond = this.board[xNew][yNew];
    if (diamond.color === nextDiamond.color) {
      // debugger
      return this.traverseDownRight(matches, explored, nextDiamond, dir, path);
    } else if (path.length > 2) {
      return matches.concat(path);
    } else {
      return matches;
    }
  }

  // shiftBoard() {
  //   // debugger
  //   for (let i = 0; i < 7; i++) {
  //     for (let j = 0; j < 7; j++) {
  //       let diamond = this.board[i][j];
  //       if (diamond.exist === false) {
  //         // debugger
  //         while (diamond.rowIdx >= 1) {
  //           const xNew = diamond.rowIdx - 1;
  //           const yNew = diamond.colIdx;
  //           const nextDiamond = this.board[xNew][yNew];
  //           diamond.color = nextDiamond.color;
  //           diamond.exist = true;
  //           diamond.rowIdx -= 1;
  //         }
  //         this.board[0][j].color = this.randomColor();
  //       }
  //     }
  //   }
  // }

  shiftBoard(matches) {
    matches.forEach(diamond => {
      // debugger;
      while (diamond.rowIdx >= 1) {
        const xNew = diamond.rowIdx - 1;
        const yNew = diamond.colIdx;
        const nextDiamond = this.board[xNew][yNew];
        // debugger
        // this.board[xNew+1][yNew] = nextDiamond;
        // diamond = nextDiamond;
        diamond.color = nextDiamond.color;
        this.board[xNew + 1][yNew].drawDiamond(this.ctx);
        diamond.rowIdx -= 1;
      }
      // this.board[0][diamond.colIdx].color = this.randomColor();
      this.board[0][diamond.colIdx].drawDiamond(this.ctx);
    });
  }

  drawBoard(ctx) {
    //length of a square
    const a = 65;
    //padding to the canvas
    const p = 400;

    for (var x = p; x <= 7 * a + p; x += a) {
      ctx.moveTo(x, 100);
      ctx.lineTo(x, 7 * a + 100);
    }

    for (var x = 100; x <= 7 * a + 100; x += a) {
      ctx.moveTo(p, x);
      ctx.lineTo(7 * a + p, x);
    }

    ctx.strokeStyle = "lightsteelblue";
    ctx.stroke();
  }

  attachEvent() {
    const canvasEl = document.getElementsByTagName("canvas")[0];
    // const ctx = canvasEl.getContext("2d");
    const p = 400;

    canvasEl.addEventListener("mousedown", event => {
      this.oldY = parseInt((event.offsetX - p) / 65);
      this.oldX = parseInt((event.offsetY - 100) / 65);
    });

    canvasEl.addEventListener("mouseup", event => {
      this.newY = parseInt((event.offsetX - p) / 65);
      this.newX = parseInt((event.offsetY - 100) / 65);
      const xDiff = this.newX - this.oldX;
      const yDiff = this.newY - this.oldY;
      if (!(Math.abs(xDiff)===1 && yDiff ===0)
        && !(Math.abs(yDiff) === 1 && xDiff === 0))
        {
          alert("Invalid Moves!")
      }
      // debugger
      // let temp1 = this.board[this.oldX][this.oldY];
      // let temp2 = this.board[this.newX][this.newY];
      // this.board[this.newX][this.newY] = temp1;
      // this.board[this.oldX][this.oldY] = temp2;

      // here we try to change position then change object but the color is still the same

      // let [X, Y] = [this.oldX, this.oldY];
      // [this.oldX, this.oldY] = [this.newX, this.newY]
      // [this.newX, this.newY] = [X, Y];


      // Change color => repaint works;

      let color1 = this.board[this.oldX][this.oldY].color;
      let color2 = this.board[this.newX][this.newY].color;
      this.board[this.newX][this.newY].color = color1;
      this.board[this.oldX][this.oldY].color = color2;
      this.board[this.newX][this.newY].drawDiamond(this.ctx);
      this.board[this.oldX][this.oldY].drawDiamond(this.ctx);
      // The way we draw diamond is by giving property to this.board[x][y]
      setTimeout(() => this.findMatches(), 100);
    });
  }

  drawDiamonds(ctx) {
    for (let j = 0; j < 7; j++) {
      for (let i = 0; i < 7; i++) {
        this.board[i][j].drawDiamond(ctx);
      }
    }
  }
}


module.exports = Board;

/***/ }),

/***/ "./lib/diamond.js":
/*!************************!*\
  !*** ./lib/diamond.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

class Diamond {

  constructor(colIdx, rowIdx, size, color){
    this.x = colIdx * 65 + 432.5 ; 
    this.y = rowIdx * 65 + 132.5;
    this.colIdx = colIdx;
    this.rowIdx = rowIdx
    this.size = size;
    this.color = color;
    // this.exist = true;
  }


  // The way set up draw is based on ColIdx, RowIdx
  // So it wont draw what we want on this.board[i][j]
  drawDiamond(ctx){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }


  // drawDiamond(ctx) {
  //     const d = 65
  //     //Ruby's
  //     var x = 105; var y = 125;
  //     var w = 55; var h = 50;
  //     let colors = ['#E3170D', '#9D1309', '#F22C1E'];
  //     this.sketch(x, y, w, h, ctx, colors);
  //     this.sketch(x+d, y, w, h, ctx, colors);
  //     this.sketch(x+2*d, y, w, h, ctx, colors);    
  // }

  // sketch(x, y, w, h, ctx, colors) {
  //   ctx.fillStyle = colors[0];
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  //   ctx.lineTo(x + w / 2, y + 0.7 * h);
  //   ctx.lineTo(x + w / 2, y);
  //   ctx.fill();
  
  //   ctx.fillStyle = colors[1];
  //   ctx.beginPath();
  //   ctx.moveTo(x + w / 2, y);
  //   ctx.lineTo(x + w / 2, y + 0.7 * h);
  //   ctx.lineTo(x + w, y);
  //   ctx.fill();
  
  //   // Upper left triangle
  //   ctx.beginPath();
  //   ctx.moveTo(x + w / 4, y - 0.3 * h);
  //   ctx.lineTo(x, y);
  //   ctx.lineTo(x + w / 2, y);
  //   ctx.fill();
  
  //   // centre inverted triangle
  //   ctx.fillStyle = colors[2];
  //   ctx.beginPath();
  //   ctx.moveTo(x + w / 4, y - 0.3 * h);
  //   ctx.lineTo(x + w / 2, y);
  //   ctx.lineTo(x + 0.75 * w, y - 0.3 * h);
  //   ctx.fill();
  
  //   //Upper left triangle.
  //   ctx.fillStyle = colors[0];
  //   ctx.beginPath();
  //   ctx.moveTo(x + 0.75 * w, y - 0.3 * h);
  //   ctx.lineTo(x + w / 2, y);
  //   ctx.lineTo(x + w, y);
  //   ctx.fill();
  
  // }
}

module.exports = Diamond


// //Saphires's
// var x = 300; var y = 100;
// var w = 200; var h = 200;
// colors = ['#3366CC', '#003399', '#333399'];
// sketch(x, y, w, h, ctx, colors);

// //Emerald's
// var x = 500; var y = 100;
// var w = 200; var h = 200;
// colors = ['#4BB74C', '#517B58', '#5B9C64'];
// sketch(x, y, w, h, ctx, colors);

/***/ }),

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(/*! ./board */ "./lib/board.js");
const Diamond = __webpack_require__(/*! ./diamond */ "./lib/diamond.js");


class Game {
  constructor(ctx){
    this.ctx = ctx;
  }


  start(ctx){
    this.board = new Board(ctx)
    this.board.drawBoard(ctx);
    this.board.drawDiamonds(ctx);
    // this.attachListener(this.board);
  }

  draw() {
    // this.board.drawDiamonds(this.ctx);    
    // requestAnimationFrame(this.draw.bind(this))
  }

  // attachListener(board) {
  //   const body = document.getElementsByTagName('body')[0];
  //   body.addEventListener('click', () => {
  //     board.findMatches();
  //     console.log(Object.assign(board));
  //   })
  // }
}


module.exports = Game;

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(/*! ./game */ "./lib/game.js")

document.addEventListener("DOMContentLoaded", () => {
  console.log("Webpack is working")
  const canvasEl = document.getElementsByTagName("canvas")[0];
  const width = canvasEl.width = window.innerWidth;
  const height = canvasEl.height = window.innerHeight;
  const ctx = canvasEl.getContext("2d");
  
  const game = new Game(ctx);
  game.start(ctx);

});



/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map