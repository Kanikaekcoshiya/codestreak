import React from "react";

function DaysGrid({ days, setActiveDay, addTask }) {
  return (
    <div className="days-grid">
      {days.map((day, index) => (
        <div
          key={index}
          className={`day-box ${
            day?.status === "completed"
              ? "completed"
              : day?.status === "scheduled"
              ? "scheduled"
              : ""
          }`}
          onClick={() => (day ? setActiveDay(index) : addTask(index))}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

export default DaysGrid;
