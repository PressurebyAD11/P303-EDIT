export interface Trend {
  id: string;
  name: string;
  tagline: string;
  keywords: string[];
  gradient: string;
  textDark: boolean;
}

export const trends: Trend[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    tagline: "Whisper, don't shout.",
    keywords: ["Cashmere", "Neutral tones", "Investment pieces"],
    gradient: "linear-gradient(145deg, #cfc4b4 0%, #b5a898 100%)",
    textDark: true,
  },
  {
    id: "corporate-ballet",
    name: "Corporate Ballet",
    tagline: "Pointed toes, sharp mind.",
    keywords: ["Ballet flats", "Tailored fits", "Soft structure"],
    gradient: "linear-gradient(145deg, #f2cccc 0%, #e0aab6 100%)",
    textDark: true,
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    tagline: "Dress like you're finishing a novel.",
    keywords: ["Layers", "Rich tones", "Structured knits"],
    gradient: "linear-gradient(145deg, #2e1f16 0%, #4a3228 100%)",
    textDark: false,
  },
  {
    id: "tomato-girl",
    name: "Tomato Girl",
    tagline: "Summer in every stitch.",
    keywords: ["Warm reds", "Linen", "Mediterranean"],
    gradient: "linear-gradient(145deg, #c03a10 0%, #e05528 100%)",
    textDark: false,
  },
  {
    id: "dopamine-dressing",
    name: "Dopamine Dressing",
    tagline: "Dress for joy.",
    keywords: ["Bold colour", "Pattern mixing", "Maximalism"],
    gradient: "linear-gradient(145deg, #f5c740 0%, #f4a040 100%)",
    textDark: true,
  },
];
