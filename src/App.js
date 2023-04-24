import './App.css';
import BingoComponent from './BingoComponent/BingoComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header unselectable">
        <h1>Binary Bingo!</h1>
      </header>
      <div className='container'>
        <BingoComponent max="75" min="1"/>
      </div>
    </div>
  );
}

export default App;
