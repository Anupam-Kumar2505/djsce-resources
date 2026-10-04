import { departments } from "../util/data";

function Departments({ selectedDept, onSelectDept }) {
  const handleDeptClick = (dept) => {
    if (onSelectDept) {
      onSelectDept(selectedDept?.code === dept.code ? null : dept);
    }
  };

  return (
    <section className="section" id="departments">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
              Pick your department
            </h2>
            <p className="text-base text-ink-dim mt-1.5 max-w-[40ch]">
              Every branch, every semester's notes and exam papers, kept current by students in that batch.
            </p>
          </div>
          {selectedDept && (
            <button
              onClick={() => onSelectDept(null)}
              className="text-xs font-semibold text-violet hover:underline self-start md:self-auto cursor-pointer"
            >
              Clear department filter ({selectedDept.code}) ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const isSelected = selectedDept?.code === dept.code;
            return (
              <div
                key={dept.code}
                onClick={() => handleDeptClick(dept)}
                className={`bg-white rounded-2xl sm:rounded-[20px] p-6 sm:p-6.5 border transition-all duration-250 cursor-pointer text-left ${
                  isSelected
                    ? "border-violet ring-3 ring-violet/25 shadow-[0_20px_40px_-18px_rgba(79,140,255,0.35)]"
                    : "border-line shadow-[0_12px_28px_-20px_rgba(22,27,51,0.25)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-18px_rgba(79,140,255,0.35)] hover:border-blue"
                }`}
              >
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-violet via-blue to-cyan text-white shadow-xs">
                  {dept.code}
                </span>
                <h3 className="text-lg font-semibold mt-3.5 text-ink">
                  {dept.name}
                </h3>
                <div className="text-[13px] text-ink-dim mt-2 font-medium">
                  {dept.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Departments;
