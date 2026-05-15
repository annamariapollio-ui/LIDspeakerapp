interface Props {
  total: number;
  arrived: number;
  inRoom: number;
}

export default function StatsBar({ total, arrived, inRoom }: Props) {
  const notArrived = total - arrived;

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-sm text-gray-500">Total speakers</span>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
        <span className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />
        <span className="text-2xl font-bold text-gray-900">{notArrived}</span>
        <span className="text-sm text-gray-500">Not arrived</span>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
        <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
        <span className="text-2xl font-bold text-gray-900">{arrived - inRoom}</span>
        <span className="text-sm text-gray-500">Arrived</span>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100">
        <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-2xl font-bold text-gray-900">{inRoom}</span>
        <span className="text-sm text-gray-500">In room — ready</span>
      </div>
    </div>
  );
}
