function Features() {
  const features = [
    {
      icon: "✓",
      title: "Verified by seniors",
      desc: "Every upload is checked against the syllabus before it goes live — no stray or mislabeled files.",
    },
    {
      icon: "⚡",
      title: "Fast to find",
      desc: "Filter by department, year and subject in three taps — no folders within folders.",
    },
    {
      icon: "☁",
      title: "Works anywhere",
      desc: "Phone, laptop, library computer — everything opens and downloads without an app.",
    },
  ];

  return (
    <section className="section bg-white/40 border-t border-line">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
              Why students keep coming back
            </h2>
            <p className="text-base text-ink-dim mt-1.5 max-w-[40ch]">
              Built around exam week, not around a login screen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[20px] p-7 border border-line shadow-[0_12px_28px_-22px_rgba(22,27,51,0.2)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-r from-violet via-blue to-cyan text-white flex items-center justify-center text-2xl shadow-[0_12px_24px_-10px_rgba(124,92,252,0.5)] mb-4.5">
                {feat.icon}
              </div>
              <h3 className="text-[17.5px] font-semibold mb-2 text-ink">
                {feat.title}
              </h3>
              <p className="text-ink-dim text-[14.5px] leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
