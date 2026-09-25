import { useState, useEffect, useRef, useCallback } from "react";
import GhostSvg from "./GhostSvg";

const GHOST_W = 77; // 90 * (120/140)
const GHOST_H = 90;
const MAX_GHOSTS = 5;
const SPRING = 0.08;
const DAMPING = 0.92;
const ROPE_LEN = 100;
const PUPIL_MAX = 4;
const BOB_AMP = 4;
const TILT_MAX = 15;

function makeGhost(x, y, id) {
  return { id, x, y, vx: 0, vy: 0, bobPhase: Math.random() * Math.PI * 2 };
}

function GhostPet() {
  const [ghosts, setGhosts] = useState(() => {
    const x = typeof window !== "undefined" ? window.innerWidth - GHOST_W - 30 : 800;
    const y = typeof window !== "undefined" ? window.innerHeight - GHOST_H - 30 : 600;
    return [makeGhost(x, y, 0)];
  });

  const [dragging, setDragging] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "ghost",
      text: "Boo! 👻 I'm your DJSCE study companion. Need help finding notes, question papers, or syllabus?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const mouseRef = useRef({ x: 0, y: 0 });
  const ghostsRef = useRef(ghosts);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pinnedPosRef = useRef(null);
  const nextIdRef = useRef(1);
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const chatInputRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Keep refs in sync
  useEffect(() => {
    ghostsRef.current = ghosts;
  }, [ghosts]);
  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  // Auto focus input when chat pops up
  useEffect(() => {
    if (showChat) {
      const timer = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [showChat]);

  // Mouse tracking & Dragging handler
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (draggingRef.current) {
        const newX = Math.max(0, Math.min(window.innerWidth - GHOST_W, e.clientX - dragOffsetRef.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - GHOST_H, e.clientY - dragOffsetRef.current.y));

        const current = ghostsRef.current;
        const updated = current.map((g, i) =>
          i === 0 ? { ...g, x: newX, y: newY, vx: 0, vy: 0 } : g
        );
        ghostsRef.current = updated;
        setGhosts([...updated]);
      }
    };

    const onUp = () => {
      if (draggingRef.current) {
        const g = ghostsRef.current[0];
        pinnedPosRef.current = { x: g.x, y: g.y };
        setDragging(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Right-click to spawn and chain duplicate ghosts
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const current = ghostsRef.current;
    if (current.length >= MAX_GHOSTS) return;

    const newGhost = makeGhost(
      e.clientX - GHOST_W / 2,
      e.clientY - GHOST_H / 2,
      nextIdRef.current++
    );
    setGhosts((prev) => [...prev, newGhost]);
  }, []);

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [handleContextMenu]);

  // Animation loop: chaining physics for duplicate ghosts + bobbing
  useEffect(() => {
    const tick = (timestamp) => {
      timeRef.current = timestamp / 1000;
      const isDragging = draggingRef.current;
      const currentGhosts = ghostsRef.current;

      const updated = currentGhosts.map((ghost, i) => {
        // While dragging, ghost 0 is controlled directly by mousemove
        if (i === 0 && isDragging) {
          return ghost;
        }

        let targetX, targetY;

        if (i === 0) {
          // Primary ghost rests at pinned position
          if (pinnedPosRef.current) {
            targetX = pinnedPosRef.current.x;
            targetY = pinnedPosRef.current.y;
          } else {
            targetX = ghost.x;
            targetY = ghost.y;
          }
        } else {
          // Chained ghosts follow the preceding ghost
          const prev = currentGhosts[i - 1];
          const dx = prev.x - ghost.x;
          const dy = prev.y - ghost.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > ROPE_LEN) {
            const ratio = (dist - ROPE_LEN) / dist;
            targetX = ghost.x + dx * ratio;
            targetY = ghost.y + dy * ratio;
          } else {
            targetX = ghost.x;
            targetY = ghost.y;
          }
        }

        // Spring physics
        const ax = (targetX - ghost.x) * SPRING;
        const ay = (targetY - ghost.y) * SPRING;
        let vx = (ghost.vx + ax) * DAMPING;
        let vy = (ghost.vy + ay) * DAMPING;

        let nx = ghost.x + vx;
        let ny = ghost.y + vy;

        nx = Math.max(0, Math.min(window.innerWidth - GHOST_W, nx));
        ny = Math.max(0, Math.min(window.innerHeight - GHOST_H, ny));

        return { ...ghost, x: nx, y: ny, vx, vy };
      });

      ghostsRef.current = updated;
      setGhosts([...updated]);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pupil offset for eye tracking
  const getEyeOffset = (ghost) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const eyeCx = ghost.x + GHOST_W / 2;
    const eyeCy = ghost.y + GHOST_H * 0.41;
    const dx = mx - eyeCx;
    const dy = my - eyeCy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(PUPIL_MAX, dist * 0.02);

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const getTilt = (ghost) => {
    return Math.max(-TILT_MAX, Math.min(TILT_MAX, ghost.vx * 2));
  };

  const getBob = (ghost, i) => {
    return Math.sin(timeRef.current * 2 + ghost.bobPhase + i * 0.7) * BOB_AMP;
  };

  // Build connecting rope paths between chained ghosts
  const buildRopePaths = () => {
    if (ghosts.length <= 1) return [];
    const paths = [];

    for (let i = 0; i < ghosts.length - 1; i++) {
      const a = { x: ghosts[i].x + GHOST_W / 2, y: ghosts[i].y + 8 };
      const b = { x: ghosts[i + 1].x + GHOST_W / 2, y: ghosts[i + 1].y + 8 };
      const mx = (a.x + b.x) / 2;
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      const sag = Math.min(30, dist * 0.15);
      const my = (a.y + b.y) / 2 + sag;

      paths.push(`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
    }
    return paths;
  };

  // Hover handlers for showing/hiding chatbox with grace period
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowChat(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowChat(false);
    }, 450);
  };

  // Mousedown on ghost to drag anywhere on screen
  const handleGhostMouseDown = (e) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only left click drags

    const ghost = ghostsRef.current[0];
    setDragging(true);
    dragOffsetRef.current = { x: e.clientX - ghost.x, y: e.clientY - ghost.y };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputVal.trim();
    if (!query) return;

    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: query },
      {
        id: Date.now() + 1,
        sender: "ghost",
        text: `Got it! AI Chatbot is coming soon. For now, check the Resources tab above for ${query}!`,
      },
    ]);
    setInputVal("");
  };

  const ropePaths = buildRopePaths();
  const leaderGhost = ghosts[0] || { x: 0, y: 0 };

  // Calculate smart position for chatbox so it never overflows viewport
  const getChatBoxPosition = () => {
    const isClient = typeof window !== "undefined";
    const vw = isClient ? window.innerWidth : 1200;
    const vh = isClient ? window.innerHeight : 800;

    const chatWidth = 320;
    const chatHeight = 380;

    // Prefer showing on left of ghost if too close to right edge
    let left = leaderGhost.x + GHOST_W + 16;
    if (left + chatWidth > vw - 16) {
      left = Math.max(16, leaderGhost.x - chatWidth - 16);
    }

    // Prefer showing above ghost if too close to bottom
    let top = leaderGhost.y - 120;
    if (top + chatHeight > vh - 20) {
      top = Math.max(16, vh - chatHeight - 20);
    }
    if (top < 16) top = 16;

    return { left, top };
  };

  const chatPos = getChatBoxPosition();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* Connecting rope paths between duplicate/chained ghosts */}
      {ropePaths.length > 0 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {ropePaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#7C5CFC"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}

      {/* Floating Ghost Mascot(s) */}
      {ghosts.map((ghost, i) => {
        const eye = getEyeOffset(ghost);
        const tilt = getTilt(ghost);
        const bob = getBob(ghost, i);

        return (
          <div
            key={ghost.id}
            onMouseDown={i === 0 ? handleGhostMouseDown : undefined}
            onMouseEnter={i === 0 ? handleMouseEnter : undefined}
            onMouseLeave={i === 0 ? handleMouseLeave : undefined}
            style={{
              position: "absolute",
              left: ghost.x,
              top: ghost.y + bob,
              transform: `rotate(${tilt}deg)`,
              transition: dragging ? "none" : "transform 0.1s ease-out",
              cursor: dragging ? "grabbing" : "grab",
              pointerEvents: "auto",
              filter: "drop-shadow(0 10px 24px rgba(22,27,51,0.22))",
              userSelect: "none",
            }}
            title={i === 0 ? "Hover to chat · Click & drag anywhere · Right-click to duplicate" : undefined}
          >
            <GhostSvg
              size={GHOST_H}
              eyeOffsetX={eye.x}
              eyeOffsetY={eye.y}
            />
          </div>
        );
      })}

      {/* Interactive Chatbox with smooth Fade In / Out */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-[320px] rounded-2xl bg-white/95 backdrop-blur-md border border-line shadow-2xl overflow-hidden transition-all duration-300 ease-out select-auto ${
          showChat && !dragging
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
        style={{
          position: "absolute",
          left: chatPos.left,
          top: chatPos.top,
        }}
      >
        {/* Chatbox Header */}
        <div className="bg-gradient-to-r from-violet via-blue to-cyan p-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">
              👻
            </div>
            <div>
              <div className="font-['Sora'] font-bold text-xs flex items-center gap-1.5">
                Ghost Study Buddy
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-white/80 font-medium">
                AI Assistant · Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowChat(false)}
            className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Chatbox Message Body */}
        <div className="p-3.5 h-[190px] overflow-y-auto space-y-2.5 bg-bg/50 text-xs">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-2.5 rounded-2xl leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-violet text-white rounded-tr-xs"
                    : "bg-white text-ink border border-line shadow-xs rounded-tl-xs"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 pt-2 pb-1.5 bg-white border-t border-line/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["TE Notes", "PYQs 2024", "Syllabus"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFEAFF] text-violet hover:bg-violet hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar with Auto-Focus */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 bg-white border-t border-line flex items-center gap-2"
        >
          <input
            ref={chatInputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about any subject or exam..."
            className="flex-1 text-xs px-3 py-2 rounded-xl bg-bg border border-line focus:outline-none focus:border-violet text-ink placeholder:text-ink-dim/60 transition-colors"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-gradient-to-r from-violet to-blue text-white hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center"
            title="Send"
          >
            <svg
              className="w-3.5 h-3.5 rotate-45 -translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default GhostPet;
