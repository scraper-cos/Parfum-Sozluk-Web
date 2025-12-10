import React from 'react';
import { User } from 'lucide-react';

const ProfilePage = () => {
    return (
        <div className="container">
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Profil</h1>
            </header>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                }}>
                    <User size={32} />
                </div>
                <div>
                    <h2 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>Misafir Kullanıcı</h2>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Giriş yapılmadı</p>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Ayarlar</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Uygulama ayarları yakında eklenecek.</p>
            </div>
        </div>
    );
};

export default ProfilePage;
