function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Pick department & year",
      desc: "Nine branches, four years each — go straight to your semester.",
    },
    {
      num: "2",
      title: "Open notes or papers",
      desc: "Unit-wise class notes and previous-year question papers, subject by subject.",
    },
    {
      num: "3",
      title: "Download & study",
      desc: "Save it, print it, or read it on your phone the night before. It's yours.",
    },
  ];

  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight text-ink">
              How it works
            </h2>
            <p className="text-base text-ink-dim mt-1.5 max-w-[40ch]">
              No sign-ups, no paywalls — three steps between you and the file you need.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-[20px] p-7 border border-line shadow-[0_12px_28px_-22px_rgba(22,27,51,0.2)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet via-blue to-cyan text-white font-['Sora'] font-bold flex items-center justify-center mb-4.5 shadow-[0_6px_16px_-4px_rgba(124,92,252,0.4)]">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-ink">
                {step.title}
              </h3>
              <p className="text-ink-dim text-[14.5px] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
