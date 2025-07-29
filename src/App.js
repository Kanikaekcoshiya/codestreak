import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import DaysGrid from "./components/DaysGrid";
import TaskDetails from "./components/TaskDetails";
import ProgressStats from "./components/ProgressStats";
import TaskHistory from "./components/TaskHistory";
import Welcome from "./components/Welcome";

import { dsaGraph, practiceLinks } from "./utils/dsaUtils";

import successSound from "./sounds/success.mp3";
import failSound from "./sounds/timer-end.mp3";

import "./App.css";

function App() {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [goal, setGoal] = useState(localStorage.getItem("goal") || "");
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem("days");
    return saved ? JSON.parse(saved) : Array(21).fill(null);
  });
  const [activeDay, setActiveDay] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [taskManuallyCompleted, setTaskManuallyCompleted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (activeDay !== null && timeLeft > 0 && !days[activeDay]?.paused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && activeDay !== null) {
      if (!taskManuallyCompleted) {
        // Show Timer End popup only if task not manually completed
        new Audio(failSound).play();
        Swal.fire("⏰ Time's up!", "You didn't finish your task in time!", "error");
      }
      setTaskManuallyCompleted(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft, activeDay, days, taskManuallyCompleted]);

  // Add Task
  const addTask = (index) => {
    Swal.fire({
      title: "Enter Task Name",
      input: "text",
      inputPlaceholder: "e.g. Arrays, DP",
      showCancelButton: true,
    }).then((taskResult) => {
      if (taskResult.isConfirmed && taskResult.value) {
        Swal.fire({
          title: "Set Timer",
          html:
            `<input id="hours" type="number" min="0" placeholder="Hours" class="swal2-input" style="width: 100px;">` +
            `<input id="minutes" type="number" min="0" max="59" placeholder="Minutes" class="swal2-input" style="width: 100px;">`,
          preConfirm: () => {
            const hours = parseInt(document.getElementById("hours").value) || 0;
            const minutes = parseInt(document.getElementById("minutes").value) || 0;
            return hours * 60 + minutes;
          },
        }).then((timeResult) => {
          if (timeResult.isConfirmed && timeResult.value > 0) {
            const updatedDays = [...days];
            updatedDays[index] = {
              task: taskResult.value,
              date: new Date().toLocaleDateString(),
              timer: timeResult.value,
              status: "scheduled",
              paused: false,
            };
            setDays(updatedDays);
            setActiveDay(index);
            setTimeLeft(timeResult.value * 60);
            localStorage.setItem("days", JSON.stringify(updatedDays));
          }
        });
      }
    });
  };

  // Complete Task with recommendation system and remove the box
  const completeTask = (index) => {
  const updatedDays = [...days];

  // ✅ Mark as completed and store in localStorage
  updatedDays[index] = {
    ...updatedDays[index],
    status: "completed",
  };
  setDays(updatedDays);
  localStorage.setItem("days", JSON.stringify(updatedDays));

  // ✅ Stop the timer when completed
  setTimeLeft(0);

  // ✅ Close the TaskDetails box
  setActiveDay(null);

  // ✅ Success sound + popup
  new Audio(successSound).play();
  Swal.fire({
    icon: "success",
    title: "🎉 Great job!",
    text: `You completed "${updatedDays[index].task}"!`,
    confirmButtonText: "Yay!",
  }).then(() => {
    // Recommendation logic
    const currentTopic = updatedDays[index].task.toLowerCase();
    const nextTopics = dsaGraph[currentTopic];

    if (nextTopics && nextTopics.length > 0) {
      const recommendedTopic =
        nextTopics[Math.floor(Math.random() * nextTopics.length)];

      Swal.fire({
        title: `Your next recommended topic is: ${recommendedTopic}`,
        html: `
          <p>Your next recommended topic is <b>${recommendedTopic}</b></p>
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
            <button id="easy-btn" class="swal2-confirm swal2-styled">Easy</button>
            <button id="medium-btn" class="swal2-confirm swal2-styled">Medium</button>
            <button id="hard-btn" class="swal2-confirm swal2-styled">Hard</button>
          </div>
          <br/>
          <button id="close-btn" class="swal2-cancel swal2-styled">Close</button>
        `,
        showConfirmButton: false,
        didOpen: () => {
          document.getElementById("easy-btn").addEventListener("click", () => {
            window.open(practiceLinks[recommendedTopic]?.easy, "_blank");
          });
          document.getElementById("medium-btn").addEventListener("click", () => {
            window.open(practiceLinks[recommendedTopic]?.medium, "_blank");
          });
          document.getElementById("hard-btn").addEventListener("click", () => {
            window.open(practiceLinks[recommendedTopic]?.hard, "_blank");
          });
          document.getElementById("close-btn").addEventListener("click", () => {
            Swal.close();
          });
        },
      });
    }
  });
};

  // Pause Task
  const pauseTask = (index) => {
    if (index === activeDay) {
      if (days[index].paused) {
        setTimeLeft(days[index].timeLeft); // Resume
      } else {
        // Pause: Save current timeLeft
        const updatedDays = [...days];
        updatedDays[index].timeLeft = timeLeft;
        setDays(updatedDays);
      }
    }
    const updatedDays = [...days];
    updatedDays[index].paused = !updatedDays[index].paused;
    setDays(updatedDays);
    localStorage.setItem("days", JSON.stringify(updatedDays));
  };

  // Restart Challenge
  const restartChallenge = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will clear all progress!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Restart!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setName("");
        setGoal("");
        setDays(Array(21).fill(null));
        setActiveDay(null);
        Swal.fire("Restarted!", "Your challenge has been reset.", "success");
      }
    });
  };

  // Extend Challenge
  const extendChallenge = () => {
    Swal.fire({
      title: "Enter number of days for new challenge",
      input: "number",
      inputPlaceholder: "e.g. 30",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed && result.value > 0) {
        const newDaysCount = parseInt(result.value);
        const extraDays = Array(newDaysCount - days.length).fill(null);
        const updatedDays = [...days, ...extraDays];
        setDays(updatedDays);
        localStorage.setItem("days", JSON.stringify(updatedDays));

        Swal.fire(
          "⏩ Challenge Extended!",
          `Now your challenge is for ${newDaysCount} days.`,
          "success"
        );
      }
    });
  };

  const completed = days.filter((d) => d?.status === "completed").length;
  const scheduled = days.filter((d) => d?.status === "scheduled").length;
  const pending = days.length - completed - scheduled;
  const progressPercent = Math.round((completed / days.length) * 100);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <Welcome setName={setName} setGoal={setGoal} />
            </motion.div>
          }
        />

        <Route
          path="/challenge"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="app-wrapper">
                <Header
                  navigate={navigate}
                  restartChallenge={restartChallenge}
                  extendChallenge={extendChallenge}
                />
                <h2>👋 Hello {name}, Your Goal: {goal}</h2>
                
                {/* Color coding legend */}
                <div className="legend">
                  <span className="legend-item"><span className="legend-box completed"></span> Completed</span>
                  <span className="legend-item"><span className="legend-box scheduled"></span> Scheduled</span>
                  <span className="legend-item"><span className="legend-box upcoming"></span> Upcoming</span>
                </div>

                <ProgressStats
                  completed={completed}
                  scheduled={scheduled}
                  pending={pending}
                  progressPercent={progressPercent}
                />
                <div className="grid-task-container">
                  <DaysGrid days={days} setActiveDay={setActiveDay} addTask={addTask} />
                  {activeDay !== null && (
                    <TaskDetails
                      day={days[activeDay]}
                      index={activeDay}
                      addTask={addTask}
                      completeTask={completeTask}
                      pauseTask={pauseTask}
                      timeLeft={timeLeft}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          }
        />

        <Route
          path="/history"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <TaskHistory days={days} />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
