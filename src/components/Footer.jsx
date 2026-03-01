import React from 'react';

export default function Footer() {
    return (
        <footer className="glass-panel" style={{ marginTop: '2rem', padding: '4rem 2rem 2rem', borderRadius: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', fontFamily: 'var(--font-editorial)', fontWeight: 800, letterSpacing: '-2px', opacity: 0.9 }}>
                    AtmoScape.
                </h2>
            </div>

            <div style={{
                display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
                paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', opacity: 0.8, fontSize: '0.9rem'
            }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" className="footer-link">LinkedIn</a>
                    <a href="#" className="footer-link">GitHub</a>
                    <a href="#" className="footer-link">Portfolio</a>
                </div>

                <div style={{ fontWeight: 500 }}>
                    React + WebGL • OpenWeather API
                </div>

                <div>
                    &copy; 2026 Dixna Velychko
                </div>
            </div>
        </footer>
    );
}