import React, { createContext, useState, useContext, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
    const [comparisonList, setComparisonList] = useState(() => {
        const saved = localStorage.getItem('comparisonList');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = (perfume) => {
        setComparisonList(prev => {
            if (prev.find(p => p.id === perfume.id)) {
                return prev.filter(p => p.id !== perfume.id); // Toggle off
            }
            if (prev.length >= 2) {
                // If full, replace the first one (FIFO) or just alert? 
                // User said "only 2". Let's replace the oldest one to keep flow smooth.
                return [prev[1], perfume];
            }
            return [...prev, perfume];
        });
    };

    const removeFromComparison = (id) => {
        setComparisonList(prev => prev.filter(p => p.id !== id));
    };

    const isInComparison = (id) => {
        return comparisonList.some(p => p.id === id);
    };

    const clearComparison = () => {
        setComparisonList([]);
    };

    return (
        <ComparisonContext.Provider value={{ comparisonList, addToComparison, removeFromComparison, isInComparison, clearComparison }}>
            {children}
        </ComparisonContext.Provider>
    );
};
