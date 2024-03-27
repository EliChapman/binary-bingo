import './App.css';
import BingoComponent from './BingoComponent/BingoComponent';
import NumberHistoryComponent from './NumberHistoryComponent/NumberHistoryComponent';
import { LocalStorageProvider } from './LocalStorageContext';

function App() {
  return (
    <LocalStorageProvider >
      <div id="App">
        <header id='app-header' className="unselectable">
          <h1>Binary Bingo!</h1>
        </header>
        <div id='container'>
          <NumberHistoryComponent />
          <BingoComponent max="75" min="1"/>
        </div>
        <div id='credits'>
          <a href="http://wrhs.net/cshs" className='app-link' target="_blank" rel="noopener noreferrer">Washburn Rural Highschool CSHS</a>
        </div>
      </div>
    </LocalStorageProvider>
  );
}

export default App;