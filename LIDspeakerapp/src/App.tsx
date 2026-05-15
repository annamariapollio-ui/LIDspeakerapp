import { useState, useEffect } from "react";
import { SPEAKERS, ROOMS, type Speaker } from "./data/speakers";
import SpeakerCard from "./components/SpeakerCard";
import StatsBar from "./components/StatsBar";
import "./index.css";

const ALL = "All";

type StatusMap = Record<string, { arrived: boolean; inRoom: boolean }>;

function loadStatus(): StatusMap {
  try {
    const saved = localStorage.getItem("lid-speaker-status");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function getInitialStatus(): StatusMap {
  const saved = loadStatus();
  const init: StatusMap = {};
  for (const s of SPEAKERS) {
    init[s.id] = saved[s.id] ?? { arrived: false, inRoom: false };
  }
  return init;
}

export default function App() {
  const [activeRoom, setActiveRoom] = useState<string>(ALL);
  const [status, setStatus] = useState<StatusMap>(getInitialStatus);

  useEffect(() => {
    localStorage.setItem("lid-speaker-status", JSON.stringify(status));
  }, [status]);

  function handleToggle(speaker: Speaker, field: "arrived" | "inRoom") {
    setStatus(prev => {
      const current = prev[speaker.id];
      const next = { ...current };

      if (field === "arrived") {
        next.arrived = !current.arrived;
        if (!next.arrived) next.inRoom = false;
      } else {
        next.inRoom = !current.inRoom;
        if (next.inRoom) next.arrived = true;
      }

      return { ...prev, [speaker.id]: next };
    });
  }

  const rooms = [ALL, ...ROOMS];
  const filtered = activeRoom === ALL
    ? SPEAKERS
    : SPEAKERS.filter(s => s.room === activeRoom);

  const sortedFiltered = [...filtered].sort((a, b) =>
    a.timeStart.localeCompare(b.timeStart)
  );

  const totalArrived = SPEAKERS.filter(s => status[s.id]?.arrived).length;
  const totalInRoom  = SPEAKERS.filter(s => status[s.id]?.inRoom).length;

  function handleResetAll() {
    if (!confirm("Reset all speaker statuses?")) return;
    const reset: StatusMap = {};
    for (const s of SPEAKERS) reset[s.id] = { arrived: false, inRoom: false };
    setStatus(reset);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                LID 2026 — Speaker Manager
              </h1>
              <p className="text-sm text-gray-500">Lifestyle Innovation Day</p>
            </div>
            <button
              onClick={handleResetAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Reset all
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Stats */}
        <StatsBar
          total={SPEAKERS.length}
          arrived={totalArrived}
          inRoom={totalInRoom}
        />

        {/* Room Filter */}
        <div className="flex gap-2 flex-wrap">
          {rooms.map(room => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeRoom === room
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
            >
              {room}
              {room !== ALL && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({SPEAKERS.filter(s => s.room === room).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Speaker Grid */}
        {sortedFiltered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No speakers for this room.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFiltered.map(speaker => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                status={status[speaker.id] ?? { arrived: false, inRoom: false }}
                onToggle={(field) => handleToggle(speaker, field)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
