import React, { useState } from "react";
import "../App.css";

function TaskHistory({ days }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = days.filter(
    (day) =>
      day &&
      day.task &&
      day.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <input
        type="text"
        placeholder="Search by task name..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

     <div className="history-boxes">
  {filteredTasks.length === 0 ? (
    <p>No tasks found.</p>
  ) : (
    filteredTasks.map((task, index) => (
      <div className="history-box" key={index}>
        <h4>{task.task}</h4>
        <p>Date: {task.date}</p>
        <p>Status: {task.status}</p>
      </div>
    ))
  )}
</div>

    </div>
  );
}

export default TaskHistory;
