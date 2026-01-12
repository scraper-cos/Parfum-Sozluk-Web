import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { originals, dupes } from '../data/db';
import { Upload, Check, AlertTriangle } from 'lucide-react';

const FirebaseMigrator = () => {
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [log, setLog] = useState([]);

    const migrateData = async () => {
        if (!confirm('Tüm veriler Firestore veritabanına yüklenecek. Emin misiniz?')) return;

        setStatus('uploading');
        setLog(prev => [...prev, '🚀 Migration started...']);

        try {
            const batchSize = 450; // Firestore batch limit is 500
            const totalItems = originals.length + dupes.length;
            setProgress({ current: 0, total: totalItems });

            // Upload Products (Originals)
            let batch = writeBatch(db);
            let count = 0;
            let totalProcessed = 0;

            for (const product of originals) {
                const ref = doc(db, 'products', product.id.toString());
                batch.set(ref, product);
                count++;
                totalProcessed++;

                if (count >= batchSize) {
                    await batch.commit();
                    batch = writeBatch(db);
                    count = 0;
                    setLog(prev => [...prev, `✅ Saved batch of products... (${totalProcessed})`]);
                    setProgress({ current: totalProcessed, total: totalItems });
                }
            }
            if (count > 0) await batch.commit();

            // Upload Dupes
            batch = writeBatch(db);
            count = 0;

            for (const dupe of dupes) {
                const ref = doc(db, 'dupe_mappings', dupe.id.toString());
                batch.set(ref, dupe);
                count++;
                totalProcessed++;

                if (count >= batchSize) {
                    await batch.commit();
                    batch = writeBatch(db);
                    count = 0;
                    setLog(prev => [...prev, `✅ Saved batch of dupes... (${totalProcessed})`]);
                    setProgress({ current: totalProcessed, total: totalItems });
                }
            }
            if (count > 0) await batch.commit();

            setStatus('success');
            setLog(prev => [...prev, '🎉 ALL MIGRATION COMPLETED SUCCESSFULLY!']);

        } catch (error) {
            console.error(error);
            setStatus('error');
            setLog(prev => [...prev, `❌ ERROR: ${error.message}`]);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: 'white', borderRadius: '8px', margin: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={24} />
                Veritabanı Taşıma Aracı
            </h2>
            <p style={{ color: '#aaa', fontSize: '14px' }}>
                db.js dosyasındaki {originals.length} orijinal ve {dupes.length} dupe verisini Firebase'e aktarır.
                Bunu sadece bir kez yapmalısınız.
            </p>

            {status === 'idle' && (
                <button
                    onClick={migrateData}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#D4AF37',
                        color: 'black',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Aktarımı Başlat
                </button>
            )}

            {status === 'uploading' && (
                <div style={{ marginTop: '15px' }}>
                    <div style={{ width: '100%', backgroundColor: '#444', height: '10px', borderRadius: '5px' }}>
                        <div style={{
                            width: `${(progress.current / progress.total) * 100}%`,
                            backgroundColor: '#D4AF37',
                            height: '100%',
                            borderRadius: '5px',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                    <p style={{ marginTop: '5px', textAlign: 'right' }}>{progress.current} / {progress.total}</p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(76, 175, 80, 0.2)', border: '1px solid #4CAF50', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check color="#4CAF50" />
                    <span>Başarıyla tamamlandı! Artık Admin panelini kullanabilirsiniz.</span>
                </div>
            )}

            <div style={{ marginTop: '20px', maxHeight: '150px', overflowY: 'auto', backgroundColor: '#000', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
                {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
        </div>
    );
};

export default FirebaseMigrator;
