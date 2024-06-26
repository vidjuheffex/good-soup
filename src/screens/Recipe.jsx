import { useFetcher, Link, useParams, useNavigate } from "react-router-dom";
import "./Recipe.css";
import Tank from "../components/Tank";
import { secondsToDuration, calculateAdjustedDuration } from "../utils";
import { useState, useRef, useEffect } from "react";
import Content from "../components/Content";
import RenameableTitle from "../components/RenameableTitle";
import Button from "../components/Button";
import { Outlet } from "react-router-dom";

export default function Recipe({ developmentRecipe }) {
  const formRef = useRef();

  // Track the Current Step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = developmentRecipe.steps[currentStepIndex];

  const navigate = useNavigate();

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
      state[step.id] =
        step._chemistry?.mixes[0] && step._chemistry?.mixes[0].id;
      return state;
    }, {}),
  );

  // We 'post' with a form without navigation so we use useFetcher
  const fetcher = useFetcher();

  // Calculate adjusted durations
  //
  // to avoid recalculating on chemistry use change, we capture the adjusted durations
  // when we start the timer and use that for the duration of the step.
  //
  // the useEffect below will recalculate the adjusted durations when the mix changes
  // and update the state.

  const [adjustedDurations, setAdjustedDurations] = useState({});
  const [capturedAdjustedDurations, setCapturedAdjustedDurations] = useState(
    {},
  );

  const audioContextRef = useRef(null);
  const tickIntervalRef = useRef(null);

  const startMetronome = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    const tick = () => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = "square"; // This gives a nice "tick" sound
      gainNode.gain.value = 0.1; // Adjust volume
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1); // Stop after 0.1 seconds to make it a short "tick"
    };

    // Call `tick` function at regular intervals
    tickIntervalRef.current = setInterval(tick, 1000); // Adjust interval for metronome speed
  };

  const stopMetronome = () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isAgitating && isRunning) {
      startMetronome();
    } else {
      stopMetronome();
    }

    return () => stopMetronome(); // Cleanup on component unmount
  }, [isAgitating, isRunning]);

  useEffect(() => {
    const adjustedDurations = developmentRecipe.steps.reduce((acc, step) => {
      const mix = step._chemistry.mixes.find(
        (mix) => mix.id === mixState[step.id],
      );
      if (mix) {
        const exhaustionRate = step._chemistry.exhaustionRate;
        const uses = mix.uses;
        const duration = step.duration;
        acc[step.id] = calculateAdjustedDuration(
          duration,
          exhaustionRate,
          uses,
        );
      }
      return acc;
    }, {});

    setAdjustedDurations(adjustedDurations);
  }, [developmentRecipe.steps, mixState]);

  // Timer functions

  /**
   * Start the timer
   * If the timer is not running, start the timer.
   * If the timer is paused, resume the timer. If there is a pause time, adjust the start time
   * to account for the time paused.
   */
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

  /**
   * Pause the timer
   * Captures the paused time and cancels the requestAnimationFrame
   */
  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
    cancelAnimationFrame(requestRef.current);
    pauseTimeRef.current = Date.now();
  };

  /**
   * Toggle the timer
   *
   * If the timer is running, pause the timer.
   * If the timer is paused, start the timer.
   * If the timer is not started, start the timer and submit the form if a mix is selected.
   */
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
          formData.append("recipe-action", "consume-mix");
          fetcher.submit(formData, { method: "POST" });
        }

        setStartedSteps([...startedSteps, currentStep.id]);
      }
      startTimer();
    }
  };

  /**
   * Update the timer
   * Calculate the new elapsed time and update the progress bar.
   * Base the comparison time on the adjusted duration if a mix is selected.
   */
  const updateTimer = () => {
    const newElapsedTime = Date.now() - startTimeRef.current;
    setElapsedTime(newElapsedTime);
    setProgress({ ...progress, [currentStepIndex]: newElapsedTime / 1000 });
    const comparisonTime =
      currentStep._chemistry.mixes.length > 0
        ? adjustedDurations[currentStep.id]
        : currentStep.duration;

    if (newElapsedTime >= comparisonTime * 1000) {
      setIsRunning(false);
      setIsPaused(false);
      setElapsedTime(0);
      setCurrentStepIndex((prevIndex) =>
        prevIndex + 1 < developmentRecipe.steps.length ? prevIndex + 1 : null,
      );
      startTimeRef.current = null; // Reset for next step
      pauseTimeRef.current = null; // Reset for next step
    } else {
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  /**
   * Handle mix change
   * Update the mix state when the user selects a different mix.
   * This will trigger a recalculation of the adjusted durations.
   *
   * @param {object} event: The event object
   * @param {string} stepId: The ID of the step
   */
  const handleChangeMix = (event, stepId) => {
    setMixState({ ...mixState, [stepId]: event.target.value });
  };

  // Handle agitation cycles
  useEffect(() => {
    if (isRunning) {
      const totalElapsedTimeInStep = elapsedTime / 1000; // Convert ms to seconds

      // If within the initial agitation period
      if (totalElapsedTimeInStep < currentStep.initialAgitation) {
        setIsAgitating(true);
        return;
      }

      // Time elapsed after initial agitation phase, now including an initial rest period
      const timeAfterInitialAgitation =
        totalElapsedTimeInStep - currentStep.initialAgitation;

      // Calculate the full cycle duration
      const fullCycleDuration =
        currentStep.agitationTime +
        currentStep.agitationIntervals -
        currentStep.agitationTime;

      // Adjusted time to account for the initial rest period after the initial agitation
      const timeAfterInitialAgitationAndRest =
        timeAfterInitialAgitation -
        (currentStep.agitationIntervals - currentStep.agitationTime);

      // We only start counting the regular cycles after the initial rest period has passed
      if (timeAfterInitialAgitationAndRest < 0) {
        // This means we're in the initial rest period
        setIsAgitating(false);
      } else {
        // Now in the regular agitation/rest cycles
        const currentCyclePhase =
          timeAfterInitialAgitationAndRest % fullCycleDuration;
        setIsAgitating(currentCyclePhase < currentStep.agitationTime);
      }
    }
  }, [
    elapsedTime,
    currentStepIndex,
    isRunning,
    currentStep?.initialAgitation,
    currentStep?.agitationTime,
    currentStep?.agitationIntervals,
    isAgitating,
  ]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleSkipStep = () => {
    if (currentStepIndex < developmentRecipe.steps.length - 1) {
      // Stop the timer
      if (isRunning) {
        setIsRunning(false);
        cancelAnimationFrame(requestRef.current);
      }

      // Add current step to startedSteps if not already there
      if (!startedSteps.includes(currentStep.id)) {
        setStartedSteps([...startedSteps, currentStep.id]);
      }

      // Advance to the next step
      setCurrentStepIndex(currentStepIndex + 1);
      // Reset elapsedTime for the next step
      setElapsedTime(0);
      // Ensure that the metronome is stopped if it's active
      stopMetronome();
    }
  };

  const status = isRunning
    ? "running"
    : elapsedTime > 0 && elapsedTime < currentStep.duration * 1000
      ? "paused"
      : "not_started";

  return (
    <Content>
      <RenameableTitle
        title={developmentRecipe.name}
        id={developmentRecipe.id}
        renameAction="/rename-development-recipe"
        deleteAction="/delete-development-recipe"
      />
      <fetcher.Form method="post" className="Recipe" ref={formRef}>
        <div className="tankAndControls">
          <Tank
            className={`tank ${
              isAgitating ? "animate-agitation" : ""
            } ${!isRunning ? "paused" : ""}`}
          />
          <div>
            <div className="timerAndControls">
              <h3 className="timer">
                {secondsToDuration(parseInt(elapsedTime / 1000))}
              </h3>
              <div className="controls">
                <Button
                  type="submit"
                  onClick={toggleTimer}
                  disabled={!currentStep}
                >
                  {status === "running"
                    ? "Pause"
                    : status === "paused"
                      ? "Resume"
                      : "Start"}
                </Button>
                <Button
                  type="button"
                  disabled={
                    currentStepIndex >= developmentRecipe.steps.length - 1 ||
                    !currentStep
                  }
                  onClick={handleSkipStep}
                >
                  Skip Step
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="stepsHeader">
          <h2>Steps</h2>{" "}
          <button onClick={() => navigate("edit-steps")}>Edit</button>
        </div>
        {developmentRecipe.steps.map((step, index) => {
          return (
            <div
              key={step.id}
              className={`step ${currentStepIndex === index ? "active" : ""} ${
                startedSteps.includes(step.id) && currentStepIndex !== index
                  ? "done"
                  : ""
              }`}
            >
              <h3>
                {`Step ${index + 1} - ${step._chemistry.name} @ ${
                  step.temp
                }°F for ${secondsToDuration(step.duration)}`}
                {step._chemistry.mixes.length > 0 &&
                  ` (+${secondsToDuration(
                    (isRunning || isPaused) && currentStepIndex === index
                      ? capturedAdjustedDurations[step.id] - step.duration
                      : adjustedDurations[step.id] - step.duration,
                  )})`}
              </h3>
              {step._chemistry.mixes.length > 0 && (
                <div className="mixInfo">
                  <label>
                    <span>Using mix:</span>
                    <select
                      name={currentStepIndex === index ? "mix" : undefined}
                      value={mixState[step.id]}
                      disabled={startedSteps.includes(step.id)}
                      onChange={(ev) => handleChangeMix(ev, step.id)}
                    >
                      {step._chemistry.mixes.map((mix) => (
                        <option key={mix.id} value={mix.id}>
                          {mix.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  Uses:{" "}
                  {`${
                    step._chemistry.mixes.find(
                      (mix) => mix.id === mixState[step.id],
                    )?.uses
                  } uses`}
                </div>
              )}
              <progress
                value={progress[index] || 0}
                max={
                  step._chemistry.mixes.length > 0
                    ? capturedAdjustedDurations[step.id]
                    : step.duration
                }
              />
            </div>
          );
        })}
      </fetcher.Form>
      <Outlet />
    </Content>
  );
}
