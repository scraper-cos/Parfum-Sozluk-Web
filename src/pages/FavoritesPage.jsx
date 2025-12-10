import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getOriginalById } from '../data/db';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useFavorites();

    const favoritePerfumes = favorites.map(id => getOriginalById(id)).filter(Boolean);

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '32px', textAlign: 'center', paddingTop: '20px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)'
                }}>Favorilerim</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Kaydettiğiniz parfümler burada listelenir.
                </p>
            </header>

            {favoritePerfumes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {favoritePerfumes.map(perfume => (
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
                                <p style={{ fontSize: '13px', color: 'var(--primary)', margin: 0, fontWeight: '500' }}>{perfume.brand}</p>
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
                                    fill="#D4AF37"
                                    color="#D4AF37"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px dashed var(--border-subtle)'
                }}>
                    <Heart size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>Henüz Favori Yok</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Beğendiğiniz parfümleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
                    <Link to="/" style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: 'var(--primary)',
                        color: '#000',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '15px'
                    }}>
                        Parfümleri Keşfet
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
