import React from "react";

function TaskDetails({ day, index, addTask, completeTask, pauseTask, timeLeft }) {
  if (!day) return null;

  return (
    <div className="task-details">
      <h3>Day {index + 1}: {day.task}</h3>
      <p>Date: {day.date}</p>
      <p>Status: {day.status}</p>

      {/* Timer Display */}
      <div className="timer-display" style={{ marginBottom: "10px" }}>
        {day.paused ? (
          <span style={{ color: "orange", fontWeight: "bold" }}>⏸ Paused</span>
        ) : (
          <span>
            ⏱ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          className="rec-btn"
          onClick={() => pauseTask(index)}
          style={{ background: "#ffcc00", color: "#000" }}
        >
          {day.paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button
          className="rec-btn"
          style={{ background: "#00cc66", color: "#fff" }}
          onClick={() => completeTask(index)}
        >
          ✅ Completed
        </button>

        <button
          className="rec-btn"
          style={{ background: "#d9534f", color: "#fff" }}
          onClick={() => addTask(index)}
        >
          🔄 Change Task
        </button>
      </div>
    </div>
  );
}

export default TaskDetails;
