import {drawsmallRectangles, Utils} from './canvas.js';
//state variables
const Astar={
    inputedPos : [],
    gapOfGrid : 20,
    width : 800,
    height : 500,
    grid : new Array()
}

const heuristics={
    manhatten:function(point_1, point_2)
        {
            let val = Math.abs(point_1.row - point_2.row) 
                + Math.abs(point_1.col - point_2.col);
            return val;
        }
    ,
    diagonal:function(point_1, point_2)
        {
            let d1 = (point_1.row - point_2.row) * (point_1.row - point_2.row);
            let d2=  (point_1.col - point_2.col) * (point_1.col - point_2.col);
            return Math.sqrt(d1 + d2);
        }
}

function isSame(point1, point2){
    if (point1[0] === point2[0] && point1[1] === point2[1]){
        return true;
    }
    return false;

}

class Points 
{
    constructor(x, y) {
        this.type = 4  //true for regular path and false for taversedpath
        this.row = x;
        this.col = y;
        this.neighbors = [];
    }

    get positiion(){
        return [this.row, this.col];
    }
    
    isBarrier(){
        if(this.type === 3){
            return true;
        }
        return false;
    }

    isStart(){
        if(this.type === 1){
            return true;
        }
        return false;
    }

    isEnd(){
        if(this.type === 2){
            return true;
        }
        return false;
    }

    isPath(){
        if(this.type === 4){
            return true;
        }
        return false;
    }

    isShortestPath(){
        if(this.type === 5){
            return true;
        }
        return false;
    }
    formNeighbors()
    {
        let gap = Astar.gapOfGrid;
        let x = (this.row - 10) / gap;
        let y = (this.col - 10) / gap;
        
        this.neighbors = [];

        let rows = Astar.grid.length-1;
        let columns = Astar.grid[0].length-1;

        if ( x < rows && !(Astar.grid[x+1][y]).isBarrier()){
            this.neighbors.push( 
                Astar.grid[x+1][y]
            );
        }
        if ( x > 0 && !(Astar.grid[x-1][y]).isBarrier()){
            this.neighbors.push( 
                Astar.grid[x-1][y]
            );
        }
        if ( y < columns && !(Astar.grid[x][y+1]).isBarrier()){
            this.neighbors.push( 
                Astar.grid[x][y+1]
            );
        }
        if ( y > 0 && !(Astar.grid[x][y-1]).isBarrier()){
            this.neighbors.push( 
                Astar.grid[x][y-1]
            );
        }
    }

    getNeighbors(){
        this.formNeighbors();
        return this.neighbors;
    }

    gPos(){
        return [this.row, this.col];
    }
}

//get the shortest path given by the camefrom map 
function reconstructPath(cameFrom, current)
{
    let total_path=new Array();
    let path = new Array();
    let temp;
    let man = true;

    while (cameFrom.has(current)){
        temp = cameFrom.get(current);
        total_path.unshift(temp);
        total_path[0].type = 5;
        current = temp;
    }
    for (let k of cameFrom.keys()){
        if( !total_path.includes(k)){
            path.push(k);
        }
    }
    path = [...path,...total_path];
    for (let m = path.length-1; m >= 0; m-- ){
        if( man && path[m].isShortestPath()){
            continue;
        }else if (man || path[m].isShortestPath()){
            man = false;
            path[m].type = 4;
        }
    }
    return path;
}

function updateGrid(){
    let row;
    let col;
    let gap = Astar.gapOfGrid;
    for(let i=0; i < Astar.inputedPos.length; i++){
        row = (Astar.inputedPos[i][0] - 10) / gap;
        col = (Astar.inputedPos[i][1] - 10) / gap;
        if(i === 0){
            Astar.grid[row][col].type = 1;
        }
        else if(i === 1){
            Astar.grid[row][col].type = 2;
        }else{
            Astar.grid[row][col].type = 3;
        }
    }
}

function makeGrid()
{
    let grid = new Array();
    const {width, height, gapOfGrid : gap}  = Astar;
    let point, index;
    
    for(let i = 10; i < (width-gap); i=i+gap){
        grid.push([]);
        index = grid.length - 1;
        for(let j = 10; j< (height-gap); j=j+gap){
            point = new Points(i,j);
            grid[index].push(point);
        }
    }
    Astar.grid = grid;
}

function getPointsNodes(){
    let row1 = (Astar.inputedPos[0][0]-10) / Astar.gapOfGrid;
    let col1 = (Astar.inputedPos[0][1]-10) / Astar.gapOfGrid;
    let row2 = (Astar.inputedPos[1][0]-10) / Astar.gapOfGrid;
    let col2 = (Astar.inputedPos[1][1]-10) / Astar.gapOfGrid;
    return [Astar.grid[row1][col1], Astar.grid[row2][col2]];
}


function getLowestFscoreNode(openSet, f_score){
    let current;
    let counter = 0;
    for(let key of openSet){
        if(counter === 0){
            current = key;
            counter++;
            continue;
        }
        if(f_score.get(key) < f_score.get(current)){
            current = key;
        }
    }
    return current;
}

function Astarfunc()
{
    updateGrid();
    let grid = Astar.grid;
    let neighbors, neighbor;
    let camefrom = new Map();
    let openSet = new Set();

    const [start, end] = getPointsNodes();
    
    let tentative_score;
    let current = start;

    let g_score = new Map();
    let f_score = new Map();


    openSet.add(start);
    grid.forEach(element => {
        element.forEach(ele => {
            g_score.set(ele, 1000000);
        });
    });

    g_score.set(start, 0);

    grid.forEach(element => {
        element.forEach(ele => {
            f_score.set(ele, 1000000);
        });
    });

    f_score.set(start, heuristics.manhatten(start, end));

    while (openSet.size != 0){
        current = getLowestFscoreNode(openSet, f_score);

        if( isSame(current.gPos(), end.gPos()) ){
            Utils.queue=reconstructPath(camefrom, current);
            drawsmallRectangles();
            return;
        }

        openSet.delete(current);
        neighbors = current.getNeighbors();
        
        for(let i=0; i < neighbors.length; i++){
            neighbor = neighbors[i];
            tentative_score = g_score.get(current) + 20;
            if( tentative_score < g_score.get(neighbor) ){
                camefrom.set(neighbor, current);
                g_score.set(neighbor, tentative_score);
                f_score.set(neighbor, (g_score.get(neighbor) + heuristics.manhatten(neighbor, end)) );
                if( !openSet.has(neighbor) ){
                    openSet.add(neighbor);
                }
            }
        }
    }
    alert("Couldn't find a path");
}


export {Astarfunc, Astar, makeGrid, updateGrid}