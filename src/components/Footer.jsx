import React from 'react';
import { Mail, Phone, Linkedin, Github, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-wrapper glass-panel">
            <div className="footer-content">

                {/* Ліва частина: Статус і заклик */}
                <div className="footer-info">
                    <h3 className="footer-title">
                        Let's create something <span className="highlight-text">beautiful</span> <Sparkles size={20} className="sparkle-icon" />
                    </h3>
                    <div className="status-badge">
                        <span className="pulse-dot"></span>
                        <span className="status-text">Available for work & freelance</span>
                    </div>
                </div>

                {/* Права частина: Скляні картки контактів */}
                <div className="social-grid">
                    <a href="mailto:твій_мейл@gmail.com" className="social-card" title="Email">
                        <div className="social-icon-wrapper"><Mail size={18} /></div>
                        <span>Email</span>
                    </a>

                    <a href="tel:+380000000000" className="social-card" title="Phone">
                        <div className="social-icon-wrapper"><Phone size={18} /></div>
                        <span>Phone</span>
                    </a>

                    <a href="https://linkedin.com/in/твій-профіль" target="_blank" rel="noreferrer" className="social-card" title="LinkedIn">
                        <div className="social-icon-wrapper"><Linkedin size={18} /></div>
                        <span>LinkedIn</span>
                    </a>

                    <a href="https://github.com/velychkodiana" target="_blank" rel="noreferrer" className="social-card" title="GitHub">
                        <div className="social-icon-wrapper"><Github size={18} /></div>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>

            {/* Нижній рядок: Копірайт та підпис */}
            <div className="footer-bottom">
                <p className="copyright-text">© {new Date().getFullYear()} AtmoScape.</p>
                <p className="signature-text">
                    Designed & Engineered with <span className="heart">♡</span> by <strong>Diana Velychko</strong>
                </p>
            </div>
        </footer>
    );
}