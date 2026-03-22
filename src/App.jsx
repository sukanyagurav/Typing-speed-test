import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import passages from "../data.json";
import { TopStat } from "./components/TopStat";
import { PillGroup } from "./components/PillGroup";
import { Dropdown } from "./components/Dropdown";
import { ResultCard } from "./components/ResultCard";
import { 
  computeWpm, 
  correctChars, 
  capitalize, 
  randomPassage,
  calculateStats,
  getIncorrectCharIndices,
  determineTestResult,
  calculateDisplayTime,
  formatTimeLabel,
  formatCharsLabel,
} from "./utils/helpers";

const TEST_SECONDS = 60;
const PB_KEY = "typing-speed-pb";

const difficulties = ["easy", "medium", "hard"];
const modes = ["timed", "passage"];

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("timed");
  const [currentPassage, setCurrentPassage] = useState(() => randomPassage("easy", passages));
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pb, setPb] = useState(() => Number(localStorage.getItem(PB_KEY) || 0));
  const [message, setMessage] = useState("");
  const [resultType, setResultType] = useState("complete");
  const [everIncorrectSet, setEverIncorrectSet] = useState(() => new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!started || finished) return undefined;
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (mode === "timed" && next >= TEST_SECONDS) {
          clearInterval(timer);
          setFinished(true);
        }
        return next;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [started, finished, mode]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, []);

  useEffect(() => {
    if (!finished) return;
    const reachedEnd = input.length >= currentPassage.text.length;
    if (mode === "passage" && !reachedEnd) return;

    const currentWpm = computeWpm(correctChars(input, currentPassage.text), elapsed || 1);
    const result = determineTestResult(currentWpm, pb, pb > 0);
    
    setMessage(result.message);
    setResultType(result.resultType);
    setShowConfetti(result.shouldShowConfetti);
    
    if (result.newPb) {
      setPb(result.newPb);
      localStorage.setItem(PB_KEY, String(result.newPb));
    }
  }, [finished]);

  useEffect(() => {
    if (mode === "passage" && input.length >= currentPassage.text.length && started) {
      setFinished(true);
    }
  }, [input, mode, currentPassage, started]);

  const resetTest = (newDifficulty = difficulty, changePassage = false) => {
    const nextPassage = changePassage
      ? randomPassage(newDifficulty, passages, currentPassage.id)
      : randomPassage(newDifficulty, passages);
    setCurrentPassage(nextPassage);
    setInput("");
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setMessage("");
    setResultType("complete");
    setEverIncorrectSet(new Set());
    setShowConfetti(false);
    setOpenDropdown(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleTyping = (value) => {
    if (finished) return;
    const limited = value.slice(0, currentPassage.text.length);
    if (!started && limited.length > 0) setStarted(true);

    const nextIncorrectSet = getIncorrectCharIndices(limited, currentPassage.text);
    setEverIncorrectSet(nextIncorrectSet);
    setInput(limited);
  };

  const stats = useMemo(
    () => calculateStats(input, currentPassage.text, elapsed, started),
    [input, currentPassage, elapsed, started]
  );

  const remainingTime = calculateDisplayTime(mode, elapsed, TEST_SECONDS);
  const hasPb = pb > 0;
  const isResults = finished;
  const charsLabel = formatCharsLabel(stats.correct, stats.incorrect);
  const timedLabel = formatTimeLabel(remainingTime);

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-6 text-white sm:px-6 md:px-8 lg:px-10">
      <section ref={wrapperRef} className="mx-auto w-full">
        <header className="flex items-start justify-between gap-4 pb-6 md:pb-7">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo-small.svg" alt="" className="block h-8 w-8 sm:hidden" />
            <img src="/assets/images/logo-large.svg" alt="Typing Speed Test" className="hidden h-10 sm:block" />
          </div>
          <p className="flex items-center gap-2 text-[0.95rem] text-[#dbd079] sm:text-base">
            <img src="/assets/images/icon-personal-best.svg" alt="" className="h-4 w-4" />
            <span>
              <span className="text-[#9f9f9f]">Personal best:</span>{" "}
              <span className="font-semibold">{hasPb ? pb : 0} WPM</span>
            </span>
          </p>
        </header>

        {!isResults && (
          <>
            <section className="border-b border-white/12 pb-4 md:pb-5">
              <div className="grid grid-cols-3 gap-2 text-center sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 sm:text-left">
                <TopStat label="WPM" value={stats.wpm} valueColor="text-white" showDivider />
                <TopStat
                  label="Accuracy"
                  value={`${stats.acc}%`}
                  valueColor={stats.acc < 95 ? "text-[#df5c73]" : "text-white"}
                  showDivider
                />
                <TopStat
                  label="Time"
                  value={mode === "timed" ? timedLabel : `${remainingTime}s`}
                  valueColor="text-[#dbd079]"
                />
                <div className="col-span-3 mt-3 grid w-full grid-cols-2 gap-2 lg:hidden">
                  <Dropdown
                    label="Difficulty"
                    selected={capitalize(difficulty)}
                    isOpen={openDropdown === "difficulty"}
                    onToggle={(e) => {
                      e.stopPropagation();
                      setOpenDropdown((prev) => (prev === "difficulty" ? null : "difficulty"));
                    }}
                    options={difficulties.map((item) => ({
                      id: item,
                      label: capitalize(item),
                      active: difficulty === item,
                      onSelect: () => {
                        setDifficulty(item);
                        resetTest(item);
                      },
                    }))}
                  />
                  <Dropdown
                    label="Mode"
                    selected={mode === "timed" ? "Timed (60s)" : "Passage"}
                    isOpen={openDropdown === "mode"}
                    onToggle={(e) => {
                      e.stopPropagation();
                      setOpenDropdown((prev) => (prev === "mode" ? null : "mode"));
                    }}
                    options={modes.map((item) => ({
                      id: item,
                      label: item === "timed" ? "Timed (60s)" : "Passage",
                      active: mode === item,
                      onSelect: () => {
                        setMode(item);
                        resetTest(difficulty);
                      },
                    }))}
                  />
                </div>
                <div className="ml-auto hidden items-center gap-3 lg:flex lg:gap-4">
                  <PillGroup
                    label="Difficulty:"
                    options={difficulties.map((item) => ({
                      id: item,
                      label: capitalize(item),
                      active: difficulty === item,
                      onClick: () => {
                        setDifficulty(item);
                        resetTest(item);
                      },
                    }))}
                  />
                  <PillGroup
                    label="Mode:"
                    options={modes.map((item) => ({
                      id: item,
                      label: item === "timed" ? "Timed (60s)" : "Passage",
                      active: mode === item,
                      onClick: () => {
                        setMode(item);
                        resetTest(difficulty);
                      },
                    }))}
                  />
                </div>
              </div>
            </section>

            <section className="relative border-b border-white/12 py-6 md:py-7">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  inputRef.current?.focus();
                  if (!started) setStarted(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    inputRef.current?.focus();
                    if (!started) setStarted(true);
                  }
                }}
                className="cursor-text text-[2.25rem] leading-[1.24] tracking-[-0.01em] sm:text-[2.35rem] sm:leading-[1.24]  md:leading-[1.22]"
              >
                {currentPassage.text.split("").map((char, index) => {
                  const typed = input[index];
                  const isCurrent = index === input.length && started;
                  const isCorrect = started && typed && typed === char;
                  const isIncorrect = started && typed && typed !== char;
                  const hiddenUntilStart = !started;
                  return (
                    <span
                      key={`${currentPassage.id}-${index}`}
                      className={[
                        "rounded-[2px] transition",
                        hiddenUntilStart ? "text-[#787878]/35 blur-[2.5px]" : "text-[#9f9f9f]",
                        isCorrect ? "text-[#37ba6d]!" : "",
                        isIncorrect ? "text-[#df5c73]! underline decoration-2 underline-offset-8" : "",
                        isCurrent ? "bg-white/15" : "",
                      ].join(" ")}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              <AnimatePresence>
                {!started && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setStarted(true);
                        inputRef.current?.focus();
                      }}
                      className="pointer-events-auto rounded-xl bg-[#3b82f6] px-6 py-2.5 text-[1rem] font-semibold hover:bg-[#4e8ff7] sm:px-7 sm:py-3 sm:text-[1.05rem] md:px-8 md:text-[1.1rem]"
                    >
                      Start Typing Test
                    </button>
                    <p className="text-[1rem] font-semibold text-white sm:text-[1.05rem] md:text-[1.1rem]">
                      Or click the text and start typing
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => handleTyping(e.target.value)}
                disabled={finished}
                aria-label="Typing input"
                className="absolute left-0 top-0 h-0 w-0 opacity-0"
                autoFocus
              />
            </section>

            {started && (
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={() => resetTest(difficulty, true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-[1rem] font-semibold text-white transition hover:bg-white/20 md:text-[1.05rem]"
                >
                  Restart Test
                  <img src="/assets/images/icon-restart.svg" alt="" className="h-6 w-6" />
                </button>
              </div>
            )}
          </>
        )}

        {isResults && (
          <AnimatePresence>
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center pt-8 text-center md:pt-10 pb-[300px]"
            >
              {resultType !== "new-pb" && (
                <>
                  <img
                    src="/assets/images/pattern-star-1.svg"
                    alt=""
                    className="pointer-events-none absolute right-0 bottom-0 hidden w-20 md:block"
                  />
                  <img
                    src="/assets/images/pattern-star-2.svg"
                    alt=""
                    className="pointer-events-none absolute left-0 top-56 hidden w-10 md:block"
                  />
                </>
              )}
              <div className="relative grid place-items-center">
                {resultType !== "new-pb" && (
                  <>
                    <span className="absolute h-28 w-28 rounded-full bg-[#37ba6d]/14" />
                    <span className="absolute h-22 w-22 rounded-full bg-[#37ba6d]/18" />
                    <span className="absolute h-16 w-16 rounded-full bg-[#37ba6d]/22" />
                  </>
                )}
                <img
                  src={resultType === "new-pb" ? "/assets/images/icon-new-pb.svg" : "/assets/images/icon-completed.svg"}
                  alt=""
                  className="relative z-10 h-24 w-24"
                />
              </div>
              <h2 className="mt-6 text-[2rem] font-bold sm:text-[2.25rem] md:text-[2.7rem]">
                {resultType === "new-pb"
                  ? "High Score Smashed!"
                  : resultType === "baseline"
                  ? "Baseline Established!"
                  : "Test Complete!"}
              </h2>
              <p className="mt-3 max-w-176 text-[0.95rem] text-[#8f8f8f] sm:text-[1rem] md:text-[1.2rem]">{message}</p>
              <div className="mt-8 grid w-full max-w-160 grid-cols-1 gap-3 sm:grid-cols-3 md:mt-10">
                <ResultCard label="WPM" value={stats.wpm} color="text-white" />
                <ResultCard label="Accuracy" value={`${stats.acc}%`} color={stats.acc < 95 ? "text-[#df5c73]" : "text-white"} />
                <ResultCard label="Characters" value={charsLabel} color="text-[#37ba6d]" secondaryColor="text-[#df5c73]" />
              </div>
              <button
                type="button"
                onClick={() => resetTest(difficulty, true)}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-[1rem] font-semibold text-[#111] hover:bg-white/90 md:mt-10 md:text-[1.05rem]"
              >
                {resultType === "complete" ? "Go Again" : "Beat This Score"}
                <img src="/assets/images/icon-restart.svg" alt="" className="h-5 w-5 brightness-0" />
              </button>
              <AnimatePresence>
                {showConfetti && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ 
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    src="/assets/images/pattern-confetti.svg" 
                    alt="" 
                    className="pointer-events-none absolute right-6 bottom-0 w-full" 
                  />
                )}
              </AnimatePresence>
            </motion.section>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}

export default App;
