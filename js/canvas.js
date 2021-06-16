import { bubblesort, quicksort, heapsort, mergesort} from './sortingalgorithms.js';


class Webgraphics {
    //requires id of canvas and webgl type
    constructor(CANVAS_ID, WEBGL_V, valx = 0, valy = 0) {
        this.canvas = document.querySelector(CANVAS_ID);
        this.gl = this.canvas.getContext(WEBGL_V);
        
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
    compiled : false,
    Vshadersource : [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;',
        'uniform vec2 u_resolution;',
        '',
        'void main()',
        '{',
        '  vec2 zeroToOne = vertPosition / u_resolution;',
        '  vec2 zeroToTwo = zeroToOne * 2.0;',
        '  vec2 Clipspace = zeroToTwo - 1.0;',
        '  gl_Position = vec4(Clipspace, 0.0, 1.0);',
        '}'
    ].join('\n'),

    Fshadersource : [
        'precision mediump float;',
        '',
        'uniform vec3 fragColor;',
        'void main()',
        '{',
        '  gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n')
}


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
            Rectangle.Vshader = compileShaders(this.parent.gl, this.parent.gl.VERTEX_SHADER, RecShaders.Vshadersource);
            Rectangle.Fshader = compileShaders(this.parent.gl, this.parent.gl.FRAGMENT_SHADER, RecShaders.Fshadersource);
            RecShaders.compiled = true;
        }
        if (Rectangle.program == null) {
            Rectangle.program = this.parent.createProgramandattachShaders(Rectangle.Vshader, Rectangle.Fshader);
            this.parent.gl.useProgram(Rectangle.program);
            this.parent.createAndBindBuffer();
            //set u_resolution attribute
            let PositionUresolution = this.parent.gl.getUniformLocation(Rectangle.program, "u_resolution");
            let res = [this.parent.canvas.clientWidth, this.parent.canvas.clientHeight];
            this.parent.gl.uniform2f(PositionUresolution, res[0], res[1]);
        }
    }


    setParent(parent) {
        this.parent = parent;
    }

    setGeometry(x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        this.position = [
            x1, y1,
            x1, y2,
            x2, y1,
            x2, y2,
        ];
    }

    //Color_name = red,green,blue,yellow,purple,black
    setColor(color_name) {
        if (color_name == "red") {
            this.color = [180 / 255, 0, 0];
        }
        else if (color_name == "green") {
            this.color = [0, 100 / 255, 0];
        }
        else if (color_name == "blue") {
            this.color = [0, 0, 1.0];
        }
        else if (color_name == "yellow") {
            this.color = [1.0, 1.0, 0];
        }
        else if (color_name == "purple") {
            this.color = [102 / 255, 0, 102 / 255];
        }
        else {
            this.color = [0, 0, 0];
        }
    }


    draw(drawing = true) {
        if (drawing) {
            if (!this.parent.program) {
                this.parent.createProgramandattachShaders(Rectangle.Vshader, Rectangle.Fshader);
            };
            this.parent.gl.useProgram(Rectangle.program);
            this.parent.gl.bufferData(this.parent.gl.ARRAY_BUFFER, new Float32Array(this.position), this.parent.gl.STATIC_DRAW);
            let positionAttribLocation = this.parent.gl.getAttribLocation(Rectangle.program, "vertPosition");
            let colorUniformLocation = this.parent.gl.getUniformLocation(Rectangle.program, "fragColor");
            this.parent.gl.uniform3f(colorUniformLocation, this.color[0], this.color[1], this.color[2]);

            this.parent.gl.vertexAttribPointer(
                positionAttribLocation,
                2,
                this.parent.gl.FLOAT,
                this.parent.gl.FALSE,
                2 * Float32Array.BYTES_PER_ELEMENT,
                0);
            this.parent.gl.enableVertexAttribArray(positionAttribLocation);
            this.parent.gl.drawArrays(this.parent.gl.TRIANGLE_STRIP, 0, 4);
        }
    }
}

class Ctx{
    constructor(CANVAS_ID){
        this.canvas = document.querySelector(CANVAS_ID);
        this.ctx = this.canvas.getContext("2d");
    }

    draw(text, pos){
        this.ctx.font = '20px serif';
        let res = this.canvas.getBoundingClientRect();
        this.ctx.strokeText(text, pos[0], res.height - pos[1]);
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//returns Random value-> set Range (250,20)->(pixel)
function Randomvalue(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



const Utils = {
    Webglv : new Webgraphics("#CANVAS", "webgl"),
    ctx : new Ctx("#canvas"),
    rect : [],
    frameRate : 100,

    Sorting : {
        width: 4,//8,
        space: 2,
        arr: [],
        newarray:function newArrayelements(arr_size) {
            let b;
            Utils.Sorting.arr = [];
            for (let i = 0; i < arr_size; i++) {
                b = Randomvalue(450, 50);
                Utils.Sorting.arr.push(b);
            }
        }
    },
    Circle : {
        radiusofCircle: 50,
        distanceofLine: 40,
    },
    Drawmodes : 0x008,
    canvas : {
        canv : document.getElementById("CANVAS"),
        getRes:function()
        {
            return [Utils.canvas.canv.clientWidth, Utils.canvas.canv.clientHeight, Utils.canvas.canv.getBoundingClientRect()];
        }
    }
}

function getStartingpointofrectdraw(length) {
    const{width, space} = Utils.Sorting;
    let widthofdiagram = length * (width + space) - 2 * space;
    let canvaswidth = Utils.canvas.getRes();
    return (canvaswidth[0] - widthofdiagram)/2;
}

function main(arr_y) {
    Utils.ctx.clear();
    Utils.Webglv.clear();

    const{width, space} = Utils.Sorting;
    let i = getStartingpointofrectdraw(arr_y.length);
    let bars = new Rectangle(Utils.Webglv);

    arr_y.forEach(element => {
        bars.setGeometry(i, 0, width, element);
        bars.setColor("red");
        bars.draw();
        i = i + width + space;
    });
}

function drawSortedElements(arr_y, queue) {
    const frame_rate = Utils.frameRate;
    const{width, space} = Utils.Sorting;

    let previous_time = Date.now();
    let bars = new Rectangle(Utils.Webglv);

    let j = 0, counter = 0;
    let animationOne, queue_element;

    let drawsortedArr = function () {
        j = getStartingpointofrectdraw(arr_y.length);
        var now, elapsed_time;
        now = Date.now();
        elapsed_time = now - previous_time;
        if (elapsed_time >= frame_rate) {
            counter++;
            Utils.Webglv.clear();
            for (let i = 0; i < Utils.Sorting.arr.length; i++) {
                bars.setColor("green");
                bars.setGeometry(j, 0, width, arr_y[i]);
                // Render the scene.
                bars.draw();

                j = j + width + space;

                // Remember when this scene was rendered.
                previous_time = now;
            }
        }
        if (counter != 20) {
            animationOne = window.requestAnimationFrame(drawsortedArr);
        } else {
            window.cancelAnimationFrame(animationOne);
        }
    }

    let animate = function () {
        j = getStartingpointofrectdraw(arr_y.length);
        var now, elapsed_time;
        now = Date.now();
        elapsed_time = now - previous_time;
        if (elapsed_time >= frame_rate) {
            queue_element = queue.shift();
            Utils.Webglv.clear();
            for (let i = 0; i < Utils.Sorting.arr.length; i++) {
                if (queue_element[2] && queue_element[0] == i) {
                    [arr_y[i], arr_y[queue_element[1]]] = [arr_y[queue_element[1]], arr_y[i]];
                    bars.setColor("green");
                }
                else if (queue_element[2] && queue_element[1] == i) {
                    bars.setColor("green");
                }
                else if (queue_element[0] == i || queue_element[1] == i) {
                    bars.setColor("blue");
                } else {
                    bars.setColor("red");
                }

                bars.setGeometry(j, 0, width, arr_y[i]);
                // Render the scene.
                bars.draw();

                j = j + width + space;

                // Remember when this scene was rendered.
                previous_time = now;
            };
        }
        if (queue.length != 0) {
            animationOne = window.requestAnimationFrame(animate);
        } else {
            // window.cancelAnimationFrame(animationOne);
            animationOne = window.requestAnimationFrame(drawsortedArr);
        }
    };
    animationOne = window.requestAnimationFrame(animate);
}





function sort(sorttype, arr = null) {
    let queue = [];
    let callSortfunc = false;
    let copy_of_array = [];

    if( arr != null){
        copy_of_array = [].concat(arr);
    }

    if (sorttype == "bubblesort") {
        queue = bubblesort(arr);
        callSortfunc = true;
    } 
    else if (sorttype === "quicksort") {
        callSortfunc = true;
        queue = quicksort(arr, 0, arr.length - 1);
    } 
    else if (sorttype === "heapsort") {
        queue = heapsort(arr, arr.length);
        callSortfunc = true;
    }
    else if (sorttype === "mergesort"){
        callSortfunc = true;
        queue = mergesort(arr, 0, arr.length - 1);
    }
    else if (sorttype === "pathfind"){ 
        //call path find
    }
    else if (sorttype === "bst"){
        //call BST
    }
    else{
        // Linked(arr[0], arr[1]);
        // Linked();
    }

    if( callSortfunc ){
        drawSortedElements(copy_of_array, queue);
    }
}


export { main, sort, Utils}