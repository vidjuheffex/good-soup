import { useLoaderData } from "react-router-dom";
import "./Recipe.css";
import Tank from "../components/Tank";
import { secondsToDuration } from "../utils";
import { useState, useRef, useEffect } from "react";

export default ({ developmentRecipe }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);
  const requestRef = useRef(null);
  const tankRef = useRef(null);
  const [progress, setProgress] = useState({});

  const currentStep = developmentRecipe.steps[currentStepIndex];

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - elapsedTime;
      } else if (pauseTimeRef.current) {
        const pauseDuration = Date.now() - pauseTimeRef.current;
        startTimeRef.current += pauseDuration;
      }
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    cancelAnimationFrame(requestRef.current);
    pauseTimeRef.current = Date.now();
  };

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleTimerToggle = useEffect(() => {
    if (isRunning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - elapsedTime;
      }
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]);

  const updateTimer = () => {
    const newElapsedTime = Date.now() - startTimeRef.current;
    setElapsedTime(newElapsedTime);
    setProgress({ ...progress, [currentStepIndex]: newElapsedTime / 1000 });

    if (newElapsedTime >= currentStep.duration * 1000) {
      setIsRunning(false);
      setElapsedTime(0);
      setCurrentStepIndex((prevIndex) =>
        prevIndex + 1 < developmentRecipe.steps.length ? prevIndex + 1 : null
      );
      startTimeRef.current = null; // Reset for next step
    } else {
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (isRunning && currentStep?.initialAgitation) {
      const initialAgitationDuration = parseInt(currentStep.initialAgitation);
      if (initialAgitationDuration > 0) {
        tankRef.current.classList.add("animate-agitation");
        setTimeout(
          () => tankRef.current.classList.remove("animate-agitation"),
          initialAgitationDuration * 1000
        );
      }
    }
  }, [currentStepIndex, isRunning, currentStep?.initialAgitation]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="Recipe">
      <h1>{developmentRecipe.name}</h1>
      <div className="center">
        <Tank ref={tankRef} />
      </div>
      <div>{secondsToDuration(parseInt(elapsedTime / 1000))}</div>
      <div>
        <button onClick={toggleTimer}>
          {isRunning
            ? "Pause"
            : elapsedTime > 0 && elapsedTime < currentStep.duration * 1000
            ? "Resume"
            : "Start Step"}
        </button>
        <button>Skip to Next Step</button>
        <button>Restart Current Step</button>
      </div>

      <h2>Steps</h2>
      {developmentRecipe.steps.map((step, index) => (
        <div
          key={step.id}
          className={`step ${currentStepIndex === index ? "active" : ""}`}
        >
          <h3>
            {`Step ${index + 1} - ${step.chemistry.name} @ ${
              step.temp
            }°F for ${secondsToDuration(step.duration)}`}
          </h3>
          <progress value={progress[index] || 0} max={step.duration} />
        </div>
      ))}
    </div>
  );
};
