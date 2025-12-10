import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Heart, Music, ThumbsUp, Zap, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { useComparison } from '../context/ComparisonContext';
import { PriceService } from '../services/PriceService';
import { products } from '../data/db';

const ComparisonPage = () => {
    const { comparisonList, clearComparison } = useComparison();
    const [prices, setPrices] = useState({ item1: null, item2: null });
    const [showClearModal, setShowClearModal] = useState(false);

    // Helper to generate deterministic random numbers based on string seed
    const pseudoRandom = (seed) => {
        let value = 0;
        for (let i = 0; i < seed.length; i++) {
            value += seed.charCodeAt(i);
        }
        return (Math.sin(value) + 1) / 2; // 0 to 1
    };

    // Fetch prices on mount
    useEffect(() => {
        if (comparisonList.length >= 2) {
            const fetchPrices = async () => {
                const p1 = await PriceService.getPrice(comparisonList[0].productUrl || comparisonList[0].sephoraUrl);
                const p2 = await PriceService.getPrice(comparisonList[1].productUrl || comparisonList[1].sephoraUrl);
                setPrices({
                    item1: p1,
                    item2: p2
                });
            };
            fetchPrices();
        }
    }, [comparisonList]);

    // If not enough items, show empty state
    if (comparisonList.length < 2) {
        // ... (empty state code omitted for brevity, keeping existing)
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1D', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                    <Zap size={48} color="#D4AF37" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Karşılaştırma Yapın</h2>
                <p style={{ color: '#9ca3af', marginBottom: '30px', maxWidth: '300px' }}>
                    Kıyaslamak istediğiniz 2 parfümü anasayfadaki <ArrowLeft size={16} style={{ display: 'inline', margin: '0 4px' }} /> butonuna tıklayarak seçin.
                </p>
                <Link to="/" style={{
                    padding: '12px 24px',
                    backgroundColor: '#D4AF37',
                    color: '#000',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Plus size={20} />
                    Parfüm Seç
                </Link>

                <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                    {[0, 1].map((i) => (
                        <Link key={i} to="/" style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '16px',
                            border: '2px dashed rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            textDecoration: 'none'
                        }}>
                            {comparisonList[i] ? (
                                <img
                                    src={comparisonList[i].image}
                                    alt={comparisonList[i].name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                                />
                            ) : (
                                <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.2)' }}>?</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Look up fresh data from DB to handle stale localStorage
    const item1 = products.find(p => p.id == comparisonList[0].id) || comparisonList[0];
    const item2 = products.find(p => p.id == comparisonList[1].id) || comparisonList[1];

    // Determine if both perfumes are for women
    const isFemaleComparison = item1.gender === 'Kadın' && item2.gender === 'Kadın';
    const genderLabel = isFemaleComparison ? 'Kadınsı' : 'Erkeksi';
    const genderFeature = isFemaleComparison ? 'feminine' : 'masculine';

    // Generate stats
    const getStat = (id, feature, min = 60, max = 100) => {
        const seed = id + feature;
        const rand = pseudoRandom(seed);
        return Math.floor(min + rand * (max - min));
    };

    const stats1 = {
        longevity: getStat(item1.id, 'longevity'),
        sillage: getStat(item1.id, 'sillage'),
        [genderFeature]: getStat(item1.id, genderFeature),
        fresh: getStat(item1.id, 'fresh'),
        night: getStat(item1.id, 'night'),
        price: prices.item1 || item1.price || getStat(item1.id, 'price', 3000, 8000)
    };

    const stats2 = {
        longevity: getStat(item2.id, 'longevity'),
        sillage: getStat(item2.id, 'sillage'),
        [genderFeature]: getStat(item2.id, genderFeature),
        fresh: getStat(item2.id, 'fresh'),
        night: getStat(item2.id, 'night'),
        price: prices.item2 || item2.price || getStat(item2.id, 'price', 3000, 8000)
    };

    // Determine winners
    const getWinner = (val1, val2) => val1 > val2 ? 'left' : 'right';

    // Dynamic Config
    const config = {
        "screen_title": "Karşılaştırma",
        "ui_components": [
            {
                "type": "header_duel_card",
                "data": {
                    "left_product": {
                        "id": item1.id,
                        "name": item1.name,
                        "brand": item1.brand,
                        "image": item1.image,
                        "tag_text": item1.brand, // Fallback tag
                        "tag_color": "#4A90E2"
                    },
                    "right_product": {
                        "id": item2.id,
                        "name": item2.name,
                        "brand": item2.brand,
                        "image": item2.image,
                        "tag_text": item2.brand, // Fallback tag
                        "tag_color": "#FF6B6B"
                    }
                }
            },
            {
                "type": "radar_chart_widget",
                "title": "Karakter Analizi",
                "description": "Hangi özelliklerde baskınlar?",
                "chart_config": {
                    "labels": ["Kalıcılık", "Yayılım", genderLabel, "Ferahlık", "Gece"],
                    "dataset_left": [stats1.longevity, stats1.sillage, stats1[genderFeature], stats1.fresh, stats1.night],
                    "dataset_right": [stats2.longevity, stats2.sillage, stats2[genderFeature], stats2.fresh, stats2.night],
                    "colors": ["#4A90E2", "#FF6B6B"]
                }
            },
            {
                "type": "comparison_bars_list",
                "title": "Performans & Fiyat",
                "items": [
                    {
                        "label": "Kalıcılık (Longevity)",
                        "left_value_text": `${Math.floor(stats1.longevity / 10)} Saat`,
                        "right_value_text": `${Math.floor(stats2.longevity / 10)} Saat`,
                        "winner": getWinner(stats1.longevity, stats2.longevity),
                        "bar_fill_left": stats1.longevity,
                        "bar_fill_right": stats2.longevity
                    },
                    {
                        "label": "Yayılım (Sillage)",
                        "left_value_text": stats1.sillage > 80 ? "Güçlü" : "Orta",
                        "right_value_text": stats2.sillage > 80 ? "Güçlü" : "Orta",
                        "winner": getWinner(stats1.sillage, stats2.sillage),
                        "bar_fill_left": stats1.sillage,
                        "bar_fill_right": stats2.sillage
                    },
                    {
                        "label": "Fiyat Tahmini",
                        "left_value_text": `₺${stats1.price}`,
                        "right_value_text": `₺${stats2.price}`,
                        "winner": stats1.price < stats2.price ? 'left' : 'right', // Lower price wins
                        "bar_fill_left": (stats1.price / 8000) * 100,
                        "bar_fill_right": (stats2.price / 8000) * 100
                    }
                ]
            },
            {
                "type": "scenario_badges_grid",
                "title": "Hangi Ortam İçin?",
                "description": "Kazanan parfüm rozeti alır.",
                "badges": [
                    {
                        "scenario": "Ofis / İş",
                        "icon": Briefcase,
                        "winner_side": getWinner(stats1.fresh, stats2.fresh),
                        "winner_name": stats1.fresh > stats2.fresh ? item1.name : item2.name
                    },
                    {
                        "scenario": "Randevu (Date)",
                        "icon": Heart,
                        "winner_side": getWinner(stats1[genderFeature], stats2[genderFeature]),
                        "winner_name": stats1[genderFeature] > stats2[genderFeature] ? item1.name : item2.name
                    },
                    {
                        "scenario": "Gece Kulübü",
                        "icon": Music,
                        "winner_side": getWinner(stats1.night, stats2.night),
                        "winner_name": stats1.night > stats2.night ? item1.name : item2.name
                    },
                    {
                        "scenario": "Genel Beğeni",
                        "icon": ThumbsUp,
                        "winner_side": getWinner(stats1.longevity + stats1.sillage, stats2.longevity + stats2.sillage),
                        "winner_name": (stats1.longevity + stats1.sillage) > (stats2.longevity + stats2.sillage) ? item1.name : item2.name
                    }
                ]
            },
            {
                "type": "ai_summary_card",
                "content": `Eğer **${stats1.night > stats2.night ? 'gece hayatı ve eğlence' : 'günlük kullanım ve ofis'}** için bir koku arıyorsan ${stats1.night > stats2.night ? item1.name : item2.name} daha uygun. Ancak **${stats2.fresh > stats1.fresh ? 'ferahlık ve temizlik' : 'karakteristik ve yoğunluk'}** önceliğinse ${stats2.fresh > stats1.fresh ? item2.name : item1.name} tercih etmelisin.`,
                "background_style": "gradient_blue_to_red"
            }
        ]
    };

    const headerData = config.ui_components.find(c => c.type === 'header_duel_card').data;
    const radarData = config.ui_components.find(c => c.type === 'radar_chart_widget');
    const barsData = config.ui_components.find(c => c.type === 'comparison_bars_list');
    const badgesData = config.ui_components.find(c => c.type === 'scenario_badges_grid');
    const summaryData = config.ui_components.find(c => c.type === 'ai_summary_card');

    // Transform Radar Data for Recharts
    const chartData = radarData.chart_config.labels.map((label, index) => ({
        subject: label,
        A: radarData.chart_config.dataset_left[index],
        B: radarData.chart_config.dataset_right[index],
        fullMark: 100,
    }));

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#1A1A1D',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>

            {/* Mobile Container Wrapper */}
            <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#1A1A1D', minHeight: '100vh' }}>

                {/* Header */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backgroundColor: 'rgba(26, 26, 29, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <Link to="/" style={{ color: '#e5e7eb', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, flex: 1 }}>
                        {config.screen_title}
                    </h1>
                    <button
                        onClick={() => setShowClearModal(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* 1. Header Duel Card - Table Layout */}
                    <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                {/* Left Product */}
                                <td style={{ width: '40%', verticalAlign: 'top', textAlign: 'center' }}>
                                    <Link to="/" style={{
                                        display: 'block',
                                        width: '100%',
                                        maxWidth: '100px',
                                        aspectRatio: '1/1',
                                        margin: '0 auto 12px auto',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)'
                                    }}>
                                        <img
                                            src={headerData.left_product.image}
                                            alt={headerData.left_product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </Link>
                                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>{headerData.left_product.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '999px',
                                            backgroundColor: `${headerData.left_product.tag_color}20`,
                                            color: headerData.left_product.tag_color,
                                            border: `1px solid ${headerData.left_product.tag_color}`,
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {headerData.left_product.tag_text}
                                        </span>
                                    </div>
                                </td>

                                {/* VS Icon */}
                                <td style={{ width: '20%', verticalAlign: 'top', textAlign: 'center', paddingTop: '32px' }}>
                                    <Zap size={32} color="#C3073F" fill="#C3073F" style={{ filter: 'drop-shadow(0 0 10px rgba(195,7,63,0.8))' }} />
                                </td>

                                {/* Right Product */}
                                <td style={{ width: '40%', verticalAlign: 'top', textAlign: 'center' }}>
                                    <Link to="/" style={{
                                        display: 'block',
                                        width: '100%',
                                        maxWidth: '100px',
                                        aspectRatio: '1/1',
                                        margin: '0 auto 12px auto',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(255,255,255,0.05)'
                                    }}>
                                        <img
                                            src={headerData.right_product.image}
                                            alt={headerData.right_product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </Link>
                                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>{headerData.right_product.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '999px',
                                            backgroundColor: `${headerData.right_product.tag_color}20`,
                                            color: headerData.right_product.tag_color,
                                            border: `1px solid ${headerData.right_product.tag_color}`,
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {headerData.right_product.tag_text}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 2. Radar Chart Widget */}
                    <div style={{ backgroundColor: '#252529', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{radarData.title}</h2>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{radarData.description}</p>
                        </div>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                    <PolarGrid stroke="#444" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name={headerData.left_product.name}
                                        dataKey="A"
                                        stroke={radarData.chart_config.colors[0]}
                                        fill={radarData.chart_config.colors[0]}
                                        fillOpacity={0.4}
                                    />
                                    <Radar
                                        name={headerData.right_product.name}
                                        dataKey="B"
                                        stroke={radarData.chart_config.colors[1]}
                                        fill={radarData.chart_config.colors[1]}
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: radarData.chart_config.colors[0] }}></div>
                                <span style={{ fontSize: '12px', color: '#d1d5db' }}>{headerData.left_product.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: radarData.chart_config.colors[1] }}></div>
                                <span style={{ fontSize: '12px', color: '#d1d5db' }}>{headerData.right_product.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Comparison Bars List */}
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 4px' }}>{barsData.title}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {barsData.items.map((item, idx) => (
                                <div key={idx} style={{ backgroundColor: '#252529', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>{item.label}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {/* Left Bar */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#1f2937', borderRadius: '999px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
                                                <div style={{
                                                    height: '100%',
                                                    borderRadius: '999px',
                                                    width: `${item.bar_fill_left}%`,
                                                    backgroundColor: item.winner === 'left' ? '#4A90E2' : 'rgba(74, 144, 226, 0.5)'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: item.winner === 'left' ? 'bold' : 'normal', color: item.winner === 'left' ? '#4A90E2' : '#6b7280' }}>
                                                {item.left_value_text}
                                            </span>
                                        </div>

                                        <div style={{ width: '1px', height: '32px', backgroundColor: '#374151' }}></div>

                                        {/* Right Bar */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#1f2937', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    borderRadius: '999px',
                                                    width: `${item.bar_fill_right}%`,
                                                    backgroundColor: item.winner === 'right' ? '#FF6B6B' : 'rgba(255, 107, 107, 0.5)'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: item.winner === 'right' ? 'bold' : 'normal', color: item.winner === 'right' ? '#FF6B6B' : '#6b7280' }}>
                                                {item.right_value_text}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Scenario Badges Grid */}
                    <div>
                        <div style={{ marginBottom: '16px', paddingLeft: '4px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{badgesData.title}</h2>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{badgesData.description}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {badgesData.badges.map((badge, idx) => {
                                const isLeftWinner = badge.winner_side === 'left';
                                const winnerColor = isLeftWinner ? '#4A90E2' : '#FF6B6B';

                                return (
                                    <div key={idx} style={{
                                        backgroundColor: '#252529',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: winnerColor }}></div>
                                        <div style={{ marginBottom: '8px', padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                            <badge.icon size={20} color={winnerColor} />
                                        </div>
                                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>{badge.scenario}</h4>
                                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>Kazanan:</span>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: winnerColor }}>
                                            {badge.winner_name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 5. AI Summary Card */}
                    <div style={{ padding: '4px', borderRadius: '16px', background: 'linear-gradient(to right, #4A90E2, #FF6B6B)' }}>
                        <div style={{ backgroundColor: '#1A1A1D', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', opacity: 0.1 }}>
                                <Zap size={64} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Zap size={20} color="#facc15" fill="#facc15" />
                                AI Özeti
                            </h3>
                            <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', margin: 0 }}>
                                {summaryData.content.split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i} style={{ color: 'white', fontWeight: 'bold' }}>{part}</strong> : part
                                )}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Clear Confirmation Modal */}
            {showClearModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowClearModal(false)}>
                    <div style={{
                        backgroundColor: '#252529',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '320px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px', textAlign: 'center' }}>
                            Temizle?
                        </h3>
                        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', textAlign: 'center' }}>
                            Mevcut karşılaştırma listeniz silinecek. Emin misiniz?
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowClearModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => {
                                    clearComparison();
                                    setShowClearModal(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Temizle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonPage;
