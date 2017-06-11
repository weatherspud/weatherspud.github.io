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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const HEX_RADIUS = 1 / Math.sqrt(3);
  const HEX_VERTEX_ANGLES_COLUMNS = [0, 1, 2, 3, 4, 5].map(function (n) {
    return (2 * n) * Math.PI / 6;
  });
  const COORDINATE_STYLE_ALPHANUMERIC = 'alphanumeric';
  const COORDINATE_STYLE_NUMERIC = 'numeric';
  const COORDINATE_STYLE_NONE = 'none';

  const int_to_alpha = function (n) {
    return ' ' + String.fromCharCode((n - 1) % 26 + 65);
  };

  class Hex {
    constructor (x, y, scale = 1, row = 1, column = 1, coordinate_style = COORDINATE_STYLE_NUMERIC) {
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.row = row;
      this.column = column;
      this.coordinate_style = coordinate_style;
      this.radius = HEX_RADIUS * scale;
      this.font_size = 12;
      this.font_family = 'Arial';
    }

    corners () {
      const x = this.x;
      const y = this.y;
      const radius = this.radius;
      return HEX_VERTEX_ANGLES_COLUMNS.map(function (angle) {
        return [
          x + radius * Math.cos(angle),
          y + radius * Math.sin(angle)
        ];
      });
    }

    text () {
      const col = this.column < 10 ? '0' + this.column : '' + this.column;
      const row = this.row < 10 ? '0' + this.row : '' + this.row;
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', this.x - this.radius * 0.25);
      text.setAttribute('y', this.y - this.radius * 0.55);
      text.setAttribute('font-family', this.font_family);
      text.setAttribute('font-size', this.font_size);
      if (this.coordinate_style === COORDINATE_STYLE_NUMERIC) {
        text.textContent = col + row;
      } else if (this.coordinate_style === COORDINATE_STYLE_ALPHANUMERIC) {
        text.textContent = int_to_alpha(col) + row;
      } else {
        throw new Error('unsupported coordinate style: ' + this.coordinate_style);
      }

      return text;
    }

    polygon () {
      const points_value = this.corners().map(function (point) { return point.join(','); }).join(',');
      const polygon = document.createElementNS(SVG_NS, 'polygon');
      polygon.setAttribute('points', points_value);
      polygon.setAttribute('stroke-mitrelimit', 1);
      polygon.setAttribute('stroke', 'black');
      polygon.setAttribute('fill', 'none');

      return polygon;
    }

    elements () {
      let retval = [];
      retval.push(this.polygon());
      if (this.coordinate_style !== COORDINATE_STYLE_NONE) {
        retval.push(this.text());
      }

      return retval;
    }
  }

  const row_column_to_x_y_center = function (row, column, start_row, start_column, origin_x = 0, origin_y = 0, scale = 1) {
    let y = scale * ((row - start_row + 1) + ((column - start_column + 1) % 2 === 0 ? 0.5 : 0)) + origin_y;
    let x = scale * (Math.sqrt(3) / 2) * (column - start_column + 1) + origin_x;

    return [x, y];
  };

  const grid = function (width, height, start_col, start_row, coordinate_style, origin_x = 0, origin_y = 0, scale = 80) {
    let grid = [];
    for (let row = start_row; row <= height + start_row - 1; ++row) {
      for (let col = start_col; col <= width + start_col - 1; ++col) {
        const x_y = row_column_to_x_y_center(row, col, start_row, start_col, origin_x, origin_y, scale);
        const hex = new Hex(x_y[0], x_y[1], scale, row, col, coordinate_style);
        grid = grid.concat(hex.elements());
      }
    }

    return grid;
  };

  const render_form = function (url) {
    let form = document.createElement('form');
    form.setAttribute('method', 'get');
    form.setAttribute('action', url.origin + url.pathname);

    let label_x = document.createElement('label');
    label_x.textContent = 'Rows:';
    form.appendChild(label_x);

    let input_x = document.createElement('input');
    input_x.setAttribute('name', 'rows');
    input_x.setAttribute('type', 'text');
    input_x.setAttribute('value', '10');
    form.appendChild(input_x);

    form.appendChild(document.createElement('br'));

    let label_y = document.createElement('label');
    label_y.textContent = 'Columns:';
    form.appendChild(label_y);

    let input_y = document.createElement('input');
    input_y.setAttribute('name', 'columns');
    input_y.setAttribute('type', 'text');
    input_y.setAttribute('value', '8');
    form.appendChild(input_y);

    form.appendChild(document.createElement('br'));

    let label_start_row = document.createElement('label');
    label_start_row.textContent = 'Start Row:';
    form.appendChild(label_start_row);

    let input_start_row = document.createElement('input');
    input_start_row.setAttribute('name', 'start_row');
    input_start_row.setAttribute('type', 'text');
    input_start_row.setAttribute('value', '1');
    form.appendChild(input_start_row);

    form.appendChild(document.createElement('br'));

    let label_start_col = document.createElement('label');
    label_start_col.textContent = 'Start Column:';
    form.appendChild(label_start_col);

    let input_start_col = document.createElement('input');
    input_start_col.setAttribute('name', 'start_column');
    input_start_col.setAttribute('type', 'text');
    input_start_col.setAttribute('value', '1');
    form.appendChild(input_start_col);

    form.appendChild(document.createElement('br'));

    let input_coordinate_style_alphanumeric = document.createElement('input');
    input_coordinate_style_alphanumeric.setAttribute('type', 'radio');
    input_coordinate_style_alphanumeric.setAttribute('name', 'coordinate_style');
    input_coordinate_style_alphanumeric.setAttribute('value', 'alphanumeric');
    input_coordinate_style_alphanumeric.setAttribute('checked', 'checked');
    form.appendChild(input_coordinate_style_alphanumeric);

    let label_coordinate_style_alphanumeric = document.createElement('label');
    label_coordinate_style_alphanumeric.textContent = 'alphanumeric coordinates';
    form.appendChild(label_coordinate_style_alphanumeric);

    form.appendChild(document.createElement('br'));

    let input_coordinate_style_numeric = document.createElement('input');
    input_coordinate_style_numeric.setAttribute('type', 'radio');
    input_coordinate_style_numeric.setAttribute('name', 'coordinate_style');
    input_coordinate_style_numeric.setAttribute('value', 'numeric');
    form.appendChild(input_coordinate_style_numeric);

    let label_coordinate_style_numeric = document.createElement('label');
    label_coordinate_style_numeric.textContent = 'numeric coordinates';
    form.appendChild(label_coordinate_style_numeric);

    form.appendChild(document.createElement('br'));

    let input_coordinate_style_none = document.createElement('input');
    input_coordinate_style_none.setAttribute('type', 'radio');
    input_coordinate_style_none.setAttribute('name', 'coordinate_style');
    input_coordinate_style_none.setAttribute('value', 'none');
    form.appendChild(input_coordinate_style_none);

    let label_coordinate_style_none = document.createElement('label');
    label_coordinate_style_none.textContent = 'no coordinates';
    form.appendChild(label_coordinate_style_none);

    form.appendChild(document.createElement('br'));

    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('valu', 'Create Grid');
    form.appendChild(submit);
    document.body.appendChild(form);
  };

  const render = function (url_string) {
    let url = new URL(url_string);
    let rowsParam = url.searchParams.get('rows');
    let columnsParam = url.searchParams.get('columns');
    let startRowParam = url.searchParams.get('start_row') || '1';
    let startColParam = url.searchParams.get('start_column') || '1';
    let coordinate_style = url.searchParams.get('coordinate_style') || COORDINATE_STYLE_ALPHANUMERIC;

    if (rowsParam && columnsParam) {
      let rows = parseInt(rowsParam);
      let columns = parseInt(columnsParam);
      let startRow = parseInt(startRowParam);
      let startCol = parseInt(startColParam);
      let svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('width', Math.ceil(80 * columns * Math.sqrt(3) / 2) + 90);
      svg.setAttribute('height', rows * 80 + 120);
      grid(columns, rows, startCol, startRow, coordinate_style).forEach(function (element) {
        svg.appendChild(element);
      });
      document.body.appendChild(svg);
    } else {
      render_form(url);
    }
  };

  render(window.location.href);
})();


/***/ })
/******/ ]);