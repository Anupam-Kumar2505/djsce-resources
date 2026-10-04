import { useState } from "react";

const initialPapers = [
  {
    id: 1,
    subject: "Data Structures",
    highlightColor: "yellow",
    exam: "End-Semester Examination 2024 · 80 Marks",
    dept: "Computer Engineering",
    yr: "TE",
    scribble: "Time Complexity: O(V + E) log V · AVL Trees & Dijkstra algorithm verified",
    formula: "Balanced Height: h ≤ 1.44 · log₂(N + 2)",
  },
  {
    id: 2,
    subject: "Signals & Systems",
    highlightColor: "green",
    exam: "End-Semester Examination 2023 · 80 Marks",
    dept: "Electronics & Telecom",
    yr: "SE",
    scribble: "Continuous Fourier Transform & Z-transform numericals solved step-by-step",
    formula: "X(z) = Σ x[n] · z⁻ⁿ · ROC: |z| > |a|",
  },
  {
    id: 3,
    subject: "Thermodynamics",
    highlightColor: "orange",
    exam: "End-Semester Examination 2023 · 80 Marks",
    dept: "Mechanical Engineering",
    yr: "SE",
    scribble: "Rankine cycle reheat & regenerative numericals · entropy balance marked",
    formula: "η = (W_turbine - W_pump) / Q_in",
  },
  {
    id: 4,
    subject: "Machine Learning",
    highlightColor: "blue",
    exam: "End-Semester Examination 2024 · 80 Marks",
    dept: "AI & Data Science",
    yr: "TE",
    scribble: "Backpropagation gradient descent derivation & SVM kernel trick solved",
    formula: "w ← w - η · ∇J(w) · Softmax: e^z_i / Σ e^z_j",
  },
  {
    id: 5,
    subject: "Database Systems",
    highlightColor: "pink",
    exam: "End-Semester Examination 2023 · 80 Marks",
    dept: "Information Technology",
    yr: "SE",
    scribble: "Complex SQL nested queries, B+ Tree index insertion & Normalization (BCNF)",
    formula: "Relational: π_Name (σ_Marks>75 (Students ⨝ Grades))",
  },
];

// Resting physical positions for the stack
const restingSlots = [
  { transform: "translate(0px, 0px) rotate(-2deg)", zIndex: 10 },
  { transform: "translate(8px, 9px) rotate(2.5deg)", zIndex: 8 },
  { transform: "translate(16px, 18px) rotate(-3deg)", zIndex: 6 },
  { transform: "translate(24px, 27px) rotate(3deg)", zIndex: 4 },
  { transform: "translate(32px, 36px) rotate(-1.5deg)", zIndex: 2 },
];

// Human highlighter styles with organic chisel-marker characteristics
const highlighterConfigs = {
  yellow: {
    gradient: "linear-gradient(104deg, rgba(254,240,138,0.3) 0%, rgba(254,240,138,0.96) 2%, rgba(253,224,71,0.98) 95%, rgba(254,240,138,0.7) 100%)",
    shadow: "0 1px 12px rgba(250, 204, 21, 0.4)",
    text: "text-[#1c1917]",
    tilt: "-rotate-[0.8deg]",
    radius: "rounded-[3px_9px_4px_7px]",
    bleed: "rgba(253, 224, 71, 0.25)",
  },
  green: {
    gradient: "linear-gradient(102deg, rgba(187,247,208,0.3) 0%, rgba(187,247,208,0.96) 2%, rgba(134,239,172,0.98) 95%, rgba(187,247,208,0.7) 100%)",
    shadow: "0 1px 12px rgba(74, 222, 128, 0.4)",
    text: "text-[#064e3b]",
    tilt: "rotate-[0.7deg]",
    radius: "rounded-[7px_3px_8px_4px]",
    bleed: "rgba(134, 239, 172, 0.25)",
  },
  orange: {
    gradient: "linear-gradient(103deg, rgba(254,215,170,0.3) 0%, rgba(254,215,170,0.96) 2%, rgba(251,146,60,0.96) 95%, rgba(254,215,170,0.7) 100%)",
    shadow: "0 1px 12px rgba(251, 146, 60, 0.4)",
    text: "text-[#7c2d12]",
    tilt: "-rotate-[0.6deg]",
    radius: "rounded-[4px_8px_5px_6px]",
    bleed: "rgba(251, 146, 60, 0.25)",
  },
  blue: {
    gradient: "linear-gradient(100deg, rgba(186,230,253,0.3) 0%, rgba(186,230,253,0.96) 2%, rgba(125,211,252,0.98) 95%, rgba(186,230,253,0.7) 100%)",
    shadow: "0 1px 12px rgba(56, 189, 248, 0.4)",
    text: "text-[#0c4a6e]",
    tilt: "rotate-[0.6deg]",
    radius: "rounded-[6px_4px_7px_3px]",
    bleed: "rgba(125, 211, 252, 0.25)",
  },
  pink: {
    gradient: "linear-gradient(101deg, rgba(254,205,211,0.3) 0%, rgba(254,205,211,0.96) 2%, rgba(251,113,133,0.96) 95%, rgba(254,205,211,0.7) 100%)",
    shadow: "0 1px 12px rgba(244, 114, 182, 0.4)",
    text: "text-[#881337]",
    tilt: "-rotate-[0.7deg]",
    radius: "rounded-[4px_7px_3px_8px]",
    bleed: "rgba(251, 113, 133, 0.25)",
  },
};

function HumanHighlight({ color = "yellow", children }) {
  const cfg = highlighterConfigs[color] || highlighterConfigs.yellow;

  return (
    <span
      className={`relative inline-block px-2.5 py-1 ${cfg.radius} ${cfg.tilt} ${cfg.text} transition-transform duration-200 select-none my-0.5`}
      style={{
        backgroundImage: cfg.gradient,
        boxShadow: cfg.shadow,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      <span className="relative z-10 font-extrabold tracking-tight">
        {children}
      </span>
    </span>
  );
}

function FlipStack() {
  const [papers, setPapers] = useState(initialPapers);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (isFlipping || papers.length === 0) return;
    setIsFlipping(true);

    // Natural 480ms human flip gesture
    setTimeout(() => {
      setPapers((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsFlipping(false);
    }, 480);
  };

  return (
    <section className="section bg-gradient-to-b from-bg to-white border-y border-line" id="flip">
      <div className="wrap text-center">
        <div className="max-w-xl mx-auto mb-10">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAFF] text-violet text-xs font-semibold mb-3">
            <span>📚</span> Interactive Past Paper Deck
          </div> */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
            The archive, one paper at a time
          </h2>
          <p className="text-ink-dim text-base mt-2">
            Click the stack — flip through real past papers like you would on a desk.
          </p>
        </div>

        {/* 3D Flip container */}
        <div
          className="max-w-[420px] mx-auto mt-6 h-[290px] relative [perspective:1800px] cursor-pointer group"
          onClick={handleFlip}
          title="Click to flip the paper"
        >
          {papers.map((paper, index) => {
            const isTop = index === 0;
            const hl = highlighterConfigs[paper.highlightColor] || highlighterConfigs.yellow;

            // When flipping:
            // - Top card executes the humanPaperFlip keyframe arc
            // - Cards underneath glide forward to the previous slot with spring easing
            const currentSlot = isFlipping
              ? (isTop ? null : restingSlots[index - 1] || restingSlots[0])
              : (restingSlots[index] || restingSlots[restingSlots.length - 1]);

            return (
              <div
                key={paper.id}
                className={`absolute inset-0 w-full h-full rounded-2xl [transform-style:preserve-3d] select-none ${isTop && isFlipping
                    ? "animate-[humanPaperFlip_480ms_cubic-bezier(0.2,0.85,0.3,1)_forwards]"
                    : "transition-all duration-[420ms] [transition-timing-function:cubic-bezier(0.18,0.89,0.32,1.15)]"
                  } ${isTop && !isFlipping
                    ? "group-hover:-translate-y-2 group-hover:-translate-x-0.5 group-hover:rotate-[-1.5deg] group-hover:shadow-[0_28px_56px_-18px_rgba(22,27,51,0.4)]"
                    : ""
                  }`}
                style={currentSlot ? { transform: currentSlot.transform, zIndex: currentSlot.zIndex } : {}}
              >
                {/* ================= FRONT FACE OF PAPER ================= */}
                <div className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-line p-6 [backface-visibility:hidden] shadow-[0_20px_45px_-20px_rgba(22,27,51,0.3)] overflow-hidden [background-image:repeating-linear-gradient(180deg,transparent_0_26px,#E8EAFA_27px)] before:content-[''] before:absolute before:left-11 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#FFA8BE]">
                  {/* Notebook punch holes on left margin */}
                  <div className="absolute left-3 top-8 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />
                  <div className="absolute left-3 bottom-8 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />

                  {/* Red/violet verified circular seal */}
                  <span className="absolute top-4 right-4 w-[60px] h-[60px] border-2 border-dashed border-violet/70 rounded-full flex flex-col items-center justify-center -rotate-12 text-[8px] font-black text-violet text-center leading-tight tracking-wider bg-white/90 backdrop-blur-xs shadow-xs">
                    <span className="text-[10px]">★</span>
                    <span>DJSCE</span>
                    <span>VERIFIED</span>
                  </span>

                  {/* College header */}
                  <div className="text-left pl-11">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-ink-dim/70 font-semibold block">
                      D. J. Sanghvi College of Engineering
                    </span>
                  </div>

                  {/* Subject Title with human-styled highlighter stroke */}
                  <div className="text-left pl-11 mt-3">
                    <h3 className="font-['Sora'] text-[20px] sm:text-[22px] leading-tight text-ink">
                      <HumanHighlight color={paper.highlightColor}>
                        {paper.subject}
                      </HumanHighlight>
                    </h3>
                    <div className="text-left mt-1 text-[12.5px] font-medium text-ink-dim">
                      {paper.exam}
                    </div>
                  </div>

                  {/* Metadata and student scribble note */}
                  <div className="text-left pl-11 mt-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet/15 to-blue/15 text-violet font-['Sora']">
                        {paper.yr}
                      </span>
                      <span className="text-[12px] font-medium text-ink-dim/90">
                        {paper.dept}
                      </span>
                    </div>

                    {/* Student pencil margin scribble */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ink-dim/80 font-mono italic">
                      <span className="text-violet font-sans font-bold">✎</span>
                      <span className="truncate">{paper.scribble}</span>
                    </div>
                  </div>
                </div>

                {/* ================= BACK FACE OF PAPER (visible during 3D flip) ================= */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#FCFCFD] border border-line p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] select-none shadow-sm flex flex-col justify-between overflow-hidden [background-image:repeating-linear-gradient(180deg,transparent_0_26px,#EDF0FA_27px)] before:content-[''] before:absolute before:right-11 before:top-0 before:bottom-0 before:w-[2px] before:bg-[#FFA8BE]/40"
                  style={{
                    backgroundColor: "#FDFDFE",
                  }}
                >
                  {/* Punch holes (reversed on right margin) */}
                  <div className="absolute right-3 top-8 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />
                  <div className="absolute right-3 bottom-8 w-3 h-3 rounded-full bg-bg border border-line shadow-inner" />

                  {/* Header on reverse side */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase text-ink-dim/60 font-semibold border-b border-line pb-1.5">
                      <span>PAGE 2 · ROUGH WORK &amp; CALCULATIONS</span>
                      <span>DJSCE EXAM</span>
                    </div>

                    {/* Faint realistic highlighter bleed-through from the front */}
                    <div
                      className="mt-4 mr-10 p-2.5 rounded-lg border border-dashed border-line/60"
                      style={{
                        backgroundColor: hl.bleed,
                      }}
                    >
                      <div className="text-[10.5px] font-mono text-ink-dim/70">
                        [ Formulas &amp; Working Notes ]
                      </div>
                      <div className="font-mono text-[11.5px] font-semibold text-ink/75 mt-1">
                        <code>{paper.formula}</code>
                      </div>
                    </div>
                  </div>

                  {/* Bottom footer note */}
                  <div className="flex justify-between items-center text-[10px] text-ink-dim/50 font-mono pt-2 border-t border-line/60">
                    <span>SEAL NO: 2024-DJ-EXAM</span>
                    <span>Turn over for Page 3 →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper indicators and flip action controls */}
        {/* <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-1.5">
            {initialPapers.map((p, idx) => {
              const active = papers[0]?.id === p.id;
              return (
                <span
                  key={p.id}
                  className={`h-2 rounded-full transition-all duration-300 ${active ? "w-7 bg-violet shadow-xs" : "w-2 bg-line"
                    }`}
                  title={`Paper ${idx + 1}: ${p.subject}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleFlip}
            disabled={isFlipping}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-white border border-line hover:border-violet text-ink shadow-xs hover:shadow-md transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50"
          >
            <span className="text-violet text-sm">↻</span>
            <span>Click to flip next paper</span>
            <span className="text-ink-dim font-mono text-[11px]">
              ({papers[0]?.id}/{initialPapers.length})
            </span>
          </button>
        </div> */}
      </div>
    </section>
  );
}

export default FlipStack;
