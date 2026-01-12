import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, User, ArrowRightLeft, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const BottomNav = () => {
    const { isAdmin } = useAuth();
    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            paddingBottom: '20px' // Safe area for iPhone home bar
        }}>
            <NavLink
                to="/"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                })}
            >
                <Compass size={28} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>KEŞFET</span>
            </NavLink>

            <NavLink
                to="/favorites"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                })}
            >
                <Heart size={28} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>FAVORİLER</span>
            </NavLink>

            <NavLink
                to="/comparison"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                })}
            >
                <ArrowRightLeft size={28} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>KIYASLA</span>
            </NavLink>

            {isAdmin && (
                <NavLink
                    to="/admin"
                    className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? '#D4AF37' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'translateY(-2px)' : 'none'
                    })}
                >
                    <PlusCircle size={28} strokeWidth={1.5} />
                    <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>EKLE</span>
                </NavLink>
            )}

            <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.3s ease',
                    transform: isActive ? 'translateY(-2px)' : 'none'
                })}
            >
                <User size={28} strokeWidth={1.5} />
                <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500', letterSpacing: '0.5px' }}>PROFİL</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
