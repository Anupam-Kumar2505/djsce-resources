import { useEffect } from "react";

function Notification({ message, type = "info", onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "error":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "info":
      default:
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center flex-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-violet text-white flex items-center justify-center flex-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 animate-[fadeIn_0.3s_ease-in-out] max-w-sm">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${getTypeStyles()}`}
      >
        {getIcon()}
        <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Notification;
