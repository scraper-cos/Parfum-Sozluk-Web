import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../context/FavoritesContext';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, getDupesByOriginalId } = useProducts();

    const perfume = products.find(p => p.id === Number(id));
    const dupes = getDupesByOriginalId(id);
    const { isFavorite, toggleFavorite } = useFavorites();

    if (!perfume) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Parfüm bulunamadı.</div>;

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <Link to="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginBottom: '24px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
            }}>
                <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                Geri Dön
            </Link>

            <div className="premium-card" style={{
                borderRadius: '24px',
                padding: '20px',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    aspectRatio: '1',
                    backgroundColor: '#000',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                    <img
                        src={perfume.image}
                        alt={perfume.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            margin: '0 0 4px 0',
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text-primary)'
                        }}>{perfume.name}</h1>
                        <p style={{ fontSize: '16px', color: 'var(--primary)', margin: 0, fontWeight: '500' }}>{perfume.brand}</p>
                    </div>
                    <button
                        onClick={() => toggleFavorite(perfume.id)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Heart
                            size={22}
                            fill={isFavorite(perfume.id) ? "#D4AF37" : "none"}
                            color={isFavorite(perfume.id) ? "#D4AF37" : "#fff"}
                        />
                    </button>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--primary)',
                        fontSize: '13px',
                        fontWeight: '500',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>{perfume.gender}</span>
                </div>

                <p style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)',
                    marginBottom: '0',
                    padding: '16px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px'
                }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Notalar:</strong>
                    {perfume.notes}
                </p>

                {perfume.scentFamily && (
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        marginTop: '12px',
                        marginBottom: '0',
                        padding: '16px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px'
                    }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Koku Ailesi:</strong>
                        {perfume.scentFamily}
                    </p>
                )}

                {perfume.season && (
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        marginTop: '12px',
                        marginBottom: '0',
                        padding: '16px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px'
                    }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Mevsim:</strong>
                        {perfume.season}
                    </p>
                )}

                {perfume.vibe && (
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        marginTop: '12px',
                        marginBottom: '0',
                        padding: '16px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px'
                    }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Kullanım Ortamı (Vibe):</strong>
                        {perfume.vibe}
                    </p>
                )}
            </div>

            <h2 style={{
                fontSize: '22px',
                marginBottom: '16px',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)'
            }}>Muadiller</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dupes.length > 0 ? (
                    dupes.map(dupe => (
                        <div key={dupe.id} className="premium-card" style={{
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(145deg, #1a1a1a 0%, #121212 100%)'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{dupe.brand}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Kod: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{dupe.code}</span></p>
                            </div>
                            <div style={{
                                textAlign: 'right',
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                border: '1px solid rgba(212, 175, 55, 0.2)'
                            }}>
                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)' }}>Benzerlik</span>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>%{dupe.similarity}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Henüz muadil eklenmemiş.</p>
                )}
            </div>
        </div>
    );
};

export default DetailPage;
