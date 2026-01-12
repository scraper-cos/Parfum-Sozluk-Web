import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

import ComparisonPage from './pages/ComparisonPage';



import { AuthProvider } from './context/AuthContext.jsx';

function App() {
    return (
        <AuthProvider>
            <FavoritesProvider>
                <ComparisonProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/favorites" element={<FavoritesPage />} />
                                <Route path="/comparison" element={<ComparisonPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>
                            <Route path="/detail/:id" element={<DetailPage />} />
                            <Route path="/admin" element={<AdminPage />} />
                        </Routes>
                    </BrowserRouter>
                </ComparisonProvider>
            </FavoritesProvider>
        </AuthProvider>
    );
}

export default App;
