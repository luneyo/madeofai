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

    const top3 = sorted.slice(0, 3);
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

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Top 3 Hero Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {top3.map((w, i) => {
                    const isLocked = !isUnlocked && (i === 1 || i === 2);

                    return (
                        <motion.div
                            key={w.text}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                background: getRankColor(i),
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
                                minHeight: '200px'
                            }}
                        >
                            {/* Content (Blurred if locked) */}
                            <div style={{
                                filter: isLocked ? 'blur(10px)' : 'none',
                                transition: 'filter 0.3s',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(255,255,255,0.5)',
                                    padding: '0.5rem',
                                    borderRadius: '50%'
                                }}>
                                    {getRankIcon(i)}
                                </div>

                                <h2 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    color: '#1e293b',
                                    margin: '0 0 0.5rem 0',
                                    textAlign: 'center',
                                    lineHeight: 1.1
                                }}>
                                    {w.text}
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#64748b',
                                    fontWeight: 600
                                }}>
                                    <TrendingUp size={16} />
                                    <span>{w.value} mentions</span>
                                </div>
                            </div>

                            {/* Paywall Overlay */}
                            {isLocked && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(0px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    zIndex: 10
                                }}>
                                    {/* Mentions Teaser Badge */}
                                    <div style={{
                                        background: 'rgba(255,255,255,0.95)',
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: '#0f172a',
                                        marginBottom: '1rem'
                                    }}>
                                        <TrendingUp size={14} color="#2563eb" />
                                        <span>{w.value}</span>
                                    </div>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        marginBottom: '1rem'
                                    }}>
                                        Subscribe to our tech newsletter to unlock all sections
                                    </p>
                                    <form onSubmit={handleUnlock} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input
                                            type="email"
                                            placeholder="Enter email..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.9rem'
                                            }}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                background: '#0f172a',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Unlock
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
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
