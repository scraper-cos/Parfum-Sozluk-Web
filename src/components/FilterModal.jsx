import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { getOriginals, dupes } from '../data/db';

const FilterModal = ({ isOpen, onClose, onApply, initialFilters }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableNotes, setAvailableNotes] = useState([]);
    const [availableDupeBrands, setAvailableDupeBrands] = useState([]);
    const [availableScentFamilies, setAvailableScentFamilies] = useState([]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [availableVibes, setAvailableVibes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters);

            // Safety checks for data
            const originals = getOriginals() || [];
            const brands = [...new Set(originals.map(o => o.brand))].sort();

            const allNotes = originals.flatMap(o => (o.notes || '').split(',').map(n => n.trim()));
            const notes = [...new Set(allNotes)].sort();

            const safeDupes = dupes || [];
            const availableDupeBrands = ["Loris", "Bargello", "Zara", "D&P", "MAD"];

            const families = originals.flatMap(o => (o.scentFamily || '').split('/').map(f => f.trim())).filter(Boolean);
            const uniqueFamilies = [...new Set(families)].sort();

            // Extract Seasons
            const seasons = originals.flatMap(o => (o.season || '').split('–').map(s => s.trim())).filter(Boolean);
            // Split by '–' (en dash) and also check for standard dash if needed, though db uses en dash.
            // Also handle "Dört Mevsim" which might be a single string.
            // Let's normalize a bit.
            const uniqueSeasons = [...new Set(seasons)].sort();

            // Extract Vibes
            const vibes = originals.flatMap(o => (o.vibe || '').split(',').map(v => v.trim())).filter(Boolean);
            const uniqueVibes = [...new Set(vibes)].sort();


            setAvailableBrands(brands);
            setAvailableNotes(notes);
            setAvailableDupeBrands(availableDupeBrands);
            setAvailableScentFamilies(uniqueFamilies);
            setAvailableSeasons(uniqueSeasons);
            setAvailableVibes(uniqueVibes);
        }
    }, [isOpen, initialFilters]);

    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const current = prev[type] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({ brands: [], genders: [], notes: [], dupeBrands: [], scentFamilies: [], seasons: [], vibes: [] });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal Content */}
            <div className="glass-panel" style={{
                position: 'relative',
                backgroundColor: '#121212',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px',
                maxHeight: '85vh',
                overflowY: 'auto',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontFamily: 'var(--font-display)' }}>Filtrele</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Gender Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Cinsiyet</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['Kadın', 'Erkek', 'Unisex'].map(gender => (
                            <button
                                key={gender}
                                onClick={() => toggleFilter('genders', gender)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: filters.genders.includes(gender) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.genders.includes(gender) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.genders.includes(gender) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Season Section (NEW) */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Mevsim</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableSeasons.map(season => (
                            <button
                                key={season}
                                onClick={() => toggleFilter('seasons', season)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.seasons?.includes(season) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.seasons?.includes(season) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.seasons?.includes(season) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {season}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vibe Section (NEW) */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Kullanım Ortamı (Vibe)</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableVibes.map(vibe => (
                            <button
                                key={vibe}
                                onClick={() => toggleFilter('vibes', vibe)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.vibes?.includes(vibe) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.vibes?.includes(vibe) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.vibes?.includes(vibe) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {vibe}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scent Family Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Koku Ailesi</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableScentFamilies.map(family => (
                            <button
                                key={family}
                                onClick={() => toggleFilter('scentFamilies', family)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.scentFamilies?.includes(family) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.scentFamilies?.includes(family) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.scentFamilies?.includes(family) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {family}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dupe Brand Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Muadil Markası</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableDupeBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => toggleFilter('dupeBrands', brand)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.dupeBrands?.includes(brand) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.dupeBrands?.includes(brand) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.dupeBrands?.includes(brand) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand Section */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Orijinal Marka</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {availableBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => toggleFilter('brands', brand)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.brands.includes(brand) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.brands.includes(brand) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.brands.includes(brand) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes Section */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-muted)' }}>Notalar</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                        {availableNotes.map(note => (
                            <button
                                key={note}
                                onClick={() => toggleFilter('notes', note)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: filters.notes.includes(note) ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    backgroundColor: filters.notes.includes(note) ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                                    color: filters.notes.includes(note) ? 'var(--primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={handleReset}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Temizle
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            flex: 2,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#000',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Check size={18} />
                        Uygula
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
