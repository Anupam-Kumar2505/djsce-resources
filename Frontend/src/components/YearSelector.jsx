function YearSelector({ years, selectedYear, onYearChange }) {
  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Select Academic Year
        </h2>
        <p className="text-gray-400 text-sm">
          Choose your year to explore available resources
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {years.map((year) => (
          <button
            key={year.value}
            onClick={() => onYearChange(year.value)}
            className={`
              group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer
              ${
                selectedYear === year.value
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50"
              }
            `}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                  selectedYear === year.value
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              >
                {year.value}
              </div>
              <div
                className={`text-sm font-medium transition-colors duration-300 ${
                  selectedYear === year.value
                    ? "text-blue-100"
                    : "text-gray-400"
                }`}
              >
                {year.label}
              </div>
            </div>
            {selectedYear === year.value && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default YearSelector;
