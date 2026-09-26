function CtaBand({ onUploadClick }) {
  return (
    <section className="section !pt-0 !pb-14" id="contribute">
      <div className="wrap">
        <div className="rounded-[28px] bg-gradient-to-r from-violet via-blue to-cyan relative overflow-hidden shadow-[0_16px_36px_-12px_rgba(79,140,255,0.45)] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_60%)] after:pointer-events-none">
          <div className="relative z-10 py-10 px-7 sm:py-14 sm:px-12 flex items-center justify-between gap-7 flex-wrap">
            <h2 className="text-white font-bold font-['Sora'] text-2xl sm:text-3xl leading-tight max-w-[22ch]">
              Have notes worth sharing? Add them for the next batch.
            </h2>
            <button
              onClick={onUploadClick}
              className="bg-white text-violet px-7 py-3.5 text-[15px] font-bold rounded-2xl shadow-md hover:brightness-95 hover:-translate-y-0.5 active:scale-95 transition-all border-0 cursor-pointer whitespace-nowrap"
            >
              Upload a resource
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
