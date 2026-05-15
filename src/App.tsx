import { useState, useEffect } from "react";
import { SPEAKERS, ROOMS, type Speaker } from "./data/speakers";
import SpeakerCard from "./components/SpeakerCard";
import SpeakerListCard from "./components/SpeakerListCard";
import SpeakerModal from "./components/SpeakerModal";
import StatsBar, { type StatusFilter } from "./components/StatsBar";
import "./index.css";

const ALL = "All";
type View = "agenda" | "speakers";
type StatusMap = Record<string, { arrived: boolean; inRoom: boolean }>;

function getInitialStatus(): StatusMap {
  try {
    const saved = localStorage.getItem("lid-speaker-status");
    const parsed: StatusMap = saved ? JSON.parse(saved) : {};
    const init: StatusMap = {};
    for (const s of SPEAKERS) {
      init[s.id] = parsed[s.id] ?? { arrived: false, inRoom: false };
    }
    return init;
  } catch {
    const init: StatusMap = {};
    for (const s of SPEAKERS) init[s.id] = { arrived: false, inRoom: false };
    return init;
  }
}

export default function App() {
  const [view, setView]                     = useState<View>("agenda");
  const [activeRoom, setActiveRoom]         = useState<string>(ALL);
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>("all");
  const [search, setSearch]                 = useState("");
  const [status, setStatus]                 = useState<StatusMap>(getInitialStatus);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    localStorage.setItem("lid-speaker-status", JSON.stringify(status));
  }, [status]);

  function switchView(v: View) {
    setView(v);
    setSearch("");
  }

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

  function applyStatusFilter(speakers: Speaker[]) {
    if (statusFilter === "not-arrived") return speakers.filter(s => !status[s.id]?.arrived);
    if (statusFilter === "arrived")     return speakers.filter(s => status[s.id]?.arrived);
    if (statusFilter === "in-room")     return speakers.filter(s => status[s.id]?.inRoom);
    return speakers;
  }

  // ── Agenda view ───────────────────────────────────────────────────
  const agendaSpeakers = applyStatusFilter(
    (activeRoom === ALL ? SPEAKERS : SPEAKERS.filter(s => s.room === activeRoom))
      .slice()
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart))
  );

  // ── Speaker view ──────────────────────────────────────────────────
  const q = search.toLowerCase();
  const speakerViewList = applyStatusFilter(
    SPEAKERS.filter(s =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.bio.toLowerCase().includes(q) ||
      s.topic.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    ).slice().sort((a, b) => a.name.localeCompare(b.name))
  );

  const totalArrived = SPEAKERS.filter(s => status[s.id]?.arrived).length;
  const totalInRoom  = SPEAKERS.filter(s => status[s.id]?.inRoom).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 leading-tight truncate">LID 2026 — Speaker Manager</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Lifestyle Innovation Day · 18 May 2026 · LAC Center, Lugano</p>
          </div>
          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
            {(["agenda", "speakers"] as View[]).map(v => (
              <button
                key={v}
                onClick={() => switchView(v)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all
                  ${view === v
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {v === "agenda" ? "📋 Agenda" : "👥 Speakers"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">

        {/* ── Stats bar (clickable filters) ──────────────────────── */}
        <StatsBar
          total={SPEAKERS.length}
          arrived={totalArrived}
          inRoom={totalInRoom}
          activeFilter={statusFilter}
          onFilter={setStatusFilter}
        />

        {/* ── AGENDA VIEW ─────────────────────────────────────────── */}
        {view === "agenda" && (
          <>
            {/* Room filter — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible no-scrollbar">
              {[ALL, ...ROOMS].map(room => (
                <button
                  key={room}
                  onClick={() => setActiveRoom(room)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0
                    ${activeRoom === room
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                >
                  {room}
                  {room !== ALL && (
                    <span className="ml-1 text-xs opacity-70">
                      ({SPEAKERS.filter(s => s.room === room).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Cards grid */}
            {agendaSpeakers.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No speakers match this filter.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {agendaSpeakers.map(speaker => (
                  <SpeakerCard
                    key={speaker.id}
                    speaker={speaker}
                    status={status[speaker.id] ?? { arrived: false, inRoom: false }}
                    onToggle={field => handleToggle(speaker, field)}
                    onSelect={() => setSelectedSpeaker(speaker)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SPEAKER VIEW ────────────────────────────────────────── */}
        {view === "speakers" && (
          <>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search by name, company, topic or room…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-500 -mt-2">
              {speakerViewList.length} speaker{speakerViewList.length !== 1 ? "s" : ""}
              {statusFilter !== "all" && ` · filtered by "${statusFilter}"`}
              {search && ` · matching "${search}"`}
            </p>

            {/* List */}
            {speakerViewList.length === 0 ? (
              <p className="text-center text-gray-400 py-16">No speakers match your search.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {speakerViewList.map(speaker => (
                  <SpeakerListCard
                    key={speaker.id}
                    speaker={speaker}
                    status={status[speaker.id] ?? { arrived: false, inRoom: false }}
                    onToggle={field => handleToggle(speaker, field)}
                    onSelect={() => setSelectedSpeaker(speaker)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* ── Speaker profile modal ───────────────────────────────────── */}
      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          status={status[selectedSpeaker.id] ?? { arrived: false, inRoom: false }}
          onToggle={field => handleToggle(selectedSpeaker, field)}
          onClose={() => setSelectedSpeaker(null)}
        />
      )}
    </div>
  );
}
