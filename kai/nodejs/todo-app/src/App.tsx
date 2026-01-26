import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppNav } from './components/layout/AppNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { TodoList } from './components/todos/TodoList';
import './App.scss';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <AppNav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
