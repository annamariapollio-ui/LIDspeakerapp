import { useEffect } from "react";
import type { Speaker } from "../data/speakers";

interface SpeakerStatus {
  arrived: boolean;
  inRoom: boolean;
}

interface Props {
  speaker: Speaker;
  status: SpeakerStatus;
  onToggle: (field: "arrived" | "inRoom") => void;
  onClose: () => void;
}

const ROOM_COLORS: Record<string, string> = {
  "Plenary":     "bg-indigo-100 text-indigo-800",
  "Green Room":  "bg-green-100 text-green-800",
  "Blue Room":   "bg-blue-100 text-blue-800",
  "Purple Room": "bg-purple-100 text-purple-800",
  "Red Room":    "bg-red-100 text-red-800",
};

function parseRoleAndCompany(bio: string): { role: string; company: string } {
  const idx = bio.indexOf(" — ");
  if (idx === -1) return { role: bio, company: "" };
  return { role: bio.slice(0, idx), company: bio.slice(idx + 3) };
}

export default function SpeakerModal({ speaker, status, onToggle, onClose }: Props) {
  const { role, company } = parseRoleAndCompany(speaker.bio);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Hero photo / banner */}
        <div className="relative h-52 sm:h-64 flex-shrink-0 bg-gradient-to-br from-indigo-400 to-purple-500">
          {speaker.photoUrl ? (
            <img
              src={speaker.photoUrl}
              alt={speaker.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-6xl">
              {speaker.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
          )}
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Name overlay on photo */}
          <div className="absolute bottom-4 left-5 right-14">
            <h2 className="text-xl font-bold text-white leading-tight drop-shadow">{speaker.name}</h2>
            <p className="text-sm text-white/80 mt-0.5 drop-shadow">{role}</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* Company */}
          {company && (
            <p className="text-sm font-medium text-indigo-700 -mt-1">{company}</p>
          )}

          {/* Room + Time tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ROOM_COLORS[speaker.room] ?? "bg-gray-100 text-gray-700"}`}>
              {speaker.room}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {speaker.timeStart} – {speaker.timeEnd}
            </span>
          </div>

          {/* Topic */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-medium">Topic</p>
            <p className="text-sm text-gray-800 font-medium italic leading-snug">{speaker.topic}</p>
          </div>

          {/* Extended bio (if present) or fallback short bio */}
          {speaker.extendedBio ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-medium">About</p>
              <p className="text-sm text-gray-700 leading-relaxed">{speaker.extendedBio}</p>
            </div>
          ) : null}

          {/* Status toggles */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100 pb-2">
            <button
              onClick={() => onToggle("arrived")}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]
                ${status.arrived
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-800"
                }`}
            >
              {status.arrived ? "✓ Arrived at location" : "Mark as arrived"}
            </button>
            <button
              onClick={() => onToggle("inRoom")}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]
                ${status.inRoom
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-800"
                }`}
            >
              {status.inRoom ? "✓ In room — ready to present" : "Mark as in room"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
