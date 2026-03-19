// src/components/ui/ErrorBoundary.jsx
import React from 'react';
import { CloudOff } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page-wrapper">
                    <div className="glass-panel error-glass">
                        <div className="error-icon-wrapper">
                            <CloudOff size={64} strokeWidth={1.5} />
                        </div>
                        <h1 className="error-title">{this.props.errorTitle}</h1>
                        <p className="error-text">{this.props.errorDesc}</p>
                        <button className="error-btn" onClick={() => window.location.reload()}>
                            {this.props.errorBtn}
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}