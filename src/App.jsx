import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Lock from './screens/Lock.jsx';
import Home from './screens/Home.jsx';
import AppShell from './screens/AppShell.jsx';
import Manage from './screens/Manage.jsx';
import HabitDetail from './screens/HabitDetail.jsx';
import { useStore } from './store.js';

export default function App() {
  const maybeRollover = useStore((s) => s.maybeRollover);

  useEffect(() => {
    maybeRollover();
    const id = setInterval(maybeRollover, 60_000);
    return () => clearInterval(id);
  }, [maybeRollover]);

  return (
    <div className="min-h-screen bg-bg text-ink dot-bg">
      <Routes>
        <Route path="/" element={<Navigate to="/lock" replace />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/home" element={<Home />} />
        <Route path="/app" element={<AppShell />} />
        <Route path="/app/manage" element={<Manage />} />
        <Route path="/app/habit/:id" element={<HabitDetail />} />
        <Route path="/app/:tab" element={<AppShell />} />
        <Route path="*" element={<Navigate to="/lock" replace />} />
      </Routes>
    </div>
  );
}
