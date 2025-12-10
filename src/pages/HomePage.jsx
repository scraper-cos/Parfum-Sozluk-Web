import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { App } from '@capacitor/app';
import { getOriginals, dupes } from '../data/db';
import { useFavorites } from '../context/FavoritesContext';
import { useComparison } from '../context/ComparisonContext';
import FilterModal from '../components/FilterModal';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(() => {
        return sessionStorage.getItem('perfumeSearchTerm') || '';
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showGenderWarning, setShowGenderWarning] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const saved = sessionStorage.getItem('perfumeFilters');
        const defaults = {
            brands: [],
            genders: [],
            notes: [],
            dupeBrands: [],
            scentFamilies: [],
            seasons: [],
            vibes: []
        };
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });

    const originals = getOriginals();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addToComparison, isInComparison, comparisonList } = useComparison();

    // Handle Hardware Back Button
    const isFilterOpenRef = React.useRef(isFilterOpen);

    useEffect(() => {
        isFilterOpenRef.current = isFilterOpen;
    }, [isFilterOpen]);

    useEffect(() => {
        let backButtonListener;

        const setupListener = async () => {
            backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
                if (isFilterOpenRef.current) {
                    setIsFilterOpen(false);
                } else if (showGenderWarning) {
                    setShowGenderWarning(false);
                } else {
                    if (!canGoBack) {
                        App.exitApp();
                    } else {
                        window.history.back();
                    }
                }
            });
        };

        setupListener();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove();
            }
        };
    }, [showGenderWarning, isFilterOpen]);

    // Persist state
    useEffect(() => {
        sessionStorage.setItem('perfumeSearchTerm', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        sessionStorage.setItem('perfumeFilters', JSON.stringify(selectedFilters));
    }, [selectedFilters]);

    const filteredOriginals = originals.filter(item => {
        // 1. Search Logic
        const term = searchTerm.toLowerCase();
        const hasMatchingDupe = dupes.some(d => {
            const fullDupeName = `${d.brand} ${d.code}`.toLowerCase();
            return d.originalId === item.id && fullDupeName.includes(term);
        });

        const matchesSearch =
            item.name.toLowerCase().includes(term) ||
            item.brand.toLowerCase().includes(term) ||
            item.notes.toLowerCase().includes(term) ||
            item.gender.toLowerCase().includes(term) ||
            item.scentFamily?.toLowerCase().includes(term) ||
            hasMatchingDupe;

        // 2. Filter Logic
        const matchesBrand = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(item.brand);
        const matchesGender = selectedFilters.genders.length === 0 || selectedFilters.genders.includes(item.gender);

        // For notes, check if ANY of the selected notes are present in the item's notes
        const matchesNotes = selectedFilters.notes.length === 0 || selectedFilters.notes.some(note =>
            item.notes.toLowerCase().includes(note.toLowerCase())
        );

        // For Dupe Brands: Check if the original perfume has ANY dupe from the selected brands
        const matchesDupeBrand = selectedFilters.dupeBrands.length === 0 ||
            dupes.some(d => d.originalId === item.id && selectedFilters.dupeBrands.includes(d.brand));

        // For Scent Families: Check if the item's scent family includes ANY of the selected families
        const matchesScentFamily = selectedFilters.scentFamilies.length === 0 ||
            selectedFilters.scentFamilies.some(family => item.scentFamily?.includes(family));

        // For Seasons: Check if the item's season includes ANY of the selected seasons
        const matchesSeason = selectedFilters.seasons?.length === 0 ||
            selectedFilters.seasons?.some(season => item.season?.includes(season));

        // For Vibes: Check if the item's vibe includes ANY of the selected vibes
        const matchesVibe = selectedFilters.vibes?.length === 0 ||
            selectedFilters.vibes?.some(vibe => item.vibe?.includes(vibe));

        return matchesSearch && matchesBrand && matchesGender && matchesNotes && matchesDupeBrand && matchesScentFamily && matchesSeason && matchesVibe;
    });

    console.log('DEBUG: Originals count:', originals.length);
    console.log('DEBUG: Search term:', searchTerm);
    console.log('DEBUG: Selected filters:', selectedFilters);
    console.log('DEBUG: Filtered count:', filteredOriginals.length);

    const activeFilterCount = selectedFilters.brands.length + selectedFilters.genders.length + selectedFilters.notes.length + (selectedFilters.dupeBrands?.length || 0) + (selectedFilters.scentFamilies?.length || 0) + (selectedFilters.seasons?.length || 0) + (selectedFilters.vibes?.length || 0);

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '32px', textAlign: 'center', paddingTop: '20px' }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    background: 'linear-gradient(to right, #fff, #D4AF37)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em'
                }}>Parfüm Sözlüğü</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '300', marginBottom: '16px' }}>
                    Lüks kokuların uygun fiyatlı dünyasını keşfedin.
                </p>

            </header>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        size={20}
                        color="var(--primary)"
                        style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}
                    />
                    <input
                        type="text"
                        className="input premium-input"
                        placeholder="Parfüm, kod, marka veya nota ara..."
                        style={{
                            paddingLeft: '48px',
                            height: '50px',
                            borderRadius: '16px',
                            fontSize: '15px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="premium-input"
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)', // Gold tint
                        border: '1px solid rgba(212, 175, 55, 0.3)', // Gold border
                        marginLeft: '8px'
                    }}
                >
                    <SlidersHorizontal size={20} color="var(--primary)" />
                    {activeFilterCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'var(--primary)',
                            color: '#000',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {activeFilterCount > 0 ? 'Filtrelenen Sonuçlar' : 'Popüler Parfümler'}
                </h2>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    {filteredOriginals.length} sonuç
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {filteredOriginals.map(perfume => (
                    <div key={perfume.id} style={{ position: 'relative' }}>
                        <Link to={`/detail/${perfume.id}`} className="card premium-card" style={{
                            display: 'block',
                            height: '100%',
                            borderRadius: '16px',
                            padding: '12px',
                            textDecoration: 'none'
                        }}>
                            <div style={{
                                aspectRatio: '1',
                                backgroundColor: '#000',
                                borderRadius: '12px',
                                marginBottom: '14px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src={perfume.image}
                                    alt={perfume.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                                }} />
                            </div>
                            <h3 style={{
                                fontSize: '17px',
                                fontWeight: '600',
                                margin: '0 0 6px 0',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-display)'
                            }}>{perfume.name}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--primary)', margin: '0 0 4px 0', fontWeight: '500' }}>{perfume.brand}</p>
                            {perfume.scentFamily && (
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{perfume.scentFamily}</p>
                            )}
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(perfume.id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <Heart
                                size={18}
                                fill={isFavorite(perfume.id) ? "#D4AF37" : "none"}
                                color={isFavorite(perfume.id) ? "#D4AF37" : "#fff"}
                            />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();

                                // Check for gender conflict
                                if (!isInComparison(perfume.id) && comparisonList.length > 0) {
                                    const referencePerfume = comparisonList[comparisonList.length - 1];
                                    const isConflict = (referencePerfume.gender === 'Erkek' && perfume.gender === 'Kadın') ||
                                        (referencePerfume.gender === 'Kadın' && perfume.gender === 'Erkek');

                                    if (isConflict) {
                                        setShowGenderWarning(true);
                                        return;
                                    }
                                }

                                const willNavigate = !isInComparison(perfume.id) && comparisonList.length >= 1;
                                addToComparison(perfume);

                                if (willNavigate) {
                                    navigate('/comparison');
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                backgroundColor: isInComparison(perfume.id) ? 'rgba(212, 175, 55, 0.8)' : 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: isInComparison(perfume.id) ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                zIndex: 10,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ArrowRightLeft
                                size={16}
                                color={isInComparison(perfume.id) ? "#000" : "#fff"}
                            />
                        </button>
                    </div>
                ))}
            </div>

            {filteredOriginals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Aradığınız kriterlere uygun parfüm bulunamadı.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedFilters({
                                brands: [],
                                genders: [],
                                notes: [],
                                dupeBrands: [],
                                scentFamilies: [],
                                seasons: [],
                                vibes: []
                            });
                            sessionStorage.removeItem('perfumeSearchTerm');
                            sessionStorage.removeItem('perfumeFilters');
                        }}
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: '#000',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            )}

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={setSelectedFilters}
                initialFilters={selectedFilters}
            />

            {/* Premium Warning Modal */}
            {showGenderWarning && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setShowGenderWarning(false)}>
                    <div style={{
                        backgroundColor: '#1A1A1D',
                        border: '1px solid #D4AF37',
                        borderRadius: '24px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.2)',
                        animation: 'fadeIn 0.2s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px auto',
                            border: '1px solid rgba(212, 175, 55, 0.2)'
                        }}>
                            <AlertTriangle size={32} color="#D4AF37" />
                        </div>
                        <h3 style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                            fontFamily: 'var(--font-display)'
                        }}>Uyumsuz Seçim</h3>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '14px',
                            marginBottom: '24px',
                            lineHeight: '1.5'
                        }}>
                            Seçilen parfümler farklı iki cinsiyet içermektedir. Lütfen aynı cinsiyet grubundan seçim yapınız.
                        </p>
                        <button
                            onClick={() => setShowGenderWarning(false)}
                            style={{
                                backgroundColor: '#D4AF37',
                                color: '#000',
                                border: 'none',
                                padding: '14px 32px',
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'transform 0.2s'
                            }}
                        >
                            Anlaşıldı
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
