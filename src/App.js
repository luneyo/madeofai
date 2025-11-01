import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import WordCloudLib from "wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

function App() {
  const [term, setTerm] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  // Fetch data from backend
  const fetchData = async () => {
    if (!term) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze?term=${term}`);
      const counts = Array.isArray(response?.data?.data?.counts)
        ? response.data.data.counts
        : [];
      const data = counts
        .filter(item => Array.isArray(item) && item.length === 2)
        .map(([text, value]) => ({ text: String(text), value: Number(value) }));
      setWords(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching data. Make sure backend is running on port 8000.");
    }
    setLoading(false);
  };

  // Generate word cloud on data update
  useEffect(() => {
    if (words.length > 0 && canvasRef.current) {
      const formatted = words.map(w => [w.text, w.value]);
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
  }, [words]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          madeof<span style={styles.accent}>AI</span>
        </h1>
        <p style={styles.subtitle}>
          Reddit in one glance — type any topic and see what people say most.
        </p>

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
              Your word cloud will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #f8fafc, #e2e8f0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  container: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    width: "80%",
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
    transition: "background 0.3s",
  },
  wordCloud: {
    height: 500,
    width: "100%",
    margin: "0 auto",
  },
  placeholder: {
    color: "#94a3b8",
    fontStyle: "italic",
    marginTop: "2rem",
  },
};

export default App;
