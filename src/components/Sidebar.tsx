import React from 'react';
import { Copy } from 'lucide-react';
import type { UserStats } from '../types';

interface SidebarProps {
    stats: UserStats;
    progress: number;
    onNavigate: (page: 'home' | 'config') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ stats, progress, onNavigate }) => {
    // Color Logic: < 50% Red, then Orange/Yellow -> Green
    const getProgressColor = (p: number) => {
        if (p < 50) return '#ef4444'; // Red
        if (p < 75) return '#f97316'; // Orange
        return '#22c55e'; // Green
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
            {/* Avatar Section */}
            <div className="avatar-container" style={{
                aspectRatio: '1/1',
                backgroundColor: '#475569',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.9rem',
                textAlign: 'center',
                padding: '10px',
                border: '2px dashed #94a3b8'
            }}>
                This is awesome avatar
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-nav" onClick={() => onNavigate('config')}>CONFIGS</button>
            </div>

            {/* UID Section */}
            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--border-color)'
            }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>UID |||||| {stats.uid}</span>
                <button
                    className="icon-btn"
                    onClick={() => navigator.clipboard.writeText(stats.uid)}
                    title="Copy UID"
                >
                    <Copy size={16} />
                </button>
            </div>

            {/* Stat Section */}
            <div className="stat-card" style={{
                flex: 1,
                borderTop: '1px solid var(--border-color)',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Stat</h3>

                <div className="stat-row">
                    <span>Total fan now:</span>
                    <span>{stats.totalFan.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                    <span>Goal for this week:</span>
                    <span>{stats.goalForWeek.toLocaleString()}</span>
                </div>

                <div className="progress-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Progress:</span>
                        <span style={{ fontSize: '0.8rem' }}>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '10px', backgroundColor: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${Math.min(progress, 100)}%`,
                                height: '100%',
                                backgroundColor: getProgressColor(progress),
                                transition: 'width 0.3s ease, background-color 0.3s ease'
                            }}
                        ></div>
                    </div>
                </div>

                <div className="stat-info" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className="stat-row"><span>Careers:</span><span>{stats.careers}</span></div>
                    <div className="stat-row"><span>Good Endings:</span><span>{stats.goodEndings}</span></div>
                    <div className="stat-row"><span>Club:</span><span>{stats.club}</span></div>
                </div>

                <div style={{ marginTop: 'auto' }}></div>
            </div>
        </div>
    );
};
