import {
  bubblesort,
  quicksort,
  heapsort,
  mergesort,
} from "./sortingalgorithms.js";
import { Astar, Astarfunc, makeGrid, updateGrid } from "./Astar.js";
import { Linked, Bst } from "./datastructures.js";

class Webgraphics {
  //requires id of canvas and webgl type
  constructor(CANVAS_ID, WEBGL_V, valx = 0, valy = 0) {
    this.canvas = document.querySelector(CANVAS_ID);
    try {
      this.gl = this.canvas.getContext("webgl2"); // webgl
    } catch (err) {
      this.gl = this.canvas.getContext(WEBGL_V);
    }

    if (!this.gl) {
      alert(WEBGL_V + " Not Working");
    }
    this.setResolution(valx, valy);
  }

  //x,y position on the screen, Note:: <canvas width==canvas.clientWidth>
  setResolution(x = 0, y = 0) {
    let res = [this.canvas.clientWidth, this.canvas.clientHeight];
    // this.gl.viewport(x, y, res[0], res[1]);
  }

  createProgramandattachShaders(V_shader, F_shader) {
    let program = this.gl.createProgram();
    this.gl.attachShader(program, V_shader);
    this.gl.attachShader(program, F_shader);
    this.gl.linkProgram(program);
    return program;
  }

  createAndBindBuffer() {
    let buff = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buff);
  }
  //clear the View
  clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}

const RecShaders = {
  compiled: false,
  Vshadersource: [
    "precision mediump float;",
    "",
    "attribute vec2 vertPosition;",
    "uniform vec2 u_resolution;",
    "",
    "void main()",
    "{",
    "  vec2 zeroToOne = vertPosition / u_resolution;",
    "  vec2 zeroToTwo = zeroToOne * 2.0;",
    "  vec2 Clipspace = zeroToTwo - 1.0;",
    "  gl_Position = vec4(Clipspace, 0.0, 1.0);",
    "}",
  ].join("\n"),

  Fshadersource: [
    "precision mediump float;",
    "",
    "uniform vec3 fragColor;",
    "void main()",
    "{",
    "  gl_FragColor = vec4(fragColor, 1.0);",
    "}",
  ].join("\n"),
};

const LineShaders = {
  compiled: false,
  Vshadersource: [
    "precision highp float;",
    "",
    "attribute vec2 vertPosition;",
    "uniform vec2 u_resolution;",
    "",
    "void main()",
    "{",
    "vec2 zeroToOne = vertPosition / u_resolution;",
    "vec2 zeroToTwo = zeroToOne*2.0;",
    "vec2 Clipspace = zeroToTwo - 1.0;",
    "gl_Position = vec4(Clipspace, 0.0, 1.0);",
    "}",
  ].join("\n"),

  Fshadersource: [
    "precision highp float;",
    "",
    "uniform vec3 fragColor;",
    "void main()",
    "{",
    "  gl_FragColor = vec4(fragColor, 1.0);",
    "}",
  ].join("\n"),
};

function compileShaders(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error Compiling Shader", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return NULL;
  }
  return shader;
}

class Rectangle {
  static Vshader = null;
  static Fshader = null;
  static program = null;
  constructor(parent) {
    this.parent = parent;
    this.position = [];
    this.color = [];

    //GLSL code required for drawing Shaders
    if (!RecShaders.compiled) {
      Rectangle.Vshader = compileShaders(
        this.parent.gl,
        this.parent.gl.VERTEX_SHADER,
        RecShaders.Vshadersource
      );
      Rectangle.Fshader = compileShaders(
        this.parent.gl,
        this.parent.gl.FRAGMENT_SHADER,
        RecShaders.Fshadersource
      );
      RecShaders.compiled = true;
    }
    if (Rectangle.program == null) {
      Rectangle.program = this.parent.createProgramandattachShaders(
        Rectangle.Vshader,
        Rectangle.Fshader
      );
      this.parent.gl.useProgram(Rectangle.program);
      this.parent.createAndBindBuffer();
    }
  }

  setResolution() {
    //set u_resolution attribute
    let PositionUresolution = this.parent.gl.getUniformLocation(
      Rectangle.program,
      "u_resolution"
    );
    let res = [
      this.parent.canvas.clientWidth,
      this.parent.canvas.clientHeight,
    ];
    this.parent.gl.uniform2f(PositionUresolution, res[0], res[1]);
  }

  setParent(parent) {
    this.parent = parent;
  }

  setGeometry(x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    this.position = [x1, y1, x1, y2, x2, y1, x2, y2];
  }

  //Color_name = red,green,blue,yellow,purple,black
  setColor(color_name) {
    if (color_name == "red") {
      this.color = [1, 96 / 255, 146 / 255];
    } else if (color_name == "green") {
      this.color = [92 / 255, 1, 133 / 255];
    } else if (color_name == "blue") {
      this.color = [92 / 255, 149 / 255, 1.0];
    } else if (color_name == "yellow") {
      this.color = [1.0, 225 / 255, 92 / 255];
    } else if (color_name == "purple") {
      this.color = [149 / 255, 92 / 255, 1];
    } else {
      this.color = [0, 0, 0];
    }
  }

  draw(drawing = true) {
    if (drawing) {
      if (!this.parent.program) {
        this.parent.createProgramandattachShaders(
          Rectangle.Vshader,
          Rectangle.Fshader
        );
      }
      this.parent.gl.useProgram(Rectangle.program);
      this.setResolution();
      this.parent.gl.bufferData(
        this.parent.gl.ARRAY_BUFFER,
        new Float32Array(this.position),
        this.parent.gl.STATIC_DRAW
      );
      let positionAttribLocation = this.parent.gl.getAttribLocation(
        Rectangle.program,
        "vertPosition"
      );
      let colorUniformLocation = this.parent.gl.getUniformLocation(
        Rectangle.program,
        "fragColor"
      );
      this.parent.gl.uniform3f(
        colorUniformLocation,
        this.color[0],
        this.color[1],
        this.color[2]
      );

      this.parent.gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        this.parent.gl.FLOAT,
        this.parent.gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      this.parent.gl.enableVertexAttribArray(positionAttribLocation);
      this.parent.gl.drawArrays(this.parent.gl.TRIANGLE_STRIP, 0, 4);
    }
  }
}

class Line {
  static Vshader = null;
  static Fshader = null;
  static program = null;
  constructor(parent) {
    this.parent = parent;
    this.position = [];
    this.color = [];

    //GLSL code required for drawing Shaders
    if (!LineShaders.compiled) {
      Line.Vshader = compileShaders(
        this.parent.gl,
        this.parent.gl.VERTEX_SHADER,
        LineShaders.Vshadersource
      );
      Line.Fshader = compileShaders(
        this.parent.gl,
        this.parent.gl.FRAGMENT_SHADER,
        LineShaders.Fshadersource
      );
      LineShaders.compiled = true;
    }
    if (Line.program == null) {
      Line.program = this.parent.createProgramandattachShaders(
        Line.Vshader,
        Line.Fshader
      );
      this.parent.gl.useProgram(Line.program);
      this.parent.createAndBindBuffer();
    }
  }

  setParent(parent) {
    this.parent = parent;
  }

  setResolution() {
    //set u_resolution attribute
    let PositionUresolution = this.parent.gl.getUniformLocation(
      Line.program,
      "u_resolution"
    );
    let res = [
      this.parent.canvas.clientWidth,
      this.parent.canvas.clientHeight,
    ];
    this.parent.gl.uniform2f(PositionUresolution, res[0], res[1]);
  }

  setGeometry(x, y, distance, angle) {
    var x1 = x;
    var x2 = Math.floor(Math.cos((angle * Math.PI) / 180)) * distance + x;
    var y1 = y;
    var y2 = Math.floor(Math.sin((angle * Math.PI) / 180)) * distance + y;
    this.position = [x1, y1, x2, y2];
  }

  setGeometryp(x, y, x1, y1) {
    this.position = [x, y, x1, y1];
  }

  setColor(color_name) {
    if (color_name == "red") {
      this.color = [1, 96 / 255, 146 / 255];
    } else if (color_name == "green") {
      this.color = [92 / 255, 1, 133 / 255];
    } else if (color_name == "blue") {
      this.color = [92 / 255, 149 / 255, 1.0];
    } else if (color_name == "yellow") {
      this.color = [1.0, 225 / 255, 92 / 255];
    } else if (color_name == "purple") {
      this.color = [149 / 255, 92 / 255, 1];
    } else {
      this.color = [0, 0, 0];
    }
  }

  draw(drawing = true) {
    if (drawing) {
      if (!this.parent.program) {
        this.parent.createProgramandattachShaders(Line.Vshader, Line.Fshader);
      }
      this.parent.gl.useProgram(Line.program);
      this.setResolution();
      this.parent.gl.bufferData(
        this.parent.gl.ARRAY_BUFFER,
        new Float32Array(this.position),
        this.parent.gl.STATIC_DRAW
      );
      let positionAttribLocation = this.parent.gl.getAttribLocation(
        Line.program,
        "vertPosition"
      );
      let colorUniformLocation = this.parent.gl.getUniformLocation(
        Line.program,
        "fragColor"
      );
      this.parent.gl.uniform3f(
        colorUniformLocation,
        this.color[0],
        this.color[1],
        this.color[2]
      );

      this.parent.gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        this.parent.gl.FLOAT,
        this.parent.gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      this.parent.gl.enableVertexAttribArray(positionAttribLocation);
      this.parent.gl.drawArrays(this.parent.gl.LINES, 0, 2);
    }
  }
}

//Circ Shaders Class
const CircShaders = {
  compiled: false,
};

//class for drawing circles
class Circle {
  static Vshader = null;
  static Fshader = null;
  static program = null;
  constructor(parent) {
    this.parent = parent;
    this.position = [];
    this.color = [];

    //GLSL code required for drawing Shaders
    if (!CircShaders.compiled) {
      Circle.Vshader = compileShaders(
        this.parent.gl,
        this.parent.gl.VERTEX_SHADER,
        RecShaders.Vshadersource
      );
      Circle.Fshader = compileShaders(
        this.parent.gl,
        this.parent.gl.FRAGMENT_SHADER,
        RecShaders.Fshadersource
      );
      CircShaders.compiled = true;
      if (!Circle.program) {
        Circle.program = this.parent.createProgramandattachShaders(
          Circle.Vshader,
          Circle.Fshader
        );
      }
      if (!this.parent.buff) {
        this.parent.createAndBindBuffer();
      }
    }
  }

  setParent(parent) {
    this.parent = parent;
  }

  setGeometry(x, y, radius) {
    var N = 100;
    this.position = [x, y];

    for (var i = 0; i <= N; i++) {
      var theta = (i * 2 * Math.PI) / N;
      var k = radius * Math.sin(theta) + x; //+ x;
      var m = radius * Math.cos(theta) + y; //+ y;
      this.position.push(k, m);
    }
  }

  setResolution() {
    //set u_resolution attribute
    this.parent.gl.useProgram(Circle.program);
    let PositionUresolution = this.parent.gl.getUniformLocation(
      Circle.program,
      "u_resolution"
    );
    let res = [
      this.parent.canvas.clientWidth,
      this.parent.canvas.clientHeight,
    ];
    this.parent.gl.uniform2f(PositionUresolution, res[0], res[1]);
  }

  setColor(color_name) {
    if (color_name == "red") {
      this.color = [1, 96 / 255, 146 / 255];
    } else if (color_name == "green") {
      this.color = [92 / 255, 1, 133 / 255];
    } else if (color_name == "blue") {
      this.color = [92 / 255, 149 / 255, 1.0];
    } else if (color_name == "yellow") {
      this.color = [1.0, 225 / 255, 92 / 255];
    } else if (color_name == "purple") {
      this.color = [149 / 255, 92 / 255, 1];
    } else {
      this.color = [0, 0, 0];
    }
  }

  draw(drawing = true) {
    if (drawing) {
      this.parent.gl.useProgram(Circle.program);
      this.setResolution();
      this.parent.gl.bufferData(
        this.parent.gl.ARRAY_BUFFER,
        new Float32Array(this.position),
        this.parent.gl.STATIC_DRAW
      );
      let positionAttribLocation = this.parent.gl.getAttribLocation(
        Circle.program,
        "vertPosition"
      );
      let colorUniformLocation = this.parent.gl.getUniformLocation(
        Circle.program,
        "fragColor"
      );
      this.parent.gl.uniform3f(
        colorUniformLocation,
        this.color[0],
        this.color[1],
        this.color[2]
      );

      this.parent.gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        this.parent.gl.FLOAT,
        this.parent.gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      this.parent.gl.enableVertexAttribArray(positionAttribLocation);
      this.parent.gl.drawArrays(
        this.parent.gl.TRIANGLE_FAN,
        0,
        this.position.length / 2
      );
    }
  }
}

class Ctx {
  constructor(CANVAS_ID) {
    this.canvas = document.querySelector(CANVAS_ID);
    this.ctx = this.canvas.getContext("2d");
  }

  draw(text, pos) {
    this.ctx.font = "20px serif";
    let res = this.canvas.getBoundingClientRect();
    this.ctx.strokeText(text, pos[0], res.height - pos[1]);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

//returns Random value-> set Range (250,20)->(pixel)
function Randomvalue(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Utils = {
  Webglv: new Webgraphics("#CANVAS", "webgl"),
  ctx: new Ctx("#canvas"),
  rect: [],
  queue: [],
  // frameRate : 100,

  Sorting: {
    drawStartPoint: 0,
    width: 8, //8,
    space: 4,
    drawNumbers: true,
    arr: [],
    arr_y: [],
    newarray: function (arr_size) {
      let b;
      Utils.Sorting.arr = [];
      for (let i = 0; i < arr_size; i++) {
        b = Randomvalue(450, 50);
        Utils.Sorting.arr.push(b);
      }
    },
  },
  Circle: {
    radiusofCircle: 50,
    distanceofLine: 40,
  },
  Drawmodes: 0x008,
  canvas: {
    canv: document.getElementById("CANVAS"),
    getRes: function () {
      return [
        Utils.canvas.canv.clientWidth,
        Utils.canvas.canv.clientHeight,
        Utils.canvas.canv.getBoundingClientRect(),
      ];
    },
  },
  AnimationController: {
    queueIndex: 0,
    queueIncrement: 1,
    frameRate: 100,
    recentFrameRate: 100,
    playing: false,
    animationNo: 0,
    now: 0,
    elapsed_time: 0,
    time: Date.now(),
    cancelAnimation: function () {
      window.cancelAnimationFrame(Utils.AnimationController.animation);
      document.getElementById("playPause").classList.toggle("paused");
    },
  },
};
var line = new Line(Utils.Webglv);
var bars = new Rectangle(Utils.Webglv);
var queue_element;

function getStartingpointofrectdraw() {
  const length = Utils.Sorting.arr.length;
  const { width, space } = Utils.Sorting;
  let widthofdiagram = length * (width + space) - 2 * space;
  let canvaswidth = Utils.canvas.getRes();
  Utils.Sorting.drawStartPoint = (canvaswidth[0] / 2) - (widthofdiagram / 2);
  if (window.innerWidth < 1000) {
    Utils.Sorting.drawStartPoint = Utils.Sorting.drawStartPoint / 4;
  }
}

function drawBars(color = "green") {
  var arr = Utils.Sorting.arr_y;
  Utils.Webglv.clear();
  Utils.ctx.clear();
  getStartingpointofrectdraw();
  line.setGeometryp(0, 468, 800, 468);
  line.draw();
  if (color === "red") {
    arr = Utils.Sorting.arr;
    Utils.ctx.draw("ArrayLength: " + arr.length.toString(), [10, 470]);
  } else {
    Utils.ctx.draw(
      "Noofcomparisions: " +
      queue_element[3].toString() +
      "    ArrayLength: " +
      Utils.Sorting.arr_y.length.toString(),
      [10, 470]
    );
  }
  for (let i = 0; i < arr.length; i++) {
    bars.setColor(color);
    bars.setGeometry(
      Utils.Sorting.drawStartPoint,
      0,
      Utils.Sorting.width,
      arr[i]
    );
    bars.draw();
    Utils.Sorting.drawStartPoint =
      Utils.Sorting.drawStartPoint + Utils.Sorting.width + Utils.Sorting.space;
  }
  getStartingpointofrectdraw();
}

function drawSortedElements() {
  Utils.AnimationController.now = Date.now();
  Utils.AnimationController.elapsed_time = Utils.AnimationController.now - Utils.AnimationController.time;
  if (!Utils.AnimationController.playing) {
    Utils.AnimationController.cancelAnimation();
    return;
  }
  if (Utils.AnimationController.elapsed_time >= Utils.AnimationController.frameRate) {
    Utils.Webglv.clear();
    Utils.ctx.clear();
    queue_element = Utils.queue[Utils.AnimationController.queueIndex];
    Utils.ctx.draw(
      "Noofcomparisions: " +
      queue_element[3].toString() +
      "    ArrayLength: " +
      Utils.Sorting.arr_y.length.toString(),
      [10, 470]
    );
    line.draw();

    for (let i = 0; i < Utils.Sorting.arr.length; i++) {
      if (queue_element[2] && queue_element[0] == i) {
        [Utils.Sorting.arr_y[i], Utils.Sorting.arr_y[queue_element[1]]] = [
          Utils.Sorting.arr_y[queue_element[1]],
          Utils.Sorting.arr_y[i],
        ];
        bars.setColor("green");
      } 
      else if (queue_element[2] && queue_element[1] == i) {
        bars.setColor("green");
      } 
      else if (queue_element[0] == i || queue_element[1] == i) {
        bars.setColor("blue");
      } 
      else {
        bars.setColor("red");
      }

      bars.setGeometry(
        Utils.Sorting.drawStartPoint,
        0,
        Utils.Sorting.width,
        Utils.Sorting.arr_y[i]
      );
      // Render the scene.
      bars.draw();

      Utils.Sorting.drawStartPoint =
        Utils.Sorting.drawStartPoint +
        Utils.Sorting.width +
        Utils.Sorting.space;

      // Remember when this scene was rendered.
      Utils.AnimationController.time = Utils.AnimationController.now;
    }
    if (Utils.AnimationController.preventIncrement) {
      Utils.AnimationController.preventIncrement = false;
    }
    else {
      Utils.AnimationController.queueIndex = Utils.AnimationController.queueIndex + Utils.AnimationController.queueIncrement;
    }
  }
  
  if (Utils.AnimationController.queueIndex <= Utils.queue.length - 1 && Utils.AnimationController.queueIndex >= 0) {
    getStartingpointofrectdraw();
    Utils.AnimationController.animationNo = window.requestAnimationFrame(drawSortedElements);
  }
  else {
    drawBars();
    Utils.AnimationController.cancelAnimation();
    Utils.AnimationController.playing = false;
  }
}

//function for drawing trees
function drawTree(NodeOfTree, flag) {
  const ctx = Utils.ctx;
  const { radiusofCircle: radCircle, distanceofLine: dLine } = Utils.Circle;

  let previous_time = Date.now();

  let gap = 3 * radCircle + dLine;

  let resCanvas = Utils.canvas.getRes();
  let y = resCanvas[1] - radCircle - 10;
  let x = radCircle + 10;

  let Dir = 1; // to fo right

  let circle = new Circle(Utils.Webglv);
  let line = new Line(Utils.Webglv);

  let funcCallback;

  let drawLinked = function () {
    var node = NodeOfTree;
    var now, elapsed_time;
    now = Date.now();
    elapsed_time = now - previous_time;
    if (elapsed_time >= Utils.AnimationController.frameRate) {
      Utils.Webglv.clear();
      ctx.clear();
      while (node != null) {
        if (node.recentInsert) {
          circle.setColor("green");
        } else {
          circle.setColor("red");
        }
        line.setColor("black");
        circle.setGeometry(x, y, radCircle);
        // Render the scene
        circle.draw();
        ctx.draw(node.value.toString(), [x - 10, y + 5]);

        let temp1 = x;
        let temp2 = y;

        if (x - gap < 10 && Dir === 2) {
          Dir = 4;
        } else if (x + gap > resCanvas[0] - 10 && Dir === 1) {
          Dir = 3;
        }

        if (Dir === 3 || Dir === 4) {
          y = y - 2 * radCircle - dLine;
          line.setGeometryp(temp1, temp2 - radCircle, temp1, y + radCircle);
          line.draw();
          node = node.next;
          previous_time = now;
          if (Dir === 3) {
            Dir = 2;
          } else {
            Dir = 1;
          }
          continue;
        }
        if (Dir === 1) {
          x = x + 2 * radCircle + dLine;
          line.setGeometryp(temp1 + radCircle, y, x - radCircle, y);
        } else if (Dir === 2) {
          x = x - 2 * radCircle - dLine;
          line.setGeometryp(temp1 - radCircle, y, x + radCircle, y);
        }
        line.draw();
        node = node.next;
        previous_time = now;
      }
      Utils.AnimationController.cancelAnimation();
      Utils.AnimationController.playing = false;
    } else {
      Utils.AnimationController.animationNo =
        window.requestAnimationFrame(funcCallback);
    }
  };

  let drawBinaryTree = function () {
    var node = NodeOfTree;
    var now, elapsed_time;
    now = Date.now();
    elapsed_time = now - previous_time;
    if (elapsed_time >= Utils.AnimationController.frameRate) {
      Utils.Webglv.clear();
      ctx.clear();

      line.draw();
      node = node.next;
      previous_time = now;

      Utils.AnimationController.cancelAnimation();
      Utils.AnimationController.playing = false;
    } else {
      Utils.AnimationController.animationNo =
        window.requestAnimationFrame(funcCallback);
    }
  };

  if (flag === 1) {
    funcCallback = drawLinked;
  } else {
    funcCallback = drawBinaryTree;
  }
  Utils.AnimationController.animationNo =
    window.requestAnimationFrame(funcCallback);
}

function drawGrid() {
  Utils.Webglv.clear();
  const gap = Astar.gapOfGrid;
  let [width, height] = Utils.canvas.getRes();
  width = Math.floor(width / gap) * gap;
  height = Math.floor(height / gap) * gap;

  for (let i = 10; i <= width; i = i + gap) {
    line.setGeometryp(i, 10, i, height-10);
    line.setColor("black");
    line.draw();
  }
  for(let i =10;i <= height;i = i + gap){
    line.setGeometryp(10, i, width - 10, i);
    line.setColor("black");
    line.draw();
  }
}

const clearResourcesSort = function (functions) {
  Utils.Sorting.arr = [];
  document.getElementById("myRange").disabled = true;
};

const clearResourcesPathFind = function (functions) {
  let canv = document.getElementById("CANVAS");
  document
    .querySelectorAll('input[type=radio][name="Insert"]')
    .forEach((element) => {
      element.disabled = true;
    });
  canv.removeEventListener("mousedown", functions[0]);
  canv.removeEventListener("mouseout", functions[1]);
  canv.removeEventListener("mouseup", functions[1]);
  Astar.grid = [];
};

function makeReady(flag, functions) {
  if (flag === 1) {
    // let canv = document.getElementById("CANVAS");
    document.getElementById("myRange").disabled = false;
    clearResourcesPathFind(functions);
  } else if (flag === 2) {
    Utils.ctx.clear();
    let canv = document.getElementById("CANVAS");
    canv.addEventListener("mousedown", functions[0]);
    canv.addEventListener("mouseout", functions[1]);
    canv.addEventListener("mouseup", functions[1]);
    clearResourcesSort(functions);
    drawGrid();
    makeGrid();
    document
      .querySelectorAll('input[type=radio][name="Insert"]')
      .forEach((element) => {
        element.disabled = false;
      });
  } else if (flag === 3) {
    Utils.ctx.clear();
    Utils.Webglv.clear();

    clearResourcesSort(functions);
    clearResourcesPathFind(functions);
  } else {
    Utils.ctx.clear();
    Utils.Webglv.clear();
  }
}

//returns index if included else -1
function isIncludeInLibrary(arr, point) {
  for (let k = 0; k < arr.length; k++) {
    if (arr[k][0] === point[0] && arr[k][1] === point[1]) {
      return k;
    }
  }
  return -1;
}


function drawInputpos() {
  for (let i = 0; i < Astar.inputedPos.length; i++) {
    bars.setGeometry(Astar.inputedPos[i][0], Astar.inputedPos[i][1], Astar.gapOfGrid, Astar.gapOfGrid);

    bars.setColor("black");
    if (i === 0) {
      bars.setColor("purple");
    }
    if (i === 1) {
      bars.setColor("red");
    }
    bars.draw();
  }
}

function drawsmallRectangles() {
  Utils.AnimationController.now = Date.now();
    Utils.AnimationController.elapsed_time = Utils.AnimationController.now - Utils.AnimationController.time;
  if(Utils.AnimationController.playing){
    let pos;
    if (Utils.AnimationController.elapsed_time >= Utils.AnimationController.frameRate) {
      drawGrid();
      drawInputpos();
      for (let i = 0; i <= Utils.AnimationController.queueIndex ; i++) {
        if (
          Utils.queue[i].isBarrier()||
          Utils.queue[i].isEnd() ||
          Utils.queue[i].isStart()
        ) {
          continue;
        }

        pos = Utils.queue[i].gPos();
        bars.setGeometry(pos[0], pos[1], Astar.gapOfGrid, Astar.gapOfGrid);
        if (Utils.queue[i].isPath()) {
          bars.setColor("blue");
        } else {
          bars.setColor("green");
        }
        bars.draw();
      }

      Utils.AnimationController.time = Utils.AnimationController.now;
      Utils.AnimationController.queueIndex = Utils.AnimationController.queueIndex + Utils.AnimationController.queueIncrement;
    }
    if (Utils.AnimationController.queueIndex <= Utils.queue.length-1 && Utils.AnimationController.queueIndex >= 0) {
      Utils.AnimationController.animationNo = window.requestAnimationFrame(drawsmallRectangles);
    } 
    else {
      Utils.AnimationController.cancelAnimation();
      Utils.AnimationController.playing = false;
    }
  }
  else{
    drawGrid();
    drawInputpos();
  }
}


function obtainMousePosition(event) {
  let mode = Utils.Drawmodes;
  let gap = Astar.gapOfGrid;
  let [width, height, rect] = Utils.canvas.getRes();

  let x = event.clientX - rect.left + 10;
  let y = height - (event.clientY - rect.top) + 10;
  x = Math.floor(x / gap) * gap - 10;
  y = Math.floor(y / gap) * gap - 10;

  if (x > width - 20 || x < 0 || y > height - 20 || y < 0) {
    return;
  }

  let point = new Array(x, y);
  let M = isIncludeInLibrary(Astar.inputedPos, point);
  if (M != -1) {
    Astar.inputedPos.splice(M, 1);
  }
  if (mode & 0x008 || mode & 0x002 || mode & 0x001) {
    if (mode & 0x008) {
      Astar.inputedPos.push(point);
    } else if (mode & 0x001) {
      if (Astar.inputedPos.length == 0) {
        Astar.inputedPos.push(point);
      } else {
        Astar.inputedPos[0] = point;
      }
    } else {
      Astar.inputedPos.splice(1, 0, point);
    }
  } else {
    M = isIncludeInLibrary(Astar.inputedPos, point);
    if (M != -1) {
      Astar.inputedPos.splice(M, 1);
    }
  }
  updateGrid();
  drawsmallRectangles();
}

function sort(sorttype) {
  let callSortfunc = false;
  Utils.AnimationController.queueIndex = 0;

  let arr = [].concat(Utils.Sorting.arr);
  if (sorttype == "bubblesort") {
    Utils.queue = bubblesort(arr);
    callSortfunc = true;
  } else if (sorttype === "quicksort") {
    callSortfunc = true;
    Utils.queue = quicksort(arr, 0, arr.length - 1);
  } else if (sorttype === "heapsort") {
    Utils.queue = heapsort(arr, arr.length);
    callSortfunc = true;
  } else if (sorttype === "mergesort") {
    callSortfunc = true;
    Utils.queue = mergesort(arr, 0, arr.length - 1);
  } else if (sorttype === "pathfind") {
    Astarfunc();
  } else if (sorttype === "bst") {
    Bst(arr[0], arr[1]);
  } else {
    // Linked(arr[0], arr[1]);
    Linked();
  }
  if (callSortfunc) {
    Utils.Sorting.arr_y = [].concat(Utils.Sorting.arr);
    drawSortedElements();
  }
}

export {
  drawBars,
  sort,
  makeReady,
  obtainMousePosition,
  drawsmallRectangles,
  Utils,
  drawTree,
};
