import React, { useState } from "react";
import axios from "axios";
import InteractiveWordCloud from "./InteractiveWordCloud";
import InsightsGrid from "./InsightsGrid";
import { Search, BarChart2, LayoutGrid, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MainApp() {
    const [term, setTerm] = useState("");
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("list");
    const [hasSearched, setHasSearched] = useState(false);

    // ---- Mock Data for Local Dev ----
    const MOCK_DATA = [
        { text: "AI", value: 45 },
        { text: "Future", value: 38 },
        { text: "Technology", value: 32 },
        { text: "Innovation", value: 28 },
        { text: "Data", value: 25 },
        { text: "Machine Learning", value: 22 },
        { text: "Python", value: 20 },
        { text: "React", value: 18 },
        { text: "Coding", value: 15 },
        { text: "Web", value: 12 },
        { text: "Design", value: 10 },
        { text: "Startup", value: 8 },
    ];

    // ---- Fetch Data ----
    const fetchData = async (e) => {
        if (e) e.preventDefault();
        if (!term) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const apiUrl = process.env.REACT_APP_API_URL || "https://madeofai-backend.onrender.com";
            const response = await axios.get(
                `${apiUrl}/analyze?term=${term}`
            );

            const counts = Array.isArray(response?.data?.data?.counts)
                ? response.data.data.counts
                : [];

            const formatted = counts
                .filter((item) => Array.isArray(item) && item.length === 2)
                .map(([text, value]) => ({
                    text: String(text),
                    value: Number(value),
                }));

            setWords(formatted);
        } catch (err) {
            console.error("Fetch error:", err);

            // Fallback to mock data if in development
            if (process.env.NODE_ENV === 'development') {
                console.log("Using MOCK DATA for local development");
                setWords(MOCK_DATA);
            } else {
                alert("Error fetching data from backend.");
            }
        }
        setLoading(false);
    };

    return (
        <div style={styles.page}>
            {/* Background Elements */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={styles.container}
            >
                {/* Header */}
                <div style={{ marginBottom: "3rem" }}>
                    <h1 style={styles.title}>
                        Reddit<span style={styles.accent}>Reader</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Discover what the internet is talking about. Enter a topic to generate insights.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={fetchData} style={styles.searchForm}>
                    <div style={styles.inputWrapper}>
                        <Search size={20} color="#94a3b8" style={{ marginLeft: "1rem" }} />
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Try: elon musk, ai, crypto..."
                            style={styles.input}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sparkles size={18} className="spin" /> Analyzing...
                            </span>
                        ) : (
                            "Generate Insights"
                        )}
                    </motion.button>
                </form>

                {/* View Toggle */}
                {hasSearched && words.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.toggleContainer}
                    >
                        <button
                            style={{ ...styles.toggleBtn, ...(viewMode === "wordcloud" ? styles.activeToggle : {}) }}
                            onClick={() => setViewMode("wordcloud")}
                        >
                            <LayoutGrid size={18} /> Word Cloud
                        </button>
                        <button
                            style={{ ...styles.toggleBtn, ...(viewMode === "list" ? styles.activeToggle : {}) }}
                            onClick={() => setViewMode("list")}
                        >
                            <BarChart2 size={18} /> Ranked Insights
                        </button>
                    </motion.div>
                )}

                {/* Content Area */}
                <div style={styles.contentArea}>
                    <AnimatePresence mode="wait">
                        {!hasSearched ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={styles.placeholder}
                            >
                                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
                                <p>Enter a topic above to start analyzing Reddit trends.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={viewMode}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                {viewMode === "wordcloud" ? (
                                    <div style={styles.card}>
                                        <InteractiveWordCloud words={words} />
                                    </div>
                                ) : (
                                    <InsightsGrid words={words} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

/* ------- STYLES ------- */

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        padding: "4rem 2rem",
        position: "relative",
        overflowX: "hidden",
    },
    blob1: {
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        zIndex: 0,
        pointerEvents: "none",
    },
    blob2: {
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 70%)",
        borderRadius: "50%",
        zIndex: 0,
        pointerEvents: "none",
    },
    container: {
        width: "100%",
        maxWidth: "1200px",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        fontSize: "4rem",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "1rem",
        textAlign: "center",
        letterSpacing: "-0.02em",
        lineHeight: 1,
    },
    accent: {
        background: "linear-gradient(135deg, #2563eb 0%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        color: "#64748b",
        fontSize: "1.25rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        lineHeight: 1.6,
    },
    searchForm: {
        display: "flex",
        gap: "1rem",
        width: "100%",
        maxWidth: "600px",
        marginBottom: "3rem",
    },
    inputWrapper: {
        flex: 1,
        background: "white",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
        transition: "box-shadow 0.2s",
    },
    input: {
        flex: 1,
        padding: "1rem",
        border: "none",
        background: "transparent",
        outline: "none",
        fontSize: "1.1rem",
        color: "#334155",
        borderRadius: "16px",
    },
    button: {
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        color: "white",
        border: "none",
        borderRadius: "16px",
        padding: "0 2rem",
        fontWeight: "600",
        fontSize: "1.1rem",
        cursor: "pointer",
        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
        whiteSpace: "nowrap",
    },
    toggleContainer: {
        display: "flex",
        background: "white",
        padding: "0.5rem",
        borderRadius: "12px",
        gap: "0.5rem",
        marginBottom: "2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
    },
    toggleBtn: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        background: "transparent",
        color: "#64748b",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    activeToggle: {
        background: "#eff6ff",
        color: "#2563eb",
    },
    contentArea: {
        width: "100%",
        minHeight: "500px",
        display: "flex",
        justifyContent: "center",
    },
    card: {
        background: "white",
        borderRadius: "24px",
        padding: "2rem",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        border: "1px solid #f1f5f9",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
    },
    placeholder: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: "1.2rem",
        height: "100%",
        paddingTop: "5rem",
    },
};

export default MainApp;
