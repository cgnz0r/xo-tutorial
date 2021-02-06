import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {    
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value = { this.props.squares[i] }
                onClick = { () => this.props.onClick(i) }
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            winner: null,
            stepNumber: 0
        }
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.state.winner || squares[i]) return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares}]), 
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 0) === 0
        });
    }

    renderState = (arrState, highlighted) => {
        return (
            <div>
                <div className="board-row">
                    <div className={0 === highlighted ? "highlighted cell" : "cell"}>{arrState[0] && arrState[0].toLowerCase() || ''}</div>
                    <div className={1 === highlighted ? "highlighted cell" : "cell"}>{arrState[1] && arrState[1].toLowerCase() || ''}</div>
                    <div className={2 === highlighted ? "highlighted cell" : "cell"}>{arrState[2] && arrState[2].toLowerCase() || ''}</div>
                </div>
                <div className="board-row">
                    <div className={3 === highlighted ? "highlighted cell" : "cell"}>{arrState[3] && arrState[3].toLowerCase() || ''}</div>
                    <div className={4 === highlighted ? "highlighted cell" : "cell"}>{arrState[4] && arrState[4].toLowerCase() || ''}</div>
                    <div className={5 === highlighted ? "highlighted cell" : "cell"}>{arrState[5] && arrState[5].toLowerCase() || ''}</div>
                </div>
                <div className="board-row">
                    <div className={6 === highlighted ? "highlighted cell" : "cell"}>{arrState[6] && arrState[6].toLowerCase() || ''}</div>
                    <div className={7 === highlighted ? "highlighted cell" : "cell"}>{arrState[7] && arrState[7].toLowerCase() || ''}</div>
                    <div className={8 === highlighted ? "highlighted cell" : "cell"}>{arrState[8] && arrState[8].toLowerCase() || ''}</div>
                </div>
            </div>
        )
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calcWinner(current.squares);

        const moves = history.map((step, move) => {
            const currentArr = step.squares;
            const previousArr = this.state.history[move - 1] 
                            && this.state.history[move - 1].squares 
                            || null;
            const stepPosition = move ? getStepPosition(currentArr, previousArr) : null;
            const desc = move ? `Go to step (${getNormalizedStepPosition(currentArr, previousArr)})` : 'Go to start of the game'
            return (
                <li key = { move } className="turns">
                    <div className="history-map">{this.renderState(step.squares, stepPosition)}</div>
                    <button onClick = { () => this.jumpTo(move) }>{desc}</button>
                </li>
            ) 
        })

        let status;
        if (winner) {
            this.state.winner = winner;
            status = `Winner is ${this.state.winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X': 'O'}`;
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares = { current.squares }
                    onClick = { i => this.handleClick(i) }
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  
function calcWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        } 
    }
    return null;
}

function getNormalizedStepPosition(arr1, arr2) {
    getStepPosition(arr1, arr2);
    const diffIdx = getStepPosition(arr1, arr2);
    let column = null;
    console.log(diffIdx);
    switch ((diffIdx + 1) % 3) {
        case 1: 
            column = 1;
            break;
        case 2: 
            column = 2; 
            break;
        case 3:
        default: 
            column = 3;
            break;
    }
    let row = null;
    switch (diffIdx) {
        case 0:
        case 1:
        case 2:
            row = 1;
            break;
        case 3:
        case 4:
        case 5:
            row = 2;
            break;
        default: 
            row = 3;
            break;
    }

    return column + ", " + row;
}

function getStepPosition (arr1, arr2) {
    let diffIdx = null;
    arr1.forEach((el,idx) => {
        if (el !== arr2[idx]) diffIdx = idx;
    });
    return diffIdx;
}