import React from 'react';

export default function MobileLayout({ header, searchBar, heroText, hero3D, forecast, miniCities, footer }) {
    return (
        <div className="app-layout mobile-layout-clean">
            <header className="mobile-header-top glass-panel" style={{ padding: '15px', borderRadius: '20px' }}>
                <h1 className="logo" style={{ margin: 0 }}>AtmoScape</h1>
                {header}
            </header>

            {searchBar}

            <main className="mobile-hero-text glass-panel">
                {heroText}
            </main>

            <div className="mobile-hero-3d glass-panel">
                {hero3D}
            </div>

            {forecast}
            <section className="mobile-bottom-grid">{miniCities}</section>
            {footer}
        </div>
    );
}