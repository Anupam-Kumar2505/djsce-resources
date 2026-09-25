const yearGradients = {
  "1": "bg-gradient-to-br from-[#7C5CFC] to-[#4F8CFF]",
  "2": "bg-gradient-to-br from-[#4F8CFF] to-[#33D8D0]",
  "3": "bg-gradient-to-br from-[#2FC9BE] to-[#33D8D0]",
  "4": "bg-gradient-to-br from-[#FF7AC6] to-[#7C5CFC]",
};

function YearSelector({ years, selectedYear, onYearChange }) {
  const handleSelectYear = (value) => {
    onYearChange(value);
  };

  return (
    <section className="section" id="years">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
              Or jump straight to your year
            </h2>
            <p className="text-base text-ink-dim mt-1.5 max-w-[40ch]">
              Same archive, sliced the other way — pick a year and see every branch at once.
            </p>
          </div>
          {selectedYear && (
            <button
              onClick={() => onYearChange("")}
              className="text-xs font-semibold text-violet hover:underline self-start md:self-auto cursor-pointer"
            >
              Clear year selection ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {years.map((year) => {
            const isSelected = selectedYear === year.value;
            return (
              <button
                key={year.value}
                onClick={() => handleSelectYear(year.value)}
                className={`rounded-[22px] p-6 sm:p-7 relative overflow-hidden text-white min-h-[160px] flex flex-col justify-between shadow-[0_18px_34px_-18px_rgba(22,27,51,0.35)] cursor-pointer text-left border-2 transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_44px_-18px_rgba(22,27,51,0.45)] after:content-[''] after:absolute after:w-[120px] after:h-[120px] after:rounded-full after:bg-white/15 after:-top-10 after:-right-10 ${
                  yearGradients[year.value] || "bg-gradient-to-br from-[#7C5CFC] to-[#4F8CFF]"
                } ${
                  isSelected
                    ? "border-white ring-4 ring-offset-2 ring-violet shadow-[0_24px_44px_-18px_rgba(22,27,51,0.45)]"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between w-full relative z-10">
                  <h3 className="text-2xl sm:text-[26px] font-bold font-['Sora'] text-white">
                    {year.code || year.value}
                  </h3>
                  {isSelected && (
                    <span className="bg-white text-ink font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                      Selected
                    </span>
                  )}
                </div>
                <span className="text-[13.5px] opacity-90 mt-1 font-medium relative z-10">
                  {year.subtitle || year.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default YearSelector;
