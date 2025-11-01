import type { ImagePlaceholder } from "./placeholder-images";
import { PlaceHolderImages } from "./placeholder-images";
import type { Timestamp } from "firebase/firestore";

type MemberStatus = "online" | "offline" | "away";

export interface Member {
  id: string;
  username: string;
  role: string;
  description: string;
  status: MemberStatus;
  profilePicture?: string;
  avatar?: ImagePlaceholder;
  email: string;
}

export const members: Member[] = [
  {
    id: "1",
    username: "Larry",
    role: "Field Agent Lead",
    description: "Master of diagnostics and on-site repairs. If it's broken, Larry can fix it. Usually.",
    status: "online",
    avatar: PlaceHolderImages.find((p) => p.id === "larry")!,
    email: "larry@geekforce.com"
  },
  {
    id: "2",
    username: "Sirare",
    role: "Counter Agent",
    description: "Specializes in software troubleshooting and customer education. Knows every OS inside and out.",
    status: "online",
    avatar: PlaceHolderImages.find((p) => p.id === "sirare")!,
    email: "sirare@geekforce.com"
  },
  {
    id: "3",
    username: "Vicky",
    role: "Autotech Specialist",
    description: "The go-to expert for all in-car technology, from sound systems to remote starters.",
    status: "away",
    avatar: PlaceHolderImages.find((p) => p.id === "vicky")!,
    email: "vicky@geekforce.com"
  },
  {
    id: "4",
    username: "Bernie",
    role: "Covert Agent",
    description: "Handles the most complex and sensitive home networking and security installations.",
    status: "offline",
    avatar: PlaceHolderImages.find((p) => p.id === "bernie")!,
    email: "bernie@geekforce.com"
  },
  {
    id: "5",
    username: "Phill",
    role: "PC Precinct Agent",
    description: "Builds and repairs high-performance custom PCs. A wizard with a soldering iron.",
    status: "online",
    avatar: PlaceHolderImages.find((p) => p.id === "phill")!,
    email: "phill@geekforce.com"
  },
  {
    id: "6",
    username: "Drinks",
    role: "Consultation Agent",
    description: "Helps clients design their perfect tech setup, from home theaters to smart homes.",
    status: "online",
    avatar: PlaceHolderImages.find((p) => p.id === "drinks")!,
    email: "drinks@geekforce.com"
  },
  {
    id: "7",
    username: "Frank",
    role: "Precinct Chief",
    description: "Manages precinct operations, ensuring every mission is a success. The strategic mind.",
    status: "online",
    avatar: PlaceHolderImages.find((p) => p.id === "frank")!,
    email: "frank@geekforce.com"
  },
  {
    id: "8",
    username: "Kim",
    role: "Mobile Installation",
    description: "Expert in mobile device repair and screen replacements. Has the steadiest hands on the team.",
    status: "offline",
    avatar: PlaceHolderImages.find((p) => p.id === "kim")!,
    email: "kim@geekforce.com"
  },
  {
    id: "9",
    username: "Mumo",
    role: "Data Recovery",
    description: "Recovers what was thought to be lost. If your hard drive fails, Mumo is your last hope.",
    status: "away",
    avatar: PlaceHolderImages.find((p) => p.id === "mumo")!,
    email: "mumo@geekforce.com"
  },
];

export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
}

export const tasks: Task[] = [
  {
    id: "TASK-8782",
    title: "Diagnose unresponsive home server for client in sector 7G.",
    description:
      "Client reports their home media server is not accessible on the network. Need to perform on-site diagnostics.",
    status: "Todo",
    assigneeId: "1",
    dueDate: "2024-08-05",
  },
  {
    id: "TASK-4533",
    title: "Install custom liquid cooling loop in gaming PC.",
    description:
      "High-end gaming rig requires a full custom hard-line liquid cooling setup. All parts are on-site.",
    status: "In Progress",
    assigneeId: "5",
    dueDate: "2024-08-02",
  },
  {
    id: "TASK-4478",
    title: "Data recovery from a physically damaged laptop.",
    description:
      "Laptop was dropped. Drive is not spinning up. Requires clean room environment for platter swap.",
    status: "In Progress",
    assigneeId: "9",
    dueDate: "2024-08-10",
  },
  {
    id: "TASK-3211",
    title: "Plan network infrastructure for a new smart home.",
    description:
      "Consultation with client to map out wiring, AP placement, and security camera locations for a new build.",
    status: "Todo",
    assigneeId: "6",
    dueDate: "2024-08-15",
  },
  {
    id: "TASK-9876",
    title: "Resolve OS boot loop on MacBook Pro.",
    description:
      "Customer's MacBook Pro is stuck in a boot loop after a software update. Backup data before attempting fix.",
    status: "Done",
    assigneeId: "2",
    dueDate: "2024-07-28",
  },
  {
    id: "TASK-5432",
    title: "Set up multi-zone audio system in client's residence.",
    description: "Install and configure a 4-zone Sonos system with in-ceiling speakers.",
    status: "Done",
    assigneeId: "3",
    dueDate: "2024-07-26"
  }
];

export interface ChatMessage {
  id: string;
  senderId: string;
  timestamp: Timestamp;
  content: string;
}

export const messages: ChatMessage[] = [];

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendeeIds: string[];
}

export const events: CalendarEvent[] = [];
