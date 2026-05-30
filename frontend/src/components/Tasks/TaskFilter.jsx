import { Search, SlidersHorizontal } from 'lucide-react';

const STATUS_FILTERS = [
  { value: '',           label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'in-progress',label: 'In Progress' },
  { value: 'completed',  label: 'Completed' },
];

export default function TaskFilter({ search, onSearchChange, statusFilter, onStatusChange, taskCounts }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
        <input
          id="task-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="input pl-9"
        />
      </div>

      {/* Status filter tabs — scrollable on mobile */}
      <div className="flex items-center gap-1 bg-dark-800 border border-dark-700/60 rounded-xl p-1 overflow-x-auto scrollbar-hide flex-shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-dark-500 ml-1.5 flex-shrink-0" strokeWidth={2} />
        {STATUS_FILTERS.map(({ value, label }) => {
          const count = value === ''
            ? (taskCounts?.total || 0)
            : (taskCounts?.[value] || 0);

          return (
            <button
              key={value}
              id={`filter-${value || 'all'}`}
              onClick={() => onStatusChange(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${statusFilter === value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/60'
                }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] font-bold rounded-full ${
                  statusFilter === value
                    ? 'text-primary-200'
                    : 'text-dark-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
