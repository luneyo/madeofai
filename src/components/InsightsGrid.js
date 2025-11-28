import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Lock } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const InsightsGrid = ({ words }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [email, setEmail] = useState("");

    if (!words || words.length === 0) return null;

    // Sort by value desc
    const sorted = [...words].sort((a, b) => b.value - a.value);

    const top1 = sorted[0];
    const top2 = sorted[1];
    const top3 = sorted[2];
    const rest = sorted.slice(3);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Award className="w-6 h-6 text-orange-500" />;
        return null;
    };

    const getRankColor = (index) => {
        if (index === 0) return 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)'; // Gold-ish
        if (index === 1) return 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)'; // Silver-ish
        if (index === 2) return 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)'; // Bronze-ish
        return 'white';
    };

    const handleUnlock = (e) => {
        e.preventDefault();
        if (email) {
            setIsUnlocked(true);
        }
    };

    const RankCard = ({ word, index, blur }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{
                background: getRankColor(index),
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.5)',
                minHeight: '200px',
                flex: '1 1 250px',
                filter: blur ? 'blur(10px)' : 'none',
                transition: 'filter 0.3s',
            }}
        >
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.5)',
                padding: '0.5rem',
                borderRadius: '50%'
            }}>
                {getRankIcon(index)}
            </div>

            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#1e293b',
                margin: '0 0 0.5rem 0',
                textAlign: 'center',
                lineHeight: 1.1
            }}>
                {word.text}
            </h2>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b',
                fontWeight: 600
            }}>
                <TrendingUp size={16} />
                <span>{word.value} mentions</span>
            </div>
        </motion.div>
    );

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Top 3 Section */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '3rem',
                justifyContent: 'center'
            }}>
                {/* 1st Place */}
                <RankCard word={top1} index={0} />

                {/* 2nd & 3rd Place Group */}
                {(top2 || top3) && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        flex: '2 1 500px',
                        position: 'relative',
                        borderRadius: '24px',
                        // We need to ensure the overlay covers this entire area
                    }}>
                        {top2 && <RankCard word={top2} index={1} blur={!isUnlocked} />}
                        {top3 && <RankCard word={top3} index={2} blur={!isUnlocked} />}

                        {/* Paywall Overlay */}
                        {!isUnlocked && (
                            <div style={{
                                position: 'absolute',
                                inset: -10, // Extend slightly to cover gaps if needed, or just 0
                                background: 'rgba(255, 255, 255, 0.1)', // More transparent
                                backdropFilter: 'blur(0px)', // The cards themselves are blurred
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1.5rem',
                                textAlign: 'center',
                                zIndex: 10
                            }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                                    maxWidth: '380px',
                                    width: '100%'
                                }}>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                        <Lock size={24} color="#2563eb" />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                                        Unlock Full Insights
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                        marginBottom: '1rem',
                                        lineHeight: 1.4
                                    }}>
                                        Enter your email to reveal the 2nd and 3rd top trending keywords.
                                    </p>
                                    <form onSubmit={handleUnlock} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.6rem',
                                                borderRadius: '10px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.95rem',
                                                outline: 'none'
                                            }}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                background: '#0f172a',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.6rem',
                                                borderRadius: '10px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            Unlock Insights
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Remaining Chips Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    justifyContent: 'center'
                }}
            >
                {rest.map((w) => (
                    <motion.div
                        key={w.text}
                        variants={item}
                        whileHover={{ scale: 1.05, y: -2 }}
                        style={{
                            background: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'default',
                            fontSize: Math.max(0.8, Math.min(1.2, 0.8 + (w.value / sorted[0].value) * 0.5)) + 'rem'
                        }}
                    >
                        <span style={{ fontWeight: 600, color: '#334155' }}>{w.text}</span>
                        <span style={{
                            background: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            fontSize: '0.75em',
                            color: '#64748b',
                            fontWeight: 500
                        }}>
                            {w.value}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default InsightsGrid;
