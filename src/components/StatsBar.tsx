export type StatusFilter = "all" | "not-arrived" | "arrived" | "in-room";

interface Props {
  total: number;
  arrived: number;
  inRoom: number;
  activeFilter: StatusFilter;
  onFilter: (f: StatusFilter) => void;
}

const DOT: Record<StatusFilter, string> = {
  "all":         "",
  "not-arrived": "bg-gray-300",
  "arrived":     "bg-yellow-400",
  "in-room":     "bg-green-500",
};

export default function StatsBar({ total, arrived, inRoom, activeFilter, onFilter }: Props) {
  const notArrived = total - arrived;

  const tiles: { filter: StatusFilter; value: number; label: string }[] = [
    { filter: "all",         value: total,      label: "Total" },
    { filter: "not-arrived", value: notArrived, label: "Not arrived" },
    { filter: "arrived",     value: arrived,    label: "Arrived" },
    { filter: "in-room",     value: inRoom,     label: "In room" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible no-scrollbar">
      {tiles.map(({ filter, value, label }) => {
        const active = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilter(active ? "all" : filter)}
            className={`flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border transition-all cursor-pointer flex-shrink-0
              ${active
                ? "border-indigo-400 ring-2 ring-indigo-100 shadow-md"
                : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
              }`}
          >
            {filter !== "all" && (
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT[filter]}`} />
            )}
            <span className="text-xl font-bold text-gray-900">{value}</span>
            <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
