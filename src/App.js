import './App.css';
import BingoComponent from './BingoComponent/BingoComponent';
import NumberHistoryComponent from './NumberHistoryComponent/NumberHistoryComponent';
import { LocalStorageProvider } from './LocalStorageContext';

function App() {
  return (
    <LocalStorageProvider >
      <div className="App">
        <header className="App-header unselectable">
          <h1>Binary Bingo!</h1>
        </header>
        <div className='container'>
          <NumberHistoryComponent />
          <BingoComponent max="75" min="1"/>
        </div>
      </div>
    </LocalStorageProvider>
  );
}

export default App;
