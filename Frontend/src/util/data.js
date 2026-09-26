export const years = [
  { value: "1", code: "FE", label: "First Year", subtitle: "First Year · all branches", className: "y1" },
  { value: "2", code: "SE", label: "Second Year", subtitle: "Second Year · all branches", className: "y2" },
  { value: "3", code: "TE", label: "Third Year", subtitle: "Third Year · all branches", className: "y3" },
  { value: "4", code: "BE", label: "Final Year", subtitle: "Final Year · all branches", className: "y4" },
];

export const types = [
  { value: "Class Notes", label: "Class Notes" },
  { value: "Term Test Papers", label: "Term Test Papers" },
  { value: "Final Papers", label: "Final Papers" },
];

export const departments = [
  { code: "COMPS", name: "Computer Engineering", count: "FE–BE · 480 files" },
  { code: "IT", name: "Information Technology", count: "FE–BE · 410 files" },
  { code: "CSEDS", name: "Computer Science and Engineering (Data Science)", count: "FE-BE · 100 files" },
  { code: "AIML", name: "Artificial Intelligence and Machine Learning", count: "FE–BE · 205 files" },
  { code: "AIDS", name: "Artificial Intelligence and Data Science", count: "FE–BE · 260 files" },
  { code: "CSEICB", name: "Computer Science and Engineering (IoT and Cyber Security with Blockchain Technology)", count: "FE-BE · 100 files" },
  { code: "EXTC", name: "Electronics & Telecommuication Engineering", count: "FE–BE · 340 files" },
  { code: "MECH", name: "Mechanical Engineering", count: "FE–BE · 300 files" },
];

export const initialRecentUploads = [
  {
    title: "Operating Systems — Unit 4 notes",
    meta: "Computer Engineering · TE · 2h ago",
    type: "PDF",
    badge: "New",
    badgeClass: "f-pdf",
  },
  {
    title: "Signals & Systems — 2023 question paper",
    meta: "EXTC · SE · Yesterday",
    type: "PDF",
    badge: "New",
    badgeClass: "f-pdf",
  },
  {
    title: "Thermodynamics — solved numericals",
    meta: "Mechanical · SE · 2 days ago",
    type: "DOC",
    badgeClass: "f-doc",
  },
  {
    title: "Machine Learning — Unit 2 notes",
    meta: "AI & Data Science · TE · 3 days ago",
    type: "PDF",
    badgeClass: "f-pdf",
  },
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
