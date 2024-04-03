import { useFetcher } from "react-router-dom";
import "./Recipe.css";
import Tank from "../components/Tank";
import { secondsToDuration, calculateAdjustedDuration } from "../utils";
import { useState, useRef, useEffect } from "react";

export default ({ developmentRecipe }) => {
  const formRef = useRef();

  // Track the Current Step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = developmentRecipe.steps[currentStepIndex];

  // Play state - You can actually deduce 3 state from this,
  // isRunning, isPaused, and (isNotStarted)
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer state (requestAnimationFrame based timer)
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(null);
  const requestRef = useRef(null);

  const [progress, setProgress] = useState({});
  const [isAgitating, setIsAgitating] = useState(false);
  const [startedSteps, setStartedSteps] = useState([]);

  // When we pull in the mixes, set the first one found as the default
  const [mixState, setMixState] = useState(() =>
    developmentRecipe.steps.reduce((state, step) => {
      state[step.id] = step.chemistry.mixes[0] && step.chemistry.mixes[0].id;
      return state;
    }, {})
  );

  // We 'post' with a form without navigation so we use useFetcher
  const fetcher = useFetcher();

  // Adding useRef for adjusted durations
  // this object will hold a map of step id to adjusted duration
  // a ref is used since we don't want this updated on every render (when uses change),
  // and instead only on mount and when the mixState changes;
  const [adjustedDurations, setAdjustedDurations] = useState({});
  const [capturedAdjustedDurations, setCapturedAdjustedDurations] = useState(
    {}
  );

  useEffect(() => {
    // Calculate adjusted durations on mount and when mixState changes
    const adjustedDurations = developmentRecipe.steps.reduce((acc, step) => {
      const mix = step.chemistry.mixes.find(
        (mix) => mix.id === mixState[step.id]
      );
      if (mix) {
        const exhaustionRate = step.chemistry.exhaustionRate;
        const uses = mix.uses;
        const duration = step.duration;
        acc[step.id] = calculateAdjustedDuration(
          duration,
          exhaustionRate,
          uses
        );
      }
      return acc;
    }, {});

    setAdjustedDurations(adjustedDurations);
  }, [developmentRecipe.steps, mixState]);

  // Timer functions
  const startTimer = () => {
    if (!isRunning) {
      setCapturedAdjustedDurations(adjustedDurations);
      setIsRunning(true);
      setIsPaused(false);
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
    setIsPaused(true);
    cancelAnimationFrame(requestRef.current);
    pauseTimeRef.current = Date.now();
  };

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      if (!isPaused) {
        const form = formRef.current;
        const formData = new FormData(form);
        if (formData.get("mix")) {
          // If there is a mix selected, submit the form
          // after appending the action to the form data

          formData.append("action", "consume-mix");
          fetcher.submit(formData, { method: "POST" });
        }

        setStartedSteps([...startedSteps, currentStep.id]);
      }
      startTimer();
    }
  };

  const updateTimer = () => {
    const newElapsedTime = Date.now() - startTimeRef.current;
    setElapsedTime(newElapsedTime);
    setProgress({ ...progress, [currentStepIndex]: newElapsedTime / 1000 });
    const comparisonTime =
      currentStep.chemistry.mixes.length > 0
        ? adjustedDurations[currentStep.id]
        : currentStep.duration;

    if (newElapsedTime >= capturedAdjustedDurations[currentStep.id] * 1000) {
      setIsRunning(false);
      setIsPaused(false);
      setElapsedTime(0);
      setCurrentStepIndex((prevIndex) =>
        prevIndex + 1 < developmentRecipe.steps.length ? prevIndex + 1 : null
      );
      startTimeRef.current = null; // Reset for next step
      pauseTimeRef.current = null; // Reset for next step
    } else {
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  // Mix selection and duration updates
  const handleChangeMix = (event, stepId) => {
    setMixState({ ...mixState, [stepId]: event.target.value });
  };

  useEffect(() => {
    if (isRunning) {
      if (currentStep?.initialAgitation) {
        const initialAgitationDuration = parseInt(currentStep.initialAgitation);

        if (
          initialAgitationDuration > 0 &&
          elapsedTime < initialAgitationDuration * 1000
        ) {
          setIsAgitating(true);
        } else {
          setIsAgitating(false);
        }
      }
    }
  }, [
    elapsedTime,
    currentStepIndex,
    isRunning,
    currentStep?.initialAgitation,
    isAgitating,
  ]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const status = isRunning
    ? "running"
    : elapsedTime > 0 && elapsedTime < currentStep.duration * 1000
    ? "paused"
    : "not_started";

  return (
    <fetcher.Form method="post" className="Recipe" ref={formRef}>
      <h1>{developmentRecipe.name}</h1>
      <div className="center">
        <Tank
          className={`${isAgitating ? "animate-agitation" : ""} ${
            isPaused ? "paused" : ""
          }`}
        />
      </div>
      <div>{secondsToDuration(parseInt(elapsedTime / 1000))}</div>
      <div>
        <button type="button" onClick={toggleTimer}>
          {status === "running"
            ? "Pause"
            : status === "paused"
            ? "Resume"
            : "Start Step"}
        </button>
        <button type="button">Skip to Next Step</button>
        <button type="button">Restart Current Step</button>
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
            {step.chemistry.mixes.length > 0 &&
              `(+${secondsToDuration(
                (isRunning || isPaused) && currentStepIndex === index
                  ? capturedAdjustedDurations[step.id] - step.duration
                  : adjustedDurations[step.id] - step.duration
              )})`}
          </h3>
          {step.chemistry.mixes.length > 0 && (
            <div>
              Using mix:
              <select
                name={currentStepIndex === index ? "mix" : undefined}
                value={mixState[step.id]}
                disabled={
                  step.chemistry.mixes.length === 0 ||
                  startedSteps.includes(step.id)
                }
                onChange={(ev) => handleChangeMix(ev, step.id)}
              >
                {step.chemistry.mixes.length === 0 && (
                  <option value="">No mixes available</option>
                )}
                {step.chemistry.mixes &&
                  step.chemistry.mixes.map((mix) => (
                    <option key={mix.id} value={mix.id}>
                      {mix.name}
                    </option>
                  ))}
              </select>
              Uses:{" "}
              {`${
                step.chemistry.mixes.find((mix) => mix.id === mixState[step.id])
                  ?.uses
              } uses`}
            </div>
          )}
          <progress
            value={progress[index] || 0}
            max={
              currentStep.chemistry.mixes.length > 0
                ? capturedAdjustedDurations[step.id]
                : step.duration
            }
          />
        </div>
      ))}
    </fetcher.Form>
  );
};
