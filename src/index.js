import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    if (props.winningLine && props.winningLine.includes(props.squareNum))
    {
        return(
            <button className="square winningSquare" onClick={props.onClick}>
              <i>{props.value}</i>
            </button>
        );
    }
    return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
    );
}

class Board extends React.Component {
  renderSquare(i, winningLine) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningLine={this.props.winningLine}
        squareNum={i}
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
      history: [
        {
          squares: Array(9).fill(null),
          lastClicked: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reverseMoves: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastClicked: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  reverseMoveOrder() {
    this.setState({
      reverseMoves: !this.state.reverseMoves,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningLine = calculateWinner(current.squares);
    const winner = winningLine ? current.squares[winningLine[0]] : false;
    const draw = calculateDraw(current.squares, winner);

    const moves = history.map((step, move) => {
    var col = step.lastClicked % 3 + 1;
    var row = Math.floor((step.lastClicked) / 3) + 1;
      const desc = move ? 'Go to move #' + move + ' - Col: ' + col + ' Row: ' + row : 'Go to game start';
      if (move === this.state.stepNumber) {
          return (
                <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>
                    <b>{desc}</b>
                  </button>
                </li>
          );
      }
      return (
                <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>
                    {desc}
                  </button>
                </li>
          );

    });

    if (this.state.reverseMoves) {
        moves.reverse()
    }

    let status;
    if (draw) {
      status = "The game is a draw!"
    }
    else if (winner) {
      status = "Winner: " + winner + ".  Winning Line: " + winningLine;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningLine={winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <br />
          <button onClick={() => this.reverseMoveOrder()}>reverse!</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return lines[i];
    }
  }
  return null;
}

function calculateDraw(squares, winner) {
    if (winner) {
        return false;
    }
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return false;
        }
    }
  return true;
}