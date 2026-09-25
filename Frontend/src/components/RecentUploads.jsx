import { initialRecentUploads } from "../util/data";

function RecentUploads({ onBrowseClick }) {
  return (
    <section className="section bg-white/60 border-y border-line">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
              Freshly added
            </h2>
            <p className="text-base text-ink-dim mt-1.5 max-w-[40ch]">
              Straight from this week's batch of uploads.
            </p>
          </div>
          {onBrowseClick && (
            <button
              onClick={onBrowseClick}
              className="text-xs sm:text-sm font-bold text-violet hover:underline flex items-center gap-1 cursor-pointer self-start md:self-auto"
            >
              <span>Explore all files</span>
              <span>→</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {initialRecentUploads.map((item, idx) => (
            <div
              key={idx}
              onClick={onBrowseClick}
              className="flex items-center gap-4 bg-white border border-line rounded-2xl p-4 sm:px-5 hover:translate-x-1 hover:shadow-[0_14px_30px_-22px_rgba(22,27,51,0.35)] hover:border-blue transition-all duration-200 cursor-pointer group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-['Sora'] font-bold text-xs text-white shrink-0 shadow-sm ${
                  item.type === "DOC"
                    ? "bg-gradient-to-br from-[#4F8CFF] to-[#3E6FE0]"
                    : "bg-gradient-to-br from-[#FF8A7A] to-[#FF5252]"
                }`}
              >
                {item.type}
              </div>
              <div className="flex-1">
                <b className="block text-[15px] font-semibold text-ink group-hover:text-violet transition-colors">
                  {item.title}
                </b>
                <span className="text-[12.5px] text-ink-dim font-medium">
                  {item.meta}
                </span>
              </div>
              {item.badge && (
                <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full bg-[#EFEAFF] text-violet flex-none">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentUploads;
