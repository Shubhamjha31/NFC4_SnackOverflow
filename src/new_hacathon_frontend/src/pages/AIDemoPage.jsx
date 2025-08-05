import React, { useState } from "react";
import { runFraudSimulation } from "../AgenticAI/fraudDetectionAI";

export default function AIDemoPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  async function handleRunSimulation() {
    setLoading(true);
    setError(null);
    try {
      const res = await runFraudSimulation();
      setResults(res);
      // Initialize details visibility
      const detailsState = {};
      res.forEach((_, idx) => {
        detailsState[idx] = false;
      });
      setShowDetails(detailsState);
    } catch (err) {
      setError("Failed to run simulation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const toggleDetails = (index) => {
    setShowDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h1 style={{ 
        color: "#2c3e50",
        marginBottom: "1.5rem",
        borderBottom: "2px solid #3498db",
        paddingBottom: "0.5rem"
      }}>
        Fraud Detection AI Demo
      </h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={handleRunSimulation}
          disabled={loading}
          style={{
            padding: "0.8rem 1.8rem",
            background: loading ? "#6c757d" : "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          {loading ? (
            <>
              <span style={{ marginRight: "8px" }}>🔍</span>
              Analyzing...
            </>
          ) : (
            <>
              <span style={{ marginRight: "8px" }}>⚡</span>
              Run Simulation
            </>
          )}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "1rem",
          background: "#ffebee",
          color: "#d32f2f",
          borderRadius: "4px",
          marginBottom: "1rem",
          borderLeft: "4px solid #d32f2f"
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {results.map((uni, idx) => (
          <div
            key={idx}
            style={{
              padding: "1.5rem",
              borderRadius: "10px",
              background: uni.verdict === "fraud" ? "#ffebee" : 
                         uni.verdict === "error" ? "#fff8e1" : "#e8f5e9",
              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
              borderLeft: `5px solid ${
                uni.verdict === "fraud" ? "#f44336" : 
                uni.verdict === "error" ? "#ffa000" : "#4caf50"
              }`,
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ 
                  margin: "0 0 0.5rem 0",
                  color: "#2c3e50"
                }}>
                  {uni.name}
                </h2>
                <p style={{ 
                  margin: "0",
                  color: "#555",
                  fontSize: "0.95rem"
                }}>
                  <strong>{uni.credentialsPushed}</strong> credentials/hour
                  {uni.percentageAbove > 0 && (
                    <span style={{ marginLeft: "8px", color: "#f44336" }}>
                      ({uni.percentageAbove}% above threshold)
                    </span>
                  )}
                </p>
              </div>
              <h3
                style={{
                  color: uni.verdict === "fraud" ? "#f44336" : 
                        uni.verdict === "error" ? "#ffa000" : "#4caf50",
                  margin: "0",
                  fontSize: "1.2rem",
                  fontWeight: "600"
                }}
              >
                {uni.verdict.toUpperCase()}
                {uni.confidence > 0 && uni.verdict !== "error" && (
                  <span style={{
                    fontSize: "0.8rem",
                    display: "block",
                    textAlign: "right",
                    color: "#666"
                  }}>
                    {uni.confidence}% confidence
                  </span>
                )}
              </h3>
            </div>

            <p style={{ 
              margin: "1rem 0 0 0",
              color: "#333",
              lineHeight: "1.5"
            }}>
              {uni.reason}
            </p>

            {showDetails[idx] && (
              <div style={{ 
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(0,0,0,0.03)",
                borderRadius: "6px",
                border: "1px solid rgba(0,0,0,0.1)"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Detailed Analysis</h4>
                <p style={{ margin: "0" }}>
                  {uni.verdict === "error" ? (
                    "Failed to complete analysis due to system error."
                  ) : (
                    <>
                      The system detected {uni.credentialsPushed} credentials issued within an hour, which is 
                      {uni.credentialsPushed > 100 ? " significantly above" : " within"} the normal threshold 
                      of 100 credentials/hour. {uni.verdict === "fraud" ? 
                      "This pattern suggests potential credential stuffing or automated issuance." : 
                      "This activity appears to be normal operational behavior."}
                    </>
                  )}
                </p>
              </div>
            )}

            <button
              onClick={() => toggleDetails(idx)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                background: "transparent",
                color: "#3498db",
                border: "1px solid #3498db",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.2s ease"
              }}
            >
              {showDetails[idx] ? "Hide Details" : "Show Details"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}