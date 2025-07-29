import React from "react";

function Header({ navigate, restartChallenge, extendChallenge }) {
  return (
    <div className="header">
      <h1>CodeStreak - Start Your Challenge</h1>
      <div>
        <button className="rec-btn" onClick={() => navigate("/")}>🏠 Home</button>
        <button className="rec-btn" onClick={() => navigate("/history")}>📜 History</button>
        <button className="rec-btn" onClick={restartChallenge}>🔄 Restart</button>
        <button className="rec-btn" onClick={extendChallenge}>➕ Extend</button>
      </div>
    </div>
  );
}

export default Header;
