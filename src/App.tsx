import './App.css';
import MainPage from './component/MainPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <div className="App">
      <MainPage/>
    </div>
    </DndProvider>
  );
}

export default App;
