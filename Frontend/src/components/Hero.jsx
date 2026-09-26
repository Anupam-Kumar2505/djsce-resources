function Hero({ onUploadClick, onBrowseClick }) {
  const marqueeItems = [
    "CE301 · Data Structures",
    "IT204 · Database Systems",
    "EC205 · Signals & Systems",
    "AI302 · Machine Learning",
    "ME208 · Thermodynamics",
    "CE401 · Operating Systems",
    "IT303 · Computer Networks",
    "EC306 · Microprocessors",
    "AI405 · Deep Learning",
    "ME310 · Fluid Mechanics",
  ];

  return (
    <section className="relative pt-[90px] md:pt-[110px] pb-[80px] overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute w-[480px] h-[480px] rounded-full blur-[80px] opacity-45 pointer-events-none -top-[180px] -left-[160px] bg-[radial-gradient(circle,var(--violet),transparent_70%)]" />
      <div className="absolute w-[420px] h-[420px] rounded-full blur-[80px] opacity-45 pointer-events-none -top-[60px] -right-[160px] bg-[radial-gradient(circle,var(--cyan),transparent_70%)]" />

      <div className="wrap relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-violet bg-[#EFEAFF] px-3.5 py-2 rounded-full mb-6">
              ✦ Built by DJSCE students, for DJSCE students
            </span>
            <h1 className="text-[34px] sm:text-[44px] md:text-[52px] font-extrabold leading-[1.12] tracking-tight text-ink font-['Sora']">
              Every note, every paper,{" "}
              <span className="grad-text">all in one place.</span>
            </h1>
            <p className="max-w-[46ch] text-ink-dim text-base sm:text-[17px] mt-5 leading-relaxed">
              Class notes and previous-year question papers for every branch and every semester at DJSCE — organised by people who sat the same exams you're about to.
            </p>
            <div className="flex gap-3.5 mt-8 flex-wrap">
              <button
                onClick={onBrowseClick}
                className="btn-grad text-[15px] px-6 py-3.5 shadow-lg cursor-pointer"
              >
                Browse resources
              </button>
              <button
                onClick={onUploadClick}
                className="btn-ghost text-[15px] px-6 py-3.5 cursor-pointer"
              >
                Upload your notes
              </button>
            </div>
          </div>

          {/* 3D floating card stack */}
          <div className="relative h-[340px] max-md:h-[260px] max-md:mt-5 [perspective:1200px] before:content-[''] before:absolute before:-inset-12 before:rounded-full before:bg-[radial-gradient(circle,rgba(124,92,252,0.2),transparent_65%)] before:-z-10">
            {/* Card 1 */}
            <div className="absolute w-[230px] h-[150px] rounded-[20px] left-1/2 top-1/2 p-5 border border-line bg-white shadow-[0_30px_60px_-20px_rgba(22,27,51,0.25)] animate-[float1_5s_ease-in-out_infinite]">
              <div className="text-xs font-semibold text-ink-dim">Semester V</div>
              <div className="font-['Sora'] font-bold text-xl mt-2 text-ink">Notes</div>
            </div>
            {/* Card 2 */}
            <div className="absolute w-[230px] h-[150px] rounded-[20px] left-1/2 top-1/2 p-5 border border-line bg-gradient-to-br from-[#EFEAFF] to-white shadow-[0_30px_60px_-20px_rgba(22,27,51,0.25)] animate-[float2_6s_ease-in-out_infinite] [animation-delay:0.2s]">
              <div className="text-xs font-semibold text-ink-dim">2024 · BE</div>
              <div className="font-['Sora'] font-bold text-xl mt-2 text-ink">Question Papers</div>
            </div>
            {/* Card 3 */}
            <div className="absolute w-[230px] h-[150px] rounded-[20px] left-1/2 top-1/2 p-5 border-0 bg-gradient-to-r from-violet via-blue to-cyan text-white shadow-[0_30px_60px_-20px_rgba(22,27,51,0.25)] animate-[float3_5.5s_ease-in-out_infinite] [animation-delay:0.5s]">
              <div className="text-xs font-semibold text-white/80">Computer Eng.</div>
              <div className="font-['Sora'] font-bold text-xl mt-2 text-white">Solved Sets</div>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex gap-4 mt-16 flex-wrap">
          <div className="flex-1 min-w-[140px] bg-white border border-line rounded-[18px] p-5 shadow-[0_10px_24px_-18px_rgba(22,27,51,0.25)]">
            <b className="block font-bold text-2xl md:text-[26px] text-ink font-['Sora']">9</b>
            <span className="text-[13px] text-ink-dim">Departments covered</span>
          </div>
          <div className="flex-1 min-w-[140px] bg-white border border-line rounded-[18px] p-5 shadow-[0_10px_24px_-18px_rgba(22,27,51,0.25)]">
            <b className="block font-bold text-2xl md:text-[26px] text-ink font-['Sora']">4</b>
            <span className="text-[13px] text-ink-dim">Years, FE to BE</span>
          </div>
          <div className="flex-1 min-w-[140px] bg-white border border-line rounded-[18px] p-5 shadow-[0_10px_24px_-18px_rgba(22,27,51,0.25)]">
            <b className="block font-bold text-2xl md:text-[26px] text-ink font-['Sora']">2,400+</b>
            <span className="text-[13px] text-ink-dim">Notes &amp; papers</span>
          </div>
          <div className="flex-1 min-w-[140px] bg-white border border-line rounded-[18px] p-5 shadow-[0_10px_24px_-18px_rgba(22,27,51,0.25)]">
            <b className="block font-bold text-2xl md:text-[26px] text-violet font-['Sora']">Free</b>
            <span className="text-[13px] text-ink-dim">Always, no login walls</span>
          </div>
        </div>

        {/* Marquee Banner */}
        <div className="overflow-hidden mt-12 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex gap-3.5 w-max animate-[scrollx_32s_linear_infinite]">
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span
                key={idx}
                className="font-['Sora'] font-semibold text-[13px] text-ink-dim bg-white border border-line px-4 py-2.5 rounded-full whitespace-nowrap shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
