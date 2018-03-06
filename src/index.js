import React from 'react';
import ReactDOM from 'react-dom';
import Sound from 'react-sound';
import './index.css';

// functional component:
//  - no need to extend from React.Component
//  - no need to define render method
function Square(props) {
  let stylingClass = 'square';
  if (props.winningPositions) {
    const isWinningTile = props.winningPositions.indexOf(props.tilePosition) >= 0;
    if (isWinningTile) {
      stylingClass += ' winningTile';
    }
  }

  return (
    <button className={stylingClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        tilePosition={i}
        winningPositions={this.props.winningPositions}
        onClick={() => this.props.onClick(i)}
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
        }
      ],
      stepNumber: 0,
      winningPositions: null,
      turnForX: true,
    };

    this.startingState = this.state;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // using slice() for immutability
    const squares = current.squares.slice();

    // ignore if the game is already completed or the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.turnForX ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
        }
      ]),
      stepNumber: history.length,
      turnForX: !this.state.turnForX,
    });

    const winner = calculateWinner(squares);
    if (winner) {
      this.setState({
        winningPositions: winner.winningPositions,
      });
    }
  }

  jumpTo(move) {
    const squares = this.state.history[move].squares;
    const winner = calculateWinner(squares);
    const winningPositions = winner ? winner.winningPositions : null;

    // X's turn is on even moves
    this.setState({
      stepNumber: move,
      winningPositions: winningPositions,
      turnForX: (move % 2) === 0,
    });
  }

  resetGame() {
    this.setState(this.startingState);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;

    const moves = history.map((step, move) => {
      // highlight current move
      let moveStyles = (move === stepNumber) ? { backgroundColor: '#e6f382' } : {}

      const description = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button style={moveStyles} onClick={() => this.jumpTo(move)}>{description}</button>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.name;
    } else {
      if (current.squares.join('').length === 9) {
        status = 'Game finished. Nobody won!'
      } else {
        status = 'Next player: ' + (this.state.turnForX ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningPositions={this.state.winningPositions}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          <WinningSound winner={winner} />
          <button onClick={() => this.resetGame()}>Play Again</button>
        </div>
      </div>
    );
  }
}

class WinningSound extends React.Component {
  render() {
    if(this.props.winner) {
      return (
        <Sound
          url="tada.mp3"
          volume={50}
          playStatus={Sound.status.PLAYING}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying}
        />
      );
    } else {
      return null;
    }
  }
}

function calculateWinner(squares) {
  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningPositions.length; i++) {
    const [a, b, c] = winningPositions[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        name: squares[a],
        winningPositions: winningPositions[i],
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
