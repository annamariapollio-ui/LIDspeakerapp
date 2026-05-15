import type { Speaker } from "../data/speakers";

export interface SpeakerStatus {
  arrived: boolean;
  inRoom: boolean;
}

interface Props {
  speaker: Speaker;
  status: SpeakerStatus;
  onToggle: (field: "arrived" | "inRoom") => void;
  onSelect: () => void;
}

const ROOM_COLORS: Record<string, string> = {
  "Plenary":     "bg-indigo-100 text-indigo-800",
  "Green Room":  "bg-green-100 text-green-800",
  "Blue Room":   "bg-blue-100 text-blue-800",
  "Purple Room": "bg-purple-100 text-purple-800",
  "Red Room":    "bg-red-100 text-red-800",
};

function getRoomColor(room: string) {
  return ROOM_COLORS[room] ?? "bg-gray-100 text-gray-700";
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("");
}

export default function SpeakerListCard({ speaker, status, onToggle, onSelect }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 hover:shadow-md transition-shadow">
      {/* Clickable avatar + info */}
      <button
        onClick={onSelect}
        className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-80"
      >
        {/* Avatar */}
        {speaker.photoUrl ? (
          <img
            src={speaker.photoUrl}
            alt={speaker.name}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
            {initials(speaker.name)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{speaker.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{speaker.bio}</p>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoomColor(speaker.room)}`}>
              {speaker.room}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {speaker.timeStart}–{speaker.timeEnd}
            </span>
          </div>
        </div>

        {/* Chevron hint */}
        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Status toggles as compact pills — stop propagation so they don't open modal */}
      <div className="flex flex-col gap-1.5 flex-shrink-0 ml-1">
        <button
          onClick={e => { e.stopPropagation(); onToggle("arrived"); }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95
            ${status.arrived
              ? "bg-yellow-400 text-yellow-900"
              : "bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-700"
            }`}
        >
          {status.arrived ? "✓" : "·"} Arrived
        </button>
        <button
          onClick={e => { e.stopPropagation(); onToggle("inRoom"); }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95
            ${status.inRoom
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-700"
            }`}
        >
          {status.inRoom ? "✓" : "·"} In room
        </button>
      </div>
    </div>
  );
}
