import React from 'react';
import { CloudOff } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel error-glass">
                <div className="error-icon-wrapper" style={{ animation: 'floatError 4s ease-in-out infinite' }}>
                    <CloudOff size={64} color="var(--accent)" />
                </div>

                <h1 className="editorial-title" style={{ fontSize: '6rem', margin: '0' }}>404</h1>
                <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Заблукали в тумані?
                </h2>

                <p className="error-text">
                    Схоже, цієї погодної станції не існує, або її здуло ураганом.
                    Давайте повернемося туди, де світить сонце.
                </p>

                <button
                    className="error-btn"
                    onClick={() => window.location.href = '/'}
                >
                    Повернутися на базу
                </button>
            </div>
        </div>
    );
}