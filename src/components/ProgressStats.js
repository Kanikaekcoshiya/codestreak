import React from "react";

function ProgressStats({ completed, scheduled, pending, progressPercent }) {
  return (
    <div>
      <p>
        ✅ Completed: {completed} | ⏳ Scheduled: {scheduled} | 🔲 Pending:{" "}
        {pending}
      </p>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p>{progressPercent}% done</p>
    </div>
  );
}

export default ProgressStats;
