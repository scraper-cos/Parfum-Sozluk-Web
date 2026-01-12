import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { originals as staticOriginals, dupes as staticDupes } from '../data/db'; // Fallback

export const useProducts = () => {
    const [products, setProducts] = useState(staticOriginals); // Start with static for instant load
    const [dupes, setDupes] = useState(staticDupes);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time subscription to Products
        const qProducts = query(collection(db, 'products'), orderBy('id'));
        const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
            if (!snapshot.empty) {
                const fetchedProducts = snapshot.docs.map(doc => doc.data());
                setProducts(fetchedProducts);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            // On error, we silently keep using static data (offline mode)
            setLoading(false);
        });

        // Real-time subscription to Dupes
        const qDupes = query(collection(db, 'dupe_mappings'));
        const unsubscribeDupes = onSnapshot(qDupes, (snapshot) => {
            if (!snapshot.empty) {
                const fetchedDupes = snapshot.docs.map(doc => doc.data());
                setDupes(fetchedDupes);
            }
        });

        return () => {
            unsubscribeProducts();
            unsubscribeDupes();
        };
    }, []);

    const getOriginals = () => products;

    const getDupesByOriginalId = (originalId) => {
        return dupes
            .filter(d => d.originalId === Number(originalId))
            .sort((a, b) => b.similarity - a.similarity);
    };

    return {
        products,
        dupes,
        loading,
        getOriginals,
        getDupesByOriginalId
    };
};
