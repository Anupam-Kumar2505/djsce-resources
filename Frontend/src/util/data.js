export const years = [
  { value: "1", label: "1st Year", icon: "1️⃣" },
  { value: "2", label: "2nd Year", icon: "2️⃣" },
  { value: "3", label: "3rd Year", icon: "3️⃣" },
  { value: "4", label: "4th Year", icon: "4️⃣" },
];

// Color mapping for subjects
export const subjectColors = {
  "IOT-POA": {
    bg: "bg-blue-500/80",
    border: "border-blue-500/50",
    text: "text-white",
  },
  AI: {
    bg: "bg-emerald-500/80",
    border: "border-emerald-500/50",
    text: "text-white",
  },
  DWM: {
    bg: "bg-violet-500/80",
    border: "border-violet-500/50",
    text: "text-white",
  },
  ATCD: {
    bg: "bg-rose-500/80",
    border: "border-rose-500/50",
    text: "text-white",
  },
  ADMS: {
    bg: "bg-amber-500/80",
    border: "border-amber-500/50",
    text: "text-white",
  },
  AA: {
    bg: "bg-cyan-500/80",
    border: "border-cyan-500/50",
    text: "text-white",
  },
  CG: {
    bg: "bg-orange-500/80",
    border: "border-orange-500/50",
    text: "text-white",
  },
  HONOURS: {
    bg: "bg-teal-500/80",
    border: "border-teal-500/50",
    text: "text-white",
  },
  default: {
    bg: "bg-gray-500/80",
    border: "border-gray-500/50",
    text: "text-white",
  },
};

// Year-specific subjects - customize as needed
export const subjectsByYear = {
  1: [
    // Add 1st year subjects here when ready
  ],
  2: [
    // Add 2nd year subjects here when ready
  ],
  3: [
    { value: "IOT-POA", label: "IOT-POA", color: "bg-blue-500" },
    { value: "AI", label: "AI", color: "bg-emerald-500" },
    { value: "DWM", label: "DWM", color: "bg-violet-500" },
    { value: "ATCD", label: "ATCD", color: "bg-rose-500" },
    { value: "ADMS", label: "ADMS", color: "bg-amber-500" },
    { value: "AA", label: "AA", color: "bg-cyan-500" },
    { value: "CG", label: "CG", color: "bg-orange-500" },
    { value: "HONOURS", label: "HONOURS", color: "bg-teal-500" },
  ],
  4: [
    // Add 4th year subjects here when ready
  ],
};
