// src/components/ui/SearchBar.jsx
import React from 'react';
import { Search, Clock } from 'lucide-react';
import { getLocalName, formatState } from '../../utils/helpers';

export default function SearchBar({
                                      isMobile, t, lang, searchError, setSearchError, searchInput, setSearchInput,
                                      handleSearch, isSearchFocused, setIsSearchFocused, suggestions,
                                      recentSearches, isTyping, handleCitySelect
                                  }) {
    return (
        <div className={`search-container ${isMobile ? 'mobile-search' : ''}`} style={isMobile ? { width: '100%', maxWidth: '100%', margin: 0 } : {}}>
            <Search size={18} className="search-icon" />
            <input
                type="text"
                placeholder={searchError ? t('notFound') : t('search')}
                className={`search-input ${searchError ? 'search-error' : ''}`}
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); if (searchError) setSearchError(false); }}
                onKeyDown={handleSearch}
                onClick={() => setIsSearchFocused(true)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                style={isMobile ? { fontSize: '16px' } : {}}
            />
            {isSearchFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
                <div className="recent-dropdown glass-panel" style={isMobile ? { width: '100%', top: '100%', left: 0, zIndex: 50 } : {}}>
                    {searchInput.length > 2 ? (
                        <>
                            <div className="recent-header">{isTyping ? t('searching') : t('suggestions')}</div>
                            {suggestions.map((city, idx) => (
                                <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                    <Search size={14} style={{ opacity: 0.5 }} />
                                    <div className="recent-item-text">
                                        <span>{getLocalName(city, lang)}</span>
                                        <small>{formatState(city.state, lang)}{city.state ? ', ' : ''}{city.country}</small>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="recent-header">{t('recent')}</div>
                            {recentSearches.map((city, idx) => (
                                <div key={idx} className="recent-item" onMouseDown={(e) => { e.preventDefault(); handleCitySelect(city); }}>
                                    <Clock size={14} style={{ opacity: 0.5 }} />
                                    <div className="recent-item-text">
                                        <span>{getLocalName(city, lang)}</span>
                                        <small>{formatState(city.state, lang)}{city.state ? ', ' : ''}{city.country}</small>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}