import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <aside style={{
                width: '320px',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                overflowY: 'auto'
            }}>
                {sidebar}
            </aside>
            <main style={{
                flex: 1,
                backgroundColor: 'var(--bg-dark)',
                padding: '30px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {children}
            </main>
        </div>
    );
};
