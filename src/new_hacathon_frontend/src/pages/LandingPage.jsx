import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ For navigation
import "../styles/landingPage.scss"; 
import tokens from '../utils/tokens.json'; // ✅ Import JSON

const LandingPage = () => {
  const [walletId, setWalletId] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletId.trim() === '') {
      setFilteredTokens([]);
      return;
    }
    const filtered = tokens.filter(token =>
      token.id.toLowerCase().includes(walletId.toLowerCase()) ||
      token.name.toLowerCase().includes(walletId.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [walletId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (walletId.trim()) {
      navigate(`/verify/${walletId}`);
    }
  };

  const handleSelectToken = (id) => {
    navigate(`/verify/${id}`);
  };

  return (
    <div className="landing-container">
      <div className="blockchain-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="blockchain-node" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`
          }}></div>
        ))}
      </div>

      <header className="landing-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">VeriFide</span>
        </div>
        <nav className="nav-links">
          <a href="/student">Student</a>
          <a href="/university">University</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="landing-main">
        <div className="hero-section">
          <h1 className="hero-title">
            <span>Decentralized</span> Academic Credentials
          </h1>
          <p className="hero-subtitle">
            Verify and manage blockchain-secured educational records with complete transparency
          </p>

          <form onSubmit={handleSearch} className={`search-container ${isFocused ? 'focused' : ''}`}>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Enter Wallet ID to verify credentials..."
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button type="submit" className="search-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {filteredTokens.length > 0 && (
              <ul className="search-suggestions">
                {filteredTokens.map(token => (
                  <li key={token.id} onClick={() => handleSelectToken(token.id)}>
                    <strong>{token.name}</strong> – {token.id}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Immutable Records</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Verification</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0%</div>
              <div className="stat-label">Fraud</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Powered by blockchain technology • Secure • Transparent • Trustworthy</p>
      </footer>
    </div>
  );
};

export default LandingPage;
