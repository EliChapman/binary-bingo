import './App.css';
import BingoComponent from './BingoComponent/BingoComponent';
import NumberHistoryComponent from './NumberHistoryComponent/NumberHistoryComponent';
import { LocalStorageProvider } from './LocalStorageContext';
import TimerComponent from './TimerComponent/TimerComponent';

// App Component, the root of the application
function App() {
  return (
    // State provider, provides state to all components
    // Yes it is incorrectly named, its function changed partway through creating it and I was too lazy to rename it
    <LocalStorageProvider >
      <div id="App">
        <header id='app-header' className="unselectable">
          <h1>Binary Bingo!</h1>
        </header>
        <div id='container'>
          <NumberHistoryComponent />
          <BingoComponent max="75" min="1"/>
          <TimerComponent />
        </div>
        <div id='credits'>
          <a href="http://wrhs.net/cshs" className='app-link' target="_blank" rel="noopener noreferrer">Washburn Rural Highschool CSHS</a>
        </div>
      </div>
    </LocalStorageProvider>
  );
}

export default App;