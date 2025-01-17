import React from 'react';
import Node from './Node';
import '../Stylesheets/Grid.css'
import { dykstra } from '../alogrithms/dykstra'
const rows = 35;
const columns = 70;
class Grid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            grid: [],
            rows: rows,
            columns: columns,
            set: null,
            reset: false,
            start_node_row: 10,
            start_node_col: 20,
            end_node_row: 22,
            end_node_col: 40,
            isClicked: false,
            weight: 10
        }
        this.dijkistra = this.dijkistra.bind(this)
        

        this.handleReset = this.handleReset.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.setToStart = this.setToStart.bind(this)
        this.setToEnd = this.setToEnd.bind(this)
        this.handleWall = this.handleWall.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouserUp = this.handleMouserUp.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.resetWalls = this.resetWalls.bind(this)
        this.setWeight = this.setWeight.bind(this)
        this.resetWeights = this.resetWeights.bind(this)
        this.inputWeight = this.inputWeight.bind(this)


    }

    handleClick = (row, col) => {
        if (!this.state.set) {
            console.log("Choose what to set")
            return;
        }
        if (this.state.reset)
            this.handleReset()
        if (this.state.set === 1) {
            var temp = this.state.grid;
            temp[this.state.start_node_row][this.state.start_node_col].isStart = false
            temp[row][col].isStart = true
            document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).className = "node"
            document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).isStart = false
            document.getElementById(`${row}-${col}`).className = "node node-start"
            document.getElementById(`${row}-${col}`).isStart = true;
            this.setState({ start_node_row: row, start_node_col: col, grid: temp })
        }
        else if (this.state.set === 2) {
            temp = this.state.grid;
            if (this.state.end_node_row && this.state.end_node_col)
                temp[this.state.end_node_row][this.state.end_node_col].isEnd = false
            temp[row][col].isEnd = true
            document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).className = "node"
            document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).isEnd = false
            document.getElementById(`${row}-${col}`).className = "node node-finish"
            document.getElementById(`${row}-${col}`).isEnd = true;
            this.setState({ end_node_row: row, end_node_col: col, grid: temp })
        }
        else if (this.state.set === 4) {
            if ((row === this.state.start_node_row && col === this.state.start_node_col) || (row === this.state.end_node_row && col === this.state.end_node_col))
                return
            temp = this.state.grid;
            if (temp[row][col].weight === 1) {
                temp[row][col].weight = this.state.weight;
                document.getElementById(`${row}-${col}`).className = "node weight"
                this.setState({ grid: temp })
            }
            else {
                temp[row][col].weight = 1;
                document.getElementById(`${row}-${col}`).className = "node"
                this.setState({ grid: temp })
            }
        }
        else {
            if ((row === this.state.start_node_row && col === this.state.start_node_col) || (row === this.state.end_node_row && col === this.state.end_node_col))
                return
            temp = this.state.grid;
            if (!temp[row][col].isWall) {
                temp[row][col].isWall = true;
                document.getElementById(`${row}-${col}`).className = "node wall"
                this.setState({ grid: temp })
            }
            else {
                temp[row][col].isWall = false;
                document.getElementById(`${row}-${col}`).className = "node"
                this.setState({ grid: temp })
            }

        }
    }
    
    dijkistra() {
        this.setState({ set: -1 })
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-weight').className = ""

        document.getElementById('set-wall').className = ""
        if (this.state.reset) {
            this.handleReset();
        }
        var temp = this.state.grid
        const order = dykstra(temp, this.state.start_node_row, this.state.start_node_col, this.state.end_node_row, this.state.end_node_col);
        for (let i = 0; i <= order.length; i++) {

            if (i === order.length) {
                var number_of_nodes = 0
                setTimeout(() => {
                    var current = temp[this.state.end_node_row][this.state.end_node_col].parent
                    while (current && !current.isStart) {
                        document.getElementById(`${current.row}-${current.col}`).className = "node path"
                        current = current.parent
                        if (!current) {
                            break;
                        }
                        number_of_nodes += current.weight;
                    }
                    if (current === null) {
                        document.getElementById('number-of-nodes').innerHTML = "no path found"
                        return;
                    }
                    if (current.isStart)
                        document.getElementById('number-of-nodes').innerHTML = `Total Distance Travelled = ${number_of_nodes}`
                }, 10 * i)

                return;
            }
            setTimeout(() => {
                document.getElementById(`${order[i].row}-${order[i].col}`).className = "node visited"
                if (temp[order[i].row][order[i].col].weight !== 1)
                    document.getElementById(`${order[i].row}-${order[i].col}`).className = "node weight"
                document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).className = "node node-start"
                document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).className = "node node-end"
            }, 10 * i)

            // document.getElementById(`${order[i].row*10+order[i]}`).className="node node-vi"
        }
        this.setState({ reset: true })


    }
    resetWeights() {
        this.setState({ set: -1 })
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = ""

        var temp = this.state.grid;

        for (let i = temp.length - 1; i >= 0; i--) {
            for (let j = 0; j < temp[0].length; j++) {
                setTimeout(() => {
                    if (temp[i][j].isWall === false)
                        document.getElementById(`${temp[i][j].row}-${temp[i][j].col}`).className = "node"
                    temp[i][j].weight = 1
                    document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).className = "node node-start"
                    document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).className = "node node-end"
                }, 10 * j)
            }
        }
        this.setState({ grid: temp })
    }
    resetWalls() {
        this.setState({ set: -1 })
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = ""

        var temp = this.state.grid;

        for (let i = temp.length - 1; i >= 0; i--) {
            for (let j = 0; j < temp[0].length; j++) {
                setTimeout(() => {
                    if (temp[i][j].weight !== 1) return
                    document.getElementById(`${temp[i][j].row}-${temp[i][j].col}`).className = "node"
                    temp[i][j].isWall = false
                    document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).className = "node node-start"
                    document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).className = "node node-end"
                }, 10 * j)
            }
        }
        this.setState({ grid: temp })
    }
    setToStart() {
        document.getElementById('set-start').className = "clicked"
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = ""

        var temp = 1
        // e.style="background_color=green"
        this.setState({ set: temp })
    }
    setWeight() {
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = "clicked"

        var temp = 4
        this.setState({ set: temp })

    }
    setToEnd() {
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = "clicked"
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = ""

        var temp = 2
        this.setState({ set: temp })
    }
    handleWall() {
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = ""
        document.getElementById('set-wall').className = "clicked"
        document.getElementById('set-weight').className = ""


        var temp = 3;
        this.setState({ set: temp })
    }
    handleMouseDown() {
        var temp = this.state.isClicked;
        if (temp === false) temp = true
        this.setState({ isClicked: temp })
    }
    handleMouserUp() {
        var temp = this.state.isClicked
        if (temp) temp = false
        this.setState({ isClicked: temp })
    }
    handleMouseEnter = (row, col) => {
        if (this.state.isClicked && this.state.set === 3) {
            if ((row === this.state.start_node_row && col === this.state.start_node_col) || (row === this.state.end_node_row && col === this.state.end_node_col))
                return;
            var temp = this.state.grid;
            if (!temp[row][col].isWall) {
                temp[row][col].isWall = true;
                document.getElementById(`${row}-${col}`).className = "node wall"
                this.setState({ grid: temp })
            }
            else {
                temp[row][col].isWall = false;
                document.getElementById(`${row}-${col}`).className = "node"
                this.setState({ grid: temp })
            }
        }
    }
    handleReset() {
        this.setState({ set: -1 })
        document.getElementById('set-start').className = ""
        document.getElementById('set-end').className = ""
        document.getElementById('set-reset').className = "clicked"
        document.getElementById('set-wall').className = ""
        document.getElementById('set-weight').className = ""

        var temp = this.state.grid;

        for (let i = temp.length - 1; i >= 0; i--) {
            for (let j = 0; j < temp[0].length; j++) {
                setTimeout(() => {
                    if (temp[i][j].isWall || temp[i][j].weight !== 1) return;
                    document.getElementById(`${temp[i][j].row}-${temp[i][j].col}`).className = "node"
                    document.getElementById(`${this.state.start_node_row}-${this.state.start_node_col}`).className = "node node-start"
                    document.getElementById(`${this.state.end_node_row}-${this.state.end_node_col}`).className = "node node-end"
                }, 10 * j)
            }

            // document.getElementById(`${order[i].row*10+order[i]}`).className="node node-vi"
        }


    }
    componentDidMount() {//is called only once in the start
        var g = [];
        for (let row = 0; row < this.state.rows; row++) {
            var temp = [];
            for (let col = 0; col < this.state.columns; col++) {
                temp.push(
                    {
                        row: row,
                        isWall: false,
                        parent: null,
                        col: col,
                        key: row * 10 + col,
                        isStart: row === this.state.start_node_row ? (col === this.state.start_node_col ? true : false) : false,
                        isEnd: row === this.state.end_node_row ? (col === this.state.end_node_col ? true : false) : false,
                        id: row * 10 + col,
                        distance: Infinity,
                        isVisited: false,
                        weight: 1,
                    }
                )
            }
            g.push(temp)
        }
        this.setState({ grid: g })
    }
    // changeRows(e){
    //     e.preventDefault();
    //     console.log(e.target.in.value)
    //     var g=[];
    //     for(let row=0;row<e.target.in.value;row++)
    //     {
    //         var temp=[];
    //         for(let col=0;col<this.state.columns;col++){
    //                 temp.push(
    //                       {
    //                         row:row,
    //                         isWall:false, 
    //                         parent:null,
    //                         col:col, 
    //                         key:row*10+col, 
    //                         isStart:false,
    //                         isEnd:false,
    //                         id:row*10+col,
    //                         distance:Infinity,
    //                         isVisited:false,
    //                       } 
    //                 )    
    //         }
    //         g.push(temp)
    //     }
    //    this.setState({grid:g,rows:e.target.in.value,start_node_row:0,start_node_col:0,end_node_row:0,end_node_col:0})
    // }
    inputWeight(e) {
        e.preventDefault();
        var temp1 = e.target.weight.value
        this.setState({ weight: temp1 })
        var temp = this.state.grid;
        for (let i = 0; i < this.state.row; i++) {
            for (let j = 0; j < this.state.col; j++) {
                if (temp[i][j].weight !== 1)
                    temp[i][j].weight = temp1;
            }
        }
        this.setState({ grid: temp })
        console.log(this.state.weight)
    }

    render() {
        return (
            <div className="grid">
                <h1>Hurdler</h1>
                <div className="buttonGroup">
                    <button onClick={this.setToStart} clicked={false} id="set-start">Set Start</button>
                    <button onClick={this.setToEnd} clicked={false} id="set-end">Set End</button>
                    
                    <button onClick={this.handleWall} clicked={false} id="set-wall">Add Walls</button>
                    <button onClick={this.setWeight} clicked={false} id="set-weight">Add Weights</button>
                    <button onClick={this.resetWeights} >Reset Weights</button>
                    <button onClick={this.resetWalls} >Reset Walls</button>
                    <button onClick={this.handleReset} clicked={false} id="set-reset">Reset</button>
                    <br />
                    <button id="dijkstra" onClick={this.dijkistra} clicked={false} >Lets Hurdle</button>
                </div>
                
            <div>
                <h3 id="number-of-nodes">Total Distance Travelled = 0</h3>
                {this.state.grid.map((row, idr) => (
                    <div className="grid-row" key={idr * 1000 + 1}>
                        {row.map((col, idc) =>
                            <Node
                                row={idr}
                                parent={null}
                                col={idc}
                                weight={col.weight}
                                key={idr * 10 + idc}
                                isStart={idr === this.state.start_node_row ? (idc === this.state.start_node_col ? true : false) : false}
                                isEnd={idr === this.state.end_node_row ? (idc === this.state.end_node_col ? true : false) : false}
                                distance={col.distance}
                                isVisited={col.isVisited}
                                onClick={this.handleClick}
                                onMouseDown={this.handleMouseDown}
                                onMouseUp={this.handleMouserUp}
                                onMouseEnter={this.handleMouseEnter}>
                            </Node>

                        )}
                    </div>
                ))}
                


                {/* <form onSubmit={this.inputWeight}>
                <input name="weight" type="number" placeholder={this.state.weight}/>
                </form> */}
                </div>
                <h4><strong>Made with ♥ by Anurag</strong></h4>
            </div>
        )
    }
}

export default Grid;