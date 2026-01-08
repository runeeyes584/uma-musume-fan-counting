import React from 'react';
import { Download } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryTableProps {
    history: HistoryItem[];
    onExport: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onExport }) => {


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>History</h2>
                <button className="btn-outline" onClick={onExport} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <Download size={16} /> EXPORT TO CSV
                </button>
            </div>

            <div className="table-container" style={{ flex: 1, overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-sidebar)', zIndex: 1 }}>
                        <tr>
                            <th className="th-cell">STT</th>
                            <th className="th-cell">Name</th>
                            <th className="th-cell">Totals fan</th>
                            <th className="th-cell">Date</th>
                            <th className="th-cell">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row, index) => (
                            <tr key={row.id} className="tr-row">
                                <td className="td-cell">{index + 1}</td>
                                <td className="td-cell">{row.name}</td>
                                <td className="td-cell">{row.fan.toLocaleString()}</td>
                                <td className="td-cell">{row.date}</td>
                                <td className="td-cell">
                                    <button className="link-btn">view</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
