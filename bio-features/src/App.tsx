import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/Nav';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <BrowserRouter>
      <Routes>
        <Route path={'/'} Component={Home}/>
      </Routes>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
