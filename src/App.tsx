import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { InfoForm } from './components/InfoForm';
import { HistoryTable } from './components/HistoryTable';
import { ConfigPage } from './components/ConfigPage';
import type { UserStats, HistoryItem, FormData } from './types';

function App() {
  // State
  const [view, setView] = useState<'home' | 'config'>('home');
  const [stats, setStats] = useState<UserStats>({
    totalFan: 15000000,
    totalRaces: 332,
    totalWins: 200, // Derived or tracked
    goalForWeek: 22000000,
    careers: 332,
    goodEndings: 32,
    club: 'ThinkFast',
    name: 'Kaleidoscope',
    uid: '124378237',
    email: 'example@gmail.com',
    notificationEnabled: false,
    notificationTime: ''
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load data on load
  useEffect(() => {
    const load = async () => {
      if (window.electronAPI) {
        const data = await window.electronAPI.loadData();
        if (data) {
          if (data.stats) setStats(data.stats);
          if (data.history) setHistory(data.history);
        }
      }
    };
    load();
  }, []);

  const handleSave = async (data: FormData) => {
    // Update History
    const newItem: HistoryItem = {
      id: Date.now(),
      name: data.umaName,
      fan: data.totalFan,
      date: `${new Date().toLocaleTimeString()} ${data.date}`
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);

    // Update Stats (excluding totalFan which is "Begin fan")
    const newStats = {
      ...stats,
      totalRaces: stats.totalRaces + data.totalRaces,
      careers: stats.careers + 1 // Increment Careers on new entry
      // Note: If totalWins is also cumulative, add logic here. 
      // Assuming existing logic was correct for races/wins.
    };
    setStats(newStats);

    // Trigger Save IPC
    if (window.electronAPI) {
      await window.electronAPI.saveData({ history: newHistory, stats: newStats });
    }
  };

  const handleDeleteHistory = async (id: number) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);

    const newStats = {
      ...stats,
      careers: Math.max(0, stats.careers - 1) // Decrement Careers on delete
    };
    setStats(newStats);

    if (window.electronAPI) {
      await window.electronAPI.saveData({ history: newHistory, stats: newStats });
    }
  };

  const handleExport = () => {
    console.log('Exporting CSV...');
    // TODO: Implement actual CSV export via IPC
  };

  const handleSaveConfig = async (newStats: Partial<UserStats>) => {
    // Update local state
    const updatedStats = { ...stats, ...newStats };
    setStats(updatedStats);

    // Save to DB
    if (window.electronAPI) {
      await window.electronAPI.saveData({ history, stats: updatedStats });
    }
  };

  // Calculate Derived Stats for Sidebar
  const historyFanSum = history.reduce((sum, item) => sum + item.fan, 0);
  const sidebarStats: UserStats = {
    ...stats,
    totalFan: stats.totalFan + historyFanSum,
    goalForWeek: stats.totalFan + stats.goalForWeek
  };

  // Progress: (Total now - Begin) / Target => History / Target
  const progressPercent = stats.goalForWeek > 0 ? (historyFanSum / stats.goalForWeek) * 100 : 0;

  const handleNewWeek = async () => {
    // Set Begin Fan = Current Total Fan (Stats.totalFan (Begin) + HistorySum)
    const newBeginFan = sidebarStats.totalFan;

    const newStats = {
      ...stats,
      totalFan: newBeginFan
    };
    setStats(newStats);
    setHistory([]);

    if (window.electronAPI) {
      await window.electronAPI.saveData({ history: [], stats: newStats });
    }
  };

  return (
    <Layout sidebar={<Sidebar stats={sidebarStats} progress={progressPercent} onNavigate={(p) => setView(prev => prev === p ? 'home' : p)} />}>
      {view === 'home' ? (
        <>
          <header>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Xin chào, {stats.name}
            </h1>
          </header>

          <section style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <InfoForm onSave={handleSave} />
          </section>

          <section style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
            <HistoryTable history={history} onExport={handleExport} />
          </section>
        </>
      ) : (
        <ConfigPage
          stats={stats}
          history={history}
          onSaveConfig={handleSaveConfig}
          onDeleteHistory={handleDeleteHistory}
          onNewWeek={handleNewWeek}
        />
      )}
    </Layout>
  );
}

export default App;
