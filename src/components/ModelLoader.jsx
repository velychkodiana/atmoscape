import React from 'react';
import { Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ModelLoader({ isMain = false }) {
    const { i18n } = useTranslation();

    // Перевірка мови (працюватиме одразу)
    const isUa = i18n.language === 'ua' || i18n.language === 'uk';

    // ВЕЛИКИЙ ЛОАДЕР
    if (isMain) {
        return (
            <Html center zIndexRange={[100, 0]}>
                {/* Використовуємо класи з ErrorBoundary! */}
                <div className="glass-panel error-glass" style={{
                    width: '90vw',
                    maxWidth: '450px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px'
                }}>

                    {/* Плаваюча іконка, як у помилки */}
                    <div className="error-icon-wrapper" style={{ animation: 'floatError 4s ease-in-out infinite', marginBottom: '20px' }}>
                        <Loader2 className="animate-spin" size={64} color="var(--accent)" />
                    </div>

                    {/* Великий заголовок Editorial */}
                    <h2 style={{
                        fontFamily: 'var(--font-editorial)',
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        {isUa ? 'Створюємо магію...' : 'Creating magic...'}
                    </h2>

                    {/* Опис у стилі error-text */}
                    <p className="error-text">
                        {isUa
                            ? 'Завантажуємо 3D-модель міста. Це може зайняти кілька секунд.'
                            : 'Loading 3D city model. This might take a few seconds.'}
                    </p>
                </div>
            </Html>
        );
    }

    // МАЛЕНЬКИЙ ЛОАДЕР (Для міні-карток знизу)
    return (
        <Html center zIndexRange={[100, 0]}>
            <div className="glass-panel" style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                color: 'var(--text-primary)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                borderRadius: '50px',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(12px)'
            }}>
                <Loader2 className="animate-spin" size={18} color="var(--accent)" />
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    {isUa ? 'Завантаження 3D...' : 'Loading 3D...'}
                </span>
            </div>
        </Html>
    );
}