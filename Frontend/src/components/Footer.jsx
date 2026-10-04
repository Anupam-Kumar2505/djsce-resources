import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#171B35] via-[#2A2070] to-[#1B2A5C] rounded-t-[36px] mt-10 pt-16 pb-11 relative overflow-hidden text-white before:content-[''] before:absolute before:w-[320px] before:h-[320px] before:rounded-full before:bg-[radial-gradient(circle,rgba(124,92,252,0.35),transparent_70%)] before:-top-32 before:-right-16 before:pointer-events-none">
      <div className="wrap relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="max-w-md">
          <div className="font-['Sora'] font-bold text-2xl text-white tracking-tight flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-[7px] bg-grad inline-block flex-none"></span>
            <span>DJSCE Resources</span>
          </div>
          <p className="text-sm text-[#B9BEE0] mt-3 leading-relaxed">
            Built by students, for students — notes and papers for every branch, every year.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2.5 mt-6 max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@djsce.edu.in"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#9AA0C7] focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="btn-grad text-xs !py-2.5 !px-4 !rounded-xl whitespace-nowrap cursor-pointer"
            >
              {subscribed ? "Subscribed!" : "Notify me"}
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              Thank you! You'll be notified when new sets are added.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 text-sm text-[#C6CAE8]">
          <div className="flex flex-col gap-3">
            <b className="text-white font-['Sora'] text-[15px]">Navigation</b>
            <a href="#departments" className="hover:text-white transition-colors">
              Departments
            </a>
            <a href="#years" className="hover:text-white transition-colors">
              Years
            </a>
            <a href="#how" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#contribute" className="hover:text-white transition-colors">
              Contribute
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <b className="text-white font-['Sora'] text-[15px]">Community</b>
            <a href="#contribute" className="hover:text-white transition-colors">
              Upload Notes
            </a>
            <a
              href="https://github.com/Anupam-Kumar2505/djsce-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub Repository
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Report an issue
            </a>
          </div>
        </div>
      </div>

      <div className="wrap mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#9AA0C7]">
        <p>© {new Date().getFullYear()} DJSCE Resources. Made with passion for students.</p>
        <p>Independent student resource initiative.</p>
      </div>
    </footer>
  );
}

export default Footer;
