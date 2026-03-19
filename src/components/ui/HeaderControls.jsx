// src/components/ui/HeaderControls.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function HeaderControls({ lang, handleLangChange, theme, setTheme }) {
    return (
        <div className="controls">
            <button onClick={handleLangChange} className="control-btn">
                {lang.toUpperCase()}
            </button>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="control-btn">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
        </div>
    );
}