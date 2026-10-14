import { WorkshopCapabilityLab } from "./principles/4-interface-segregation/advanced/WorkshopCapabilityLab";
import { GeometryContractLab } from "./principles/3-liskov-substitution/advanced/GeometryContractLab";
import { DispatchLab } from "./principles/2-open-closed/advanced/DispatchLab";
import type { ComponentType } from "react";
import { ProfileDemo } from "./principles/1-single-responsibility/good-example/UserProfile";
import { NotificationSender } from "./principles/2-open-closed/good-example/NotificationService";
import { ShapeDemo } from "./principles/3-liskov-substitution/good-example/Shapes";
import { WorkerDemo } from "./principles/4-interface-segregation/good-example/Worker";
import { OrderManager } from "./principles/5-dependency-inversion/good-example/OrderService";

const documents = import.meta.glob<string>("./principles/*/README.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const exercises = import.meta.glob<string>(
  "./principles/*/exercise/README.md",
  { query: "?raw", import: "default", eager: true },
);
const sources = import.meta.glob<string>(
  "./principles/*/{bad-example,good-example}/*.tsx",
  { query: "?raw", import: "default", eager: true },
);
const solutions = import.meta.glob<string>("./principles/*/SOLUTION.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

interface Lesson {
  id: number;
  slug: string;
  title: string;
  setting: string;
  question: string;
  beforeFile: string;
  afterFile: string;
  demo: ComponentType;
  lab?: ComponentType;
  labLabel?: string;
}
export const lessons: readonly Lesson[] = [
  {
    id: 1,
    slug: "single-responsibility",
    title: "Single Responsibility",
    setting: "Contact desk",
    question: "Where should this change belong?",
    beforeFile: "UserProfile",
    afterFile: "UserProfile",
    demo: ProfileDemo,
  },
  {
    id: 2,
    slug: "open-closed",
    title: "Open/Closed",
    setting: "Dispatch room",
    question: "Which algorithm stays stable when we add a channel?",
    beforeFile: "NotificationService",
    afterFile: "NotificationService",
    demo: NotificationSender,
    lab: DispatchLab,
  },
  {
    id: 3,
    slug: "liskov-substitution",
    title: "Liskov Substitution",
    setting: "Geometry bench",
    question: "Does every implementation keep the caller’s promise?",
    beforeFile: "Shapes",
    afterFile: "Shapes",
    demo: ShapeDemo,
    lab: GeometryContractLab,
    labLabel: "Contract Lab",
  },
  {
    id: 4,
    slug: "interface-segregation",
    title: "Interface Segregation",
    setting: "Workshop roster",
    question: "What does this consumer actually need?",
    beforeFile: "Worker",
    afterFile: "Worker",
    demo: WorkerDemo,
    lab: WorkshopCapabilityLab,
    labLabel: "Capability Lab",
  },
  {
    id: 5,
    slug: "dependency-inversion",
    title: "Dependency Inversion",
    setting: "Order counter",
    question: "Can we replace the supplier without changing the policy?",
    beforeFile: "OrderService",
    afterFile: "OrderService",
    demo: OrderManager,
  },
];
export function lessonPath(lesson: Lesson): string {
  return `/principle/${lesson.id}-${lesson.slug}`;
}
export function lessonContent(lesson: Lesson) {
  const folder = `./principles/${lesson.id}-${lesson.slug}`;
  const required = (value: string | undefined, label: string) => {
    if (!value?.trim()) throw new Error(`Missing ${label} for ${lesson.slug}`);
    return value;
  };
  return {
    guide: required(documents[`${folder}/README.md`], "guide"),
    exercise: required(exercises[`${folder}/exercise/README.md`], "exercise"),
    before: required(
      sources[`${folder}/bad-example/${lesson.beforeFile}.tsx`],
      "before source",
    ),
    after: required(
      sources[`${folder}/good-example/${lesson.afterFile}.tsx`],
      "after source",
    ),
    solution: solutions[`${folder}/SOLUTION.md`],
  };
}
