// ✅ GOOD: Segregated interfaces - classes only implement what they need

// Segregated interfaces
export interface Workable {
  work(): string;
}

export interface Eatable {
  eat(): string;
}

export interface Sleepable {
  sleep(): string;
}

export interface Breakable {
  takeBreak(): string;
}

export interface Chargeable {
  chargeBattery(): string;
}

export interface Maintainable {
  performMaintenance(): string;
}

// Human implements only human-relevant interfaces
export class HumanWorker implements Workable, Eatable, Sleepable, Breakable {
  work(): string {
    return "Human working...";
  }

  eat(): string {
    return "Human eating lunch...";
  }

  sleep(): string {
    return "Human sleeping...";
  }

  takeBreak(): string {
    return "Human taking a break...";
  }
}

// Robot implements only robot-relevant interfaces
export class RobotWorker implements Workable, Chargeable, Maintainable {
  work(): string {
    return "Robot working...";
  }

  chargeBattery(): string {
    return "Robot charging battery...";
  }

  performMaintenance(): string {
    return "Robot performing self-maintenance...";
  }
}

// Hybrid worker that needs both human and robot capabilities
export class CyborgWorker implements Workable, Eatable, Chargeable, Breakable {
  work(): string {
    return "Cyborg working...";
  }

  eat(): string {
    return "Cyborg consuming nutrients...";
  }

  chargeBattery(): string {
    return "Cyborg charging cybernetic components...";
  }

  takeBreak(): string {
    return "Cyborg taking a break...";
  }
}

// Functions that work with specific capabilities
export function feedWorkers(workers: Eatable[]): string[] {
  return workers.map((worker) => worker.eat());
}

export function chargeWorkers(workers: Chargeable[]): string[] {
  return workers.map((worker) => worker.chargeBattery());
}

export function assignWork(workers: Workable[]): string[] {
  return workers.map((worker) => worker.work());
}

// React component showing proper ISP
import React, { useState } from "react";

export const WorkerDemo: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);

  const demonstrateISP = () => {
    const human = new HumanWorker();
    const robot = new RobotWorker();
    const cyborg = new CyborgWorker();

    const messages: string[] = [];

    // Everyone can work
    messages.push("=== Assigning work to all ===");
    messages.push(...assignWork([human, robot, cyborg]));

    // Only eatable workers can eat
    messages.push("\n=== Feeding organic workers ===");
    messages.push(...feedWorkers([human, cyborg]));

    // Only chargeable workers can charge
    messages.push("\n=== Charging electronic workers ===");
    messages.push(...chargeWorkers([robot, cyborg]));

    messages.push(
      "\n✅ No errors! Each worker only implements what they need.",
    );
    setOutput(messages);
  };

  return (
    <div className="p-4">
      <button
        onClick={demonstrateISP}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Demonstrate Proper ISP
      </button>
      {output.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm">{output.join("\n")}</pre>
        </div>
      )}
    </div>
  );
};
