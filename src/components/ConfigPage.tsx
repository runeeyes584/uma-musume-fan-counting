import React, { useState, useEffect } from 'react';
import { Trash2, Save } from 'lucide-react';
import type { UserStats, HistoryItem } from '../types';
import avatarImg from '../assets/avt.jpg';
import bannerImg from '../assets/banner.png';

interface ConfigPageProps {
    stats: UserStats;
    history: HistoryItem[];
    onSaveConfig: (newStats: UserStats) => void;
    onDeleteHistory: (id: number) => void;
    onNewWeek: () => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({ stats, history, onSaveConfig, onDeleteHistory, onNewWeek }) => {
    // ... existing state and effects ...
    const [formStats, setFormStats] = useState<UserStats>(stats);

    // Sync state if props change (loading data or external updates)
    useEffect(() => {
        setFormStats(stats);
    }, [stats]);

    const handleChange = (field: keyof UserStats, value: string | number | boolean) => {
        setFormStats(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onSaveConfig(formStats);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>CONFIG</h2>
                <button
                    className="btn-primary"
                    onClick={onNewWeek}
                    style={{ padding: '5px 15px', fontSize: '0.9rem' }}
                >
                    Tuần mới
                </button>
            </div>

            {/* Top Section: Images & User Info */}
            <div style={{ display: 'flex', gap: '20px', height: '300px' }}>
                {/* Avatar Upload */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ flex: 1, backgroundColor: '#334155', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={avatarImg} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Parent Uma Upload */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ flex: 1, backgroundColor: '#334155', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={bannerImg} alt="Parent Uma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* User Info Details - Editable */}
                <div style={{ flex: 1.5, backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div className="config-row">
                        <label>Name:</label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                value={formStats.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="config-row">
                        <label>UID:</label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                value={formStats.uid || ''}
                                onChange={(e) => handleChange('uid', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="config-row">
                        <label>Club:</label>
                        <div className="input-with-icon">
                            <input
                                type="text"
                                value={formStats.club || ''}
                                onChange={(e) => handleChange('club', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="config-row">
                        <label>Good Endings:</label>
                        <div className="input-with-icon">
                            <input
                                type="number"
                                value={formStats.goodEndings}
                                onChange={(e) => handleChange('goodEndings', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="config-row">
                        <label>Totals careers:</label>
                        <div className="input-with-icon">
                            <input
                                type="number"
                                value={formStats.careers}
                                onChange={(e) => handleChange('careers', Number(e.target.value))}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Middle Section: Stats - Editable */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>Begin fan:</span>
                    <div className="input-with-icon" style={{ width: '200px' }}>
                        <input
                            type="number"
                            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                            value={formStats.totalFan}
                            onChange={(e) => handleChange('totalFan', Number(e.target.value))}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>Target:</span>
                    <div className="input-with-icon" style={{ width: '200px' }}>
                        <input
                            type="number"
                            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                            value={formStats.goalForWeek}
                            onChange={(e) => handleChange('goalForWeek', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Table & Notifications */}
            <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: '300px' }}>
                {/* Table */}
                <div className="table-container" style={{ flex: 2, overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-card)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-sidebar)', zIndex: 1 }}>
                            <tr>
                                <th className="th-cell">STT</th>
                                <th className="th-cell">Name Uma</th>
                                <th className="th-cell">Career fans</th>
                                <th className="th-cell">Date</th>
                                <th className="th-cell">View</th>
                                <th className="th-cell"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((row, index) => (
                                <tr key={row.id} className="tr-row">
                                    <td className="td-cell">{index + 1}</td>
                                    <td className="td-cell">{row.name}</td>
                                    <td className="td-cell">{row.fan.toLocaleString()}</td>
                                    <td className="td-cell">{row.date}</td>
                                    <td className="td-cell"><button className="link-btn">view</button></td>
                                    <td className="td-cell">
                                        <button
                                            className="icon-btn"
                                            style={{ color: '#ef4444' }}
                                            onClick={() => onDeleteHistory(row.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Notifications - Editable */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-card)',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NOTIFICATION</span>
                        {/* Toggle Switch */}
                        <div
                            onClick={() => handleChange('notificationEnabled', !formStats.notificationEnabled)}
                            style={{
                                width: '48px',
                                height: '26px',
                                backgroundColor: formStats.notificationEnabled ? 'var(--accent-primary)' : '#475569',
                                borderRadius: '13px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease-in-out',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                right: formStats.notificationEnabled ? '3px' : 'auto',
                                left: formStats.notificationEnabled ? 'auto' : '3px',
                                top: '3px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>At specific time:</label>
                            <input
                                type="time"
                                className="input-field"
                                style={{ padding: '12px', fontSize: '1.1rem', backgroundColor: '#1e293b' }}
                                value={formStats.notificationTime}
                                onChange={(e) => handleChange('notificationTime', e.target.value)}
                                disabled={!formStats.notificationEnabled}
                            />
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <button
                                className="btn-primary"
                                onClick={handleSave}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '12px',
                                    fontSize: '1rem'
                                }}
                            >
                                <Save size={18} /> SAVE SETTINGS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .config-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 1rem;
                }
                .input-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                    padding: 2px 0;
                }
                .input-with-icon:hover, .input-with-icon:focus-within {
                    border-bottom: 1px solid var(--accent-secondary);
                }
                .input-with-icon input {
                    background: transparent;
                    border: none;
                    color: white;
                    text-align: right;
                    width: 100%;
                    outline: none;
                    font-family: inherit;
                    font-size: inherit;
                }
            `}</style>
        </div>
    );
};
