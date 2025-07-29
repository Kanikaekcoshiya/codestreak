import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome({ setName, setGoal }) {
  const [tempName, setTempName] = useState("");
  const [tempGoal, setTempGoal] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (tempName && tempGoal) {
      setName(tempName);
      setGoal(tempGoal);
      localStorage.setItem("name", tempName);
      localStorage.setItem("goal", tempGoal);
      navigate("/challenge");
    } else {
      alert("Please enter both Name and Goal!");
    }
  };

  return (
    <div className="welcome-box">
      <h2>Welcome to CodeStreak</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter your goal"
        value={tempGoal}
        onChange={(e) => setTempGoal(e.target.value)}
      />
      <br />
      <button className="rec-btn" onClick={handleSubmit}>
        🚀 Start Challenge
      </button>
    </div>
  );
}

export default Welcome;
