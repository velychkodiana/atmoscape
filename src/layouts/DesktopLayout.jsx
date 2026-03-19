import React from 'react';

export default function DesktopLayout({ header, searchBar, heroText, hero3D, forecast, miniCities, footer }) {
    return (
        <div className="app-layout">
            <header className="glass-panel header-container">
                <h1 className="logo">AtmoScape</h1>
                {searchBar}
                {header}
            </header>

            <main className="hero-section glass-panel">
                <div className="hero-text">{heroText}</div>
                <div className="hero-3d">{hero3D}</div>
            </main>

            {forecast}
            <section className="bottom-grid">{miniCities}</section>
            {footer}
        </div>
    );
}