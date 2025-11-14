import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import WordCloudLib from "wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

function App() {
  const [term, setTerm] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("wordcloud"); // NEW
  const canvasRef = useRef(null);

  // ---- Fetch Data ----
  const fetchData = async () => {
    if (!term) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://madeofai-backend.onrender.com/analyze?term=${term}`
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
      alert("Error fetching data from backend.");
    }
    setLoading(false);
  };

  // ---- Generate Wordcloud ----
  useEffect(() => {
    if (viewMode === "wordcloud" || viewMode === "both") {
      if (words.length > 0 && canvasRef.current) {
        const formatted = words.map((w) => [w.text, w.value]);
        WordCloudLib(canvasRef.current, {
          list: formatted,
          gridSize: 8,
          weightFactor: 4,
          fontFamily: "Inter, sans-serif",
          color: () => `hsl(${Math.random() * 360}, 40%, 30%)`,
          rotateRatio: 0.2,
          backgroundColor: "transparent",
        });
      }
    }
  }, [words, viewMode]);

  // ---- Bucket Logic (for list view) ----
  const bucketWords = () => {
    const sorted = [...words].map((w) => w.text);
    return {
      veryCommon: sorted.slice(0, 10),
      common: sorted.slice(10, 20),
      occasional: sorted.slice(20, 35),
      rare: sorted.slice(35, 60),
    };
  };

  const buckets = bucketWords();

  // ---- UI ----
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          madeof<span style={styles.accent}>AI</span>
        </h1>
        <p style={styles.subtitle}>
          Reddit in one glance — type any topic and see what people say most.
        </p>

        {/* ---- Input Row ---- */}
        <div style={styles.inputRow}>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Try: elon musk, ai, tesla, gaming..."
            style={styles.input}
          />
          <button onClick={fetchData} disabled={loading} style={styles.button}>
            {loading ? "Analyzing..." : "Generate"}
          </button>
        </div>

        {/* ---- View Mode Selector ---- */}
        <div style={{ marginBottom: "1.5rem" }}>
          <select
            style={styles.dropdown}
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="wordcloud">Wordcloud</option>
            <option value="list">List View</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* ---- DISPLAY AREA ---- */}

        {/* WORDCLOUD MODE */}
        {(viewMode === "wordcloud" || viewMode === "both") && (
          <div style={styles.wordCloud}>
            {Array.isArray(words) && words.length > 0 ? (
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            ) : (
              <p style={styles.placeholder}>
                Your results will appear here.
              </p>
            )}
          </div>
        )}

        {/* LIST MODE */}
        {(viewMode === "list" || viewMode === "both") && (
          <div style={styles.listContainer}>
            <WordList title="Very Common" items={buckets.veryCommon} />
            <WordList title="Common" items={buckets.common} />
            <WordList title="Occasional" items={buckets.occasional} />
            <WordList title="Rare Mentions" items={buckets.rare} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------- LIST COMPONENT ------- */
function WordList({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={styles.listBlock}>
      <h3 style={styles.listTitle}>{title}</h3>
      <ul style={styles.list}>
        {items.map((w, i) => (
          <li key={i} style={styles.listItem}>
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------- STYLES ------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    padding: "2rem",
  },
  container: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    width: "90%",
    maxWidth: "900px",
    padding: "3rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "0.5rem",
  },
  accent: {
    color: "#2563eb",
  },
  subtitle: {
    color: "#475569",
    marginBottom: "2rem",
  },
  inputRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    width: "300px",
    outline: "none",
    fontSize: "1rem",
  },
  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "0.75rem 1.5rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  dropdown: {
    padding: "0.6rem 1rem",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
  },
  wordCloud: {
    height: 500,
    width: "100%",
    marginBottom: "2rem",
  },
  placeholder: {
    color: "#94a3b8",
    fontStyle: "italic",
  },
  listContainer: {
    marginTop: "2rem",
    textAlign: "left",
  },
  listBlock: {
    marginBottom: "1.5rem",
  },
  listTitle: {
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
  listItem: {
    padding: "3px 0",
    color: "#334155",
  },
};

export default App;
