export const computeWpm = (correctCount, seconds) => {
  if (!seconds) return 0;
  return Math.round((correctCount / 5 / seconds) * 60);
};

export const correctChars = (typed, source) =>
  typed.split("").filter((char, index) => char === source[index]).length;

export const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

export const randomPassage = (difficulty, passages, currentId) => {
  const list = passages[difficulty];
  if (!list?.length) return "";
  if (list.length === 1) return list[0];
  let picked = list[Math.floor(Math.random() * list.length)];
  while (picked.id === currentId) {
    picked = list[Math.floor(Math.random() * list.length)];
  }
  return picked;
};

// New utility functions for refactored App component

/**
 * Calculate typing stats (WPM, accuracy, character counts)
 * @param {string} input - User's typed input
 * @param {string} passageText - The passage to compare against
 * @param {number} elapsed - Seconds elapsed
 * @param {boolean} started - Whether test has started
 * @returns {Object} Stats object with correct, incorrect, acc, wpm
 */
export const calculateStats = (input, passageText, elapsed, started) => {
  const correct = correctChars(input, passageText);
  const incorrect = Math.max(input.length - correct, 0);
  const acc = input.length ? Math.round((correct / input.length) * 100) : 100;
  const timeForCalc = elapsed || (started ? 1 : 0);
  const wpm = timeForCalc ? computeWpm(correct, timeForCalc) : 0;
  return { correct, incorrect, acc, wpm };
};

/**
 * Get indices of characters that were typed incorrectly
 * @param {string} typed - User's input
 * @param {string} source - Correct passage text
 * @returns {Set} Set of indices where characters are incorrect
 */
export const getIncorrectCharIndices = (typed, source) => {
  const incorrectSet = new Set();
  for (let i = 0; i < typed.length; i += 1) {
    if (typed[i] !== source[i]) {
      incorrectSet.add(i);
    }
  }
  return incorrectSet;
};

/**
 * Determine test result (message, resultType, confetti flag)
 * @param {number} currentWpm - Current typing speed
 * @param {number} pb - Personal best
 * @param {boolean} hasPb - Whether a PB has been set
 * @returns {Object} Result info with message, resultType, and shouldShowConfetti
 */
export const determineTestResult = (currentWpm, pb, hasPb) => {
  if (!hasPb) {
    return {
      message: "Baseline Established! Great start.",
      resultType: "baseline",
      shouldShowConfetti: false,
      newPb: currentWpm,
    };
  }

  if (currentWpm > pb) {
    return {
      message: "High Score Smashed! Incredible run.",
      resultType: "new-pb",
      shouldShowConfetti: true,
      newPb: currentWpm,
    };
  }

  return {
    message: "Test Complete! Solid run. Keep going.",
    resultType: "complete",
    shouldShowConfetti: false,
    newPb: null,
  };
};

/**
 * Calculate remaining or elapsed time for display
 * @param {string} mode - Test mode ("timed" or "passage")
 * @param {number} elapsed - Seconds elapsed
 * @param {number} testSeconds - Total test duration (e.g., 60)
 * @returns {number} Remaining time if timed mode, elapsed time if passage mode
 */
export const calculateDisplayTime = (mode, elapsed, testSeconds) => {
  if (mode === "timed") {
    return Math.max(testSeconds - elapsed, 0);
  }
  return elapsed;
};

/**
 * Format time for display as MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTimeLabel = (seconds) => {
  return `0:${String(seconds).padStart(2, "0")}`;
};

/**
 * Format character count label
 * @param {number} correct - Correct characters
 * @param {number} incorrect - Incorrect characters
 * @returns {string} Formatted label like "45/2"
 */
export const formatCharsLabel = (correct, incorrect) => {
  return `${correct}/${incorrect}`;
};
