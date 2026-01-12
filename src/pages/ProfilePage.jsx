import React, { useState } from 'react';
import { User, LogIn, LogOut, ShieldCheck, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { isAdmin, login, logout } = useAuth();

    // Login Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const result = login(username, password);
        if (!result.success) {
            setError(result.message);
        } else {
            setUsername('');
            setPassword('');
        }
    };

    if (isAdmin) {
        return (
            <div className="container" style={{ paddingBottom: '100px' }}>
                <header style={{ marginBottom: '24px', paddingTop: '20px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Profil</h1>
                </header>

                <div className="premium-card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px', background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)', border: '1px solid #D4AF37' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D4AF37',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}>
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '20px', margin: '0 0 4px 0', color: 'white' }}>Yönetici Hesabı</h2>
                            <p style={{ color: '#D4AF37', margin: 0, fontSize: '14px' }}>Tam Yetkili</p>
                        </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '20px' }}>
                        <p style={{ margin: 0, color: '#d1d5db', fontSize: '14px' }}>
                            Şu anda yönetici modundasınız. Parfüm detay sayfalarında "Düzenle" butonunu görebilir, fiyatları güncelleyebilir ve muadilleri yönetebilirsiniz.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <LogOut size={20} />
                        Yönetici Çıkışı Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '24px', paddingTop: '20px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Profil</h1>
            </header>

            <div className="card premium-card" style={{ padding: '24px', borderRadius: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LogIn size={24} color="#D4AF37" />
                    Yönetici Girişi
                </h2>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {error && (
                        <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#ef4444', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <UserIcon size={20} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input premium-input"
                            style={{ width: '100%', paddingLeft: '44px', height: '50px', borderRadius: '12px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input premium-input"
                            style={{ width: '100%', paddingLeft: '44px', height: '50px', borderRadius: '12px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            marginTop: '8px',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                            height: '50px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Giriş Yap
                    </button>
                </form>

                <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', lineHeight: '1.5' }}>
                    Bu alan sadece site yöneticileri içindir. Normal kullanıcılar arama ve karşılaştırma özelliklerini üyeliksiz kullanabilir.
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
