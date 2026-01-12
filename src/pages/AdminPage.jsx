import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ArrowLeft, Plus, Save, Upload, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import FirebaseMigrator from '../components/FirebaseMigrator';
import { useProducts } from '../hooks/useProducts';

const AdminPage = () => {
    // Mode: 'create' | 'dupe' | 'migration'
    const [mode, setMode] = useState('create');
    const { products } = useProducts();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Form State for Original Perfume
    const [formData, setFormData] = useState({
        brand: '',
        name: '',
        gender: 'Kadın',
        notes: '',
        scentFamily: '',
        season: 'Dört Mevsim',
        vibe: '',
        price: '',
        productUrl: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateOriginal = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Generate a new ID (Max ID + 1)
            const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
            const newId = maxId + 1;

            const newProduct = {
                id: newId,
                ...formData,
                price: formData.price ? Number(formData.price) : 0,
                image: "/parfumler/default.jpg", // Default placeholder
                createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, 'products', newId.toString()), newProduct);

            setMessage({ type: 'success', text: `✅ ${newProduct.brand} - ${newProduct.name} başarıyla eklendi! (ID: ${newId})` });
            setFormData({ brand: '', name: '', gender: 'Kadın', notes: '', scentFamily: '', season: 'Dört Mevsim', vibe: '', price: '', productUrl: '' });

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Hata oluştu: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1D', color: 'white', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
                <Link to="/" style={{ color: 'white' }}><ArrowLeft /></Link>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Yönetici Paneli</h1>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <button
                    onClick={() => setMode('create')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: mode === 'create' ? '#D4AF37' : '#333', color: mode === 'create' ? 'black' : 'white', cursor: 'pointer' }}
                >
                    Yeni Parfüm
                </button>
                <button
                    onClick={() => setMode('migration')}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: mode === 'migration' ? '#D4AF37' : '#333', color: mode === 'migration' ? 'black' : 'white', cursor: 'pointer' }}
                >
                    Veri Aktarımı
                </button>
            </div>

            {/* Message Area */}
            {message && (
                <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '6px', backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)', border: `1px solid ${message.type === 'success' ? '#4CAF50' : '#F44336'}` }}>
                    {message.text}
                </div>
            )}

            {/* CREATE MODE */}
            {mode === 'create' && (
                <form onSubmit={handleCreateOriginal} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Marka</label>
                            <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="Örn: Chanel" style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Parfüm Adı</label>
                            <input required name="name" value={formData.name} onChange={handleChange} placeholder="Örn: Bleu de Chanel" style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Cinsiyet</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                                <option value="Kadın">Kadın</option>
                                <option value="Erkek">Erkek</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Mevsim</label>
                            <select name="season" value={formData.season} onChange={handleChange} style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                                <option value="Dört Mevsim">Dört Mevsim</option>
                                <option value="Kış">Kış</option>
                                <option value="Sonbahar">Sonbahar</option>
                                <option value="İlkbahar">İlkbahar</option>
                                <option value="Yaz">Yaz</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Notalar</label>
                        <textarea required name="notes" value={formData.notes} onChange={handleChange} placeholder="Örn: Limon, Nane, Sedir..." rows={3} style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Koku Ailesi</label>
                            <input name="scentFamily" value={formData.scentFamily} onChange={handleChange} placeholder="Örn: Odunsu / Aromatik" style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Vibe (Hissiyat)</label>
                            <input name="vibe" value={formData.vibe} onChange={handleChange} placeholder="Örn: Ofis, Temiz, Lüks" style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Fiyat (TL)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0" style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>Ürün URL</label>
                            <input name="productUrl" value={formData.productUrl} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '10px', backgroundColor: '#252529', border: '1px solid #444', borderRadius: '6px', color: 'white' }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '15px',
                            backgroundColor: '#D4AF37',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? 'Yükleniyor...' : <><Save size={20} /> Kaydet</>}
                    </button>

                </form>
            )}

            {/* MIGRATION MODE */}
            {mode === 'migration' && (
                <FirebaseMigrator />
            )}
        </div>
    );
};

export default AdminPage;
