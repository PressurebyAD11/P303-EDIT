export interface Trend {
  id: string;
  name: string;
  tagline: string;
  keywords: string[];
  gradient: string;
  textDark: boolean;
}

// Hardcoded for Fall — update palette each season
export const trends: Trend[] = [
  {
    id: "rust",
    name: "Rust",
    tagline: "A fall signature worth leaning into",
    keywords: ["Try this season"],
    gradient: "linear-gradient(145deg, #C85535 0%, #9A3520 100%)",
    textDark: false,
  },
  {
    id: "olive",
    name: "Olive",
    tagline: "Earthy and surprisingly versatile",
    keywords: ["Try this season"],
    gradient: "linear-gradient(145deg, #7A8C4E 0%, #556135 100%)",
    textDark: false,
  },
  {
    id: "plum",
    name: "Plum",
    tagline: "Rich, moody, deeply wearable",
    keywords: ["Try this season"],
    gradient: "linear-gradient(145deg, #6B3572 0%, #482554 100%)",
    textDark: false,
  },
  {
    id: "camel",
    name: "Camel",
    tagline: "The neutral that elevates everything",
    keywords: ["Try this season"],
    gradient: "linear-gradient(145deg, #D4904A 0%, #B87030 100%)",
    textDark: true,
  },
  {
    id: "mustard",
    name: "Mustard",
    tagline: "Bold enough to notice, easy to style",
    keywords: ["Try this season"],
    gradient: "linear-gradient(145deg, #D4A82A 0%, #B38A18 100%)",
    textDark: true,
  },
];
