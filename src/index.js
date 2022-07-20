import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{backgroundColor: props.color}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i ,color) {
        return (
            <Square
                value={this.props.squares[i]}
                color ={color}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        let everyThing = [];
        for (let i = 0; i < 3; i++) {
            let innerButtons = [];
            for (let j = 0; j < 3; j++) {
                innerButtons.push(this.renderSquare(i*3 + j, this.props.colors[i*3 + j]));
            }
            everyThing.push(<div className="board-row">{innerButtons}</div>);
        }
        return <div>{everyThing}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            lastButton: [],
            stepNumber: 0,
            xIsNext: true,
            colors: Array(9).fill('white'),
            ascending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const lastButton = this.state.lastButton.slice(0 , this.state.stepNumber);
        const squares = current.squares.slice();
        if (squares[i]) {
            return;
        }else if (calculateWinner(squares)){
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            lastButton: lastButton.concat(i),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.movePrint(step)
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

    }
    toggleList(){
        this.setState({
            ascending: !this.state.ascending,
        })
    }
    movePrint(step1){
        const buttons = this.state.lastButton.map((step, move) => {
            if (move < step1){
                const desc = 'row :' + Number(Math.floor(step/3) + 1 )
                    + ' column :' + Number((step % 3) + 1);
                if (move === (step1 - 1)){
                    return (
                        <li key={move}>
                            <b>{desc}</b>
                        </li>
                    );
                }
                else
                {
                    return (
                        <li key={move}>
                            {desc}
                        </li>
                    );
                }
            }
        });
        return buttons;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const colorArr = this.state.colors.slice();
        const buttonsToAdd = [];
        let everything = [];
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            buttonsToAdd.push (<li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>);
        });
        everything = this.state.ascending ? buttonsToAdd.slice() : flipArr(buttonsToAdd).slice();
        const sort = <button onClick={() => this.toggleList()}>sort</button>

        let status;
        if (winner) {
            for (let j = 0; j < 3; j++) {
                colorArr[getWinners(current.squares)[j]] = 'yellow';
            }
            status = "Winner: " + winner;
        } else if (calculateDraw(current.squares)){
            status = 'The Game Ended With a Draw';
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        const buttons = this.movePrint(this.state.stepNumber);

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        colors = {colorArr}
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{sort}</div>
                    <ol>{everything}</ol>
                    <ol>{buttons}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
function calculateDraw(squares){
    let flag = true;
    for (let i = 0; i < 9; i++) {
        if (squares[i] == null){
            flag = false;
        }
    }
    return flag;
}
function calculateWinner(squares) {
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
function getWinners(squares){
    let toReturn = [];
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
            toReturn.push(a);
            toReturn.push(b);
            toReturn.push(c);
            return toReturn;
        }
    }
    return null;
}
function flipArr(list){
    const toReturn = [];
    for (let i = list.length; i >= 0; i--) {
        toReturn.push(list[i]);
    }
    return toReturn;
}