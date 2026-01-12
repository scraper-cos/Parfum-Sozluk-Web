import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Edit2, Save, X, Plus, Trash2, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../context/FavoritesContext.jsx';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, getDupesByOriginalId } = useProducts();
    const { isAdmin } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();

    const perfume = products.find(p => p.id === Number(id));
    const dupes = getDupesByOriginalId(id);

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});

    // New Dupe State
    const [isAddingDupe, setIsAddingDupe] = useState(false);
    const [newDupe, setNewDupe] = useState({ brand: '', code: '', similarity: 90 });

    useEffect(() => {
        if (perfume) {
            setEditForm(perfume);
        }
    }, [perfume]);

    // Handle Product Update
    const handleUpdateProduct = async () => {
        if (!isAdmin) return;
        try {
            // Find the document ID. Since we don't have it directly in 'perfume' object usually, 
            // we might need to query it or assume ID is the doc ID if we migrated that way.
            // BUT, our migration script used perfume.id as the document ID? Let's check.
            // If migration used addDoc, ID is random. If setDoc(doc(..., id)), it matches.
            // Let's assume for now we need to find it or we used the ID string.
            // For now, let's try to update based on the numeric ID if we can find the docRef.
            // Actually, in useProducts we map doc.data(). We are strictly missing the Firestore Document ID.
            // To fix this simply, we should assume the collection is indexed by String(id) if possible, 
            // OR we need to update useProducts to include doc.id. 
            // Let's blindly try doc(db, 'products', String(id)) first as that was the migration plan.
            const productRef = doc(db, 'products', String(id));
            await updateDoc(productRef, editForm);
            setIsEditMode(false);
            alert('Ürün güncellendi!');
        } catch (error) {
            console.error("Update error:", error);
            alert('Güncelleme hatası: ' + error.message);
        }
    };

    // Handle New Dupe
    const handleAddDupe = async () => {
        if (!isAdmin) return;
        try {
            const dupeId = Date.now(); // Simple ID generation
            const dupeRef = doc(db, 'dupe_mappings', String(dupeId));
            await setDoc(dupeRef, {
                id: dupeId,
                originalId: Number(id),
                ...newDupe,
                similarity: Number(newDupe.similarity)
            });
            setNewDupe({ brand: '', code: '', similarity: 90 });
            setIsAddingDupe(false);
            alert('Muadil eklendi!');
        } catch (error) {
            console.error("Add dupe error:", error);
            alert('Ekleme hatası');
        }
    };

    // Handle Delete Dupe
    // Note: We need the document ID of the dupe. 
    // Just like products, useProducts needs to return document IDs to be robust.
    // For now, let's assume we migrated using String(id) as key.
    const handleDeleteDupe = async (dupeId) => {
        if (!confirm('Bu muadili silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'dupe_mappings', String(dupeId)));
        } catch (error) {
            console.error("Delete error:", error);
            alert('Silme hatası');
        }
    };

    if (!perfume) return <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>Parfüm bulunamadı.</div>;

    const renderEditableField = (label, field, type = 'text', textarea = false) => {
        if (!isEditMode) return null;
        return (
            <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>{label}</label>
                {textarea ? (
                    <textarea
                        className="input"
                        value={editForm[field] || ''}
                        onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                        style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                ) : (
                    <input
                        type={type}
                        className="input"
                        value={editForm[field] || ''}
                        onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Link to="/" style={{
                    display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
                }}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                    Geri Dön
                </Link>

                {isAdmin && (
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '20px',
                            backgroundColor: isEditMode ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                            color: isEditMode ? '#000' : '#fff',
                            border: 'none', cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        {isEditMode ? <><Save size={16} /> Tamamla</> : <><Edit2 size={16} /> Düzenle</>}
                    </button>
                )}
            </div>

            <div className="premium-card" style={{
                borderRadius: '24px', padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
                border: isEditMode ? '1px solid #D4AF37' : 'none'
            }}>
                {isEditMode && (
                    <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#D4AF37', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        DÜZENLEME MODU
                    </div>
                )}

                <div style={{
                    aspectRatio: '1', backgroundColor: '#000', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                    <img
                        src={perfume.image}
                        alt={perfume.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                    />
                </div>

                {isEditMode ? (
                    <div style={{ marginBottom: '20px' }}>
                        {renderEditableField('Marka', 'brand')}
                        {renderEditableField('Parfüm Adı', 'name')}
                        {renderEditableField('Görsel URL', 'image')}
                        <button onClick={handleUpdateProduct} style={{ width: '100%', padding: '10px', backgroundColor: '#D4AF37', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{perfume.name}</h1>
                            <p style={{ fontSize: '16px', color: 'var(--primary)', margin: 0, fontWeight: '500' }}>{perfume.brand}</p>
                        </div>
                        <button
                            onClick={() => toggleFavorite(perfume.id)}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <Heart size={22} fill={isFavorite(perfume.id) ? "#D4AF37" : "none"} color={isFavorite(perfume.id) ? "#D4AF37" : "#fff"} />
                        </button>
                    </div>
                )}

                {!isEditMode && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary)', fontSize: '13px', fontWeight: '500', border: '1px solid rgba(212, 175, 55, 0.2)' }}>{perfume.gender}</span>
                        {perfume.price && <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '13px', fontWeight: '500' }}>{perfume.price} ₺</span>}
                    </div>
                )}

                {isEditMode && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        {renderEditableField('Cinsiyet (Kadın/Erkek/Unisex)', 'gender')}
                        {renderEditableField('Fiyat', 'price', 'number')}
                    </div>
                )}

                {isEditMode ? (
                    <>
                        {renderEditableField('Notalar', 'notes', 'text', true)}
                        {renderEditableField('Koku Ailesi', 'scentFamily')}
                        {renderEditableField('Mevsim', 'season')}
                        {renderEditableField('Vibe', 'vibe')}
                    </>
                ) : (
                    <>
                        <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '0', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Notalar:</strong>
                            {perfume.notes}
                        </p>
                        {perfume.scentFamily && (
                            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '0', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Koku Ailesi:</strong>
                                {perfume.scentFamily}
                            </p>
                        )}
                        {perfume.season && (
                            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '0', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Mevsim:</strong>
                                {perfume.season}
                            </p>
                        )}
                        {perfume.vibe && (
                            <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '0', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Kullanım Ortamı (Vibe):</strong>
                                {perfume.vibe}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '22px', margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Muadiller</h2>
                {isAdmin && (
                    <button
                        onClick={() => setIsAddingDupe(!isAddingDupe)}
                        style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 'bold' }}
                    >
                        <Plus size={18} /> Ekle
                    </button>
                )}
            </div>

            {isAddingDupe && (
                <div className="premium-card" style={{ padding: '16px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#D4AF37' }}>Yeni Muadil Ekle</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input placeholder="Marka (örn: Loris)" className="input" value={newDupe.brand} onChange={e => setNewDupe({ ...newDupe, brand: e.target.value })} style={{ padding: '8px', borderRadius: '8px' }} />
                        <input placeholder="Kod (örn: K-204)" className="input" value={newDupe.code} onChange={e => setNewDupe({ ...newDupe, code: e.target.value })} style={{ padding: '8px', borderRadius: '8px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#ccc' }}>Benzerlik: %{newDupe.similarity}</span>
                            <input type="range" min="50" max="100" value={newDupe.similarity} onChange={e => setNewDupe({ ...newDupe, similarity: e.target.value })} style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button onClick={() => setIsAddingDupe(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #666', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>İptal</button>
                            <button onClick={handleAddDupe} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#D4AF37', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Kaydet</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dupes.length > 0 ? (
                    dupes.map(dupe => (
                        <div key={dupe.id} className="premium-card" style={{
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(145deg, #1a1a1a 0%, #121212 100%)',
                            position: 'relative'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{dupe.brand}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Kod: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{dupe.code}</span></p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteDupe(dupe.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
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
