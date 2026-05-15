import type { Speaker } from "../data/speakers";

interface SpeakerStatus {
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

function statusBadge(arrived: boolean, inRoom: boolean) {
  if (inRoom)  return { label: "In room — ready", cls: "bg-green-500 text-white" };
  if (arrived) return { label: "Arrived",          cls: "bg-yellow-400 text-yellow-900" };
  return            { label: "Not arrived",        cls: "bg-gray-200 text-gray-600" };
}

export default function SpeakerCard({ speaker, status, onToggle, onSelect }: Props) {
  const badge = statusBadge(status.arrived, status.inRoom);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Clickable header area */}
      <button onClick={onSelect} className="flex items-start justify-between gap-3 text-left active:opacity-80">
        <div className="flex items-center gap-3">
          {speaker.photoUrl ? (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
              {speaker.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{speaker.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{speaker.topic}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </button>

      {/* Bio — not clickable */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{speaker.bio}</p>

      {/* Time + Room */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2.5 py-1">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-gray-700">{speaker.timeStart}–{speaker.timeEnd}</span>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${getRoomColor(speaker.room)}`}>
          {speaker.room}
        </span>
      </div>

      {/* Status Toggles */}
      <div className="flex flex-col gap-2 pt-1 border-t border-gray-50">
        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            role="checkbox"
            aria-checked={status.arrived}
            onClick={() => onToggle("arrived")}
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
              ${status.arrived
                ? "bg-yellow-400 border-yellow-400"
                : "border-gray-300 group-hover:border-yellow-400"
              }`}
          >
            {status.arrived && (
              <svg className="w-3 h-3 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-xs text-gray-700">Arrived at location</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <button
            role="checkbox"
            aria-checked={status.inRoom}
            onClick={() => onToggle("inRoom")}
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
              ${status.inRoom
                ? "bg-green-500 border-green-500"
                : "border-gray-300 group-hover:border-green-500"
              }`}
          >
            {status.inRoom && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className="text-xs text-gray-700">In room — ready to present</span>
        </label>
      </div>
    </div>
  );
}
