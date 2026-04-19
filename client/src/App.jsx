import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Upload from './pages/Upload';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🍊</span>
            <span className="logo-text">Tangerine</span>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Quiz</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Upload</NavLink>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>

        <footer className="footer">
          <span className="chinese-sample">橘子</span>
          <span>Tangerine — Traditional Chinese Learning</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
