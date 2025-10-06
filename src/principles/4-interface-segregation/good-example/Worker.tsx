// ✅ GOOD: Segregated interfaces - classes only implement what they need

// Segregated interfaces
export interface Workable {
  work(): void;
}

export interface Eatable {
  eat(): void;
}

export interface Sleepable {
  sleep(): void;
}

export interface Breakable {
  takeBreak(): void;
}

export interface Chargeable {
  chargeBattery(): void;
}

export interface Maintainable {
  performMaintenance(): void;
}

// Human implements only human-relevant interfaces
export class HumanWorker implements Workable, Eatable, Sleepable, Breakable {
  work(): void {
    console.log("Human working...");
  }

  eat(): void {
    console.log("Human eating lunch...");
  }

  sleep(): void {
    console.log("Human sleeping...");
  }

  takeBreak(): void {
    console.log("Human taking a break...");
  }
}

// Robot implements only robot-relevant interfaces
export class RobotWorker implements Workable, Chargeable, Maintainable {
  work(): void {
    console.log("Robot working...");
  }

  chargeBattery(): void {
    console.log("Robot charging battery...");
  }

  performMaintenance(): void {
    console.log("Robot performing self-maintenance...");
  }
}

// Hybrid worker that needs both human and robot capabilities
export class CyborgWorker implements Workable, Eatable, Chargeable, Breakable {
  work(): void {
    console.log("Cyborg working...");
  }

  eat(): void {
    console.log("Cyborg consuming nutrients...");
  }

  chargeBattery(): void {
    console.log("Cyborg charging cybernetic components...");
  }

  takeBreak(): void {
    console.log("Cyborg taking a break...");
  }
}

// Functions that work with specific capabilities
export function feedWorkers(workers: Eatable[]): void {
  workers.forEach(worker => worker.eat());
}

export function chargeWorkers(workers: Chargeable[]): void {
  workers.forEach(worker => worker.chargeBattery());
}

export function assignWork(workers: Workable[]): void {
  workers.forEach(worker => worker.work());
}

// React component showing proper ISP
import React, { useState } from 'react';

export const WorkerDemo: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);

  const demonstrateISP = () => {
    const human = new HumanWorker();
    const robot = new RobotWorker();
    const cyborg = new CyborgWorker();
    
    const messages: string[] = [];
    
    // Everyone can work
    messages.push("=== Assigning work to all ===");
    assignWork([human, robot, cyborg]);
    
    // Only eatable workers can eat
    messages.push("\n=== Feeding organic workers ===");
    feedWorkers([human, cyborg]);
    
    // Only chargeable workers can charge
    messages.push("\n=== Charging electronic workers ===");
    chargeWorkers([robot, cyborg]);
    
    messages.push("\n✅ No errors! Each worker only implements what they need.");
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
          <pre className="text-sm">{output.join('\n')}</pre>
        </div>
      )}
    </div>
  );
};
