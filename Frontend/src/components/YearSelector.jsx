function YearSelector({ years, selectedYear, onYearChange }) {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-xl text-white mb-4">Select Year</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {years.map((year) => (
          <button
            key={year.value}
            onClick={() => onYearChange(year.value)}
            className={`
              p-4 border cursor-pointer
              ${
                selectedYear === year.value
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-300"
              }
            `}
          >
            <div className="text-center">
              <div className="text-lg font-medium">{year.value}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default YearSelector;
