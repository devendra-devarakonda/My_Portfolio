export interface EducationItem {
  id: number;
  year: string;
  title: string;
  institution: string;
  position: { x: number; y: number };
  nodePos: { x: number; y: number };
  connectLine: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
  };
}

export const educationData: EducationItem[] = [
  {
    id: 2,
    year: "2023-2027",
    title: "Btech Computer Science & Engineering",
    institution: "Rajiv Gandhi University Of Knowledge Technologies",
    position: { x: 190, y: 320 },
    nodePos: { x: 150, y: 280 },
    connectLine: { x1: 150, y1: 280, x2: 150, y2: 330, x3: 190, y3: 330 },
  },
  {
    id: 4,
    year: "2021-2023",
    title: "Pre Univeristy Course",
    institution: "Rajiv Gandhi University Of Knowledge Technologies",
    position: { x: 190, y: 650 },
    nodePos: { x: 150, y: 600 },
    connectLine: { x1: 150, y1: 600, x2: 150, y2: 660, x3: 190, y3: 660 },
  },
  {
    id: 5,
    year: "2020-2021",
    title: "10th Standard",
    institution: "Z.p. High School, Kodavaluru",
    position: { x: 190, y: 900 },
    nodePos: { x: 150, y: 850 },
    connectLine: { x1: 150, y1: 850, x2: 150, y2: 910, x3: 190, y3: 910 },
  },
];
