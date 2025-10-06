// ❌ BAD: Fat interface that forces implementations to have methods they don't need

export interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  takeBreak(): void;
  chargeBattery(): void;
  performMaintenance(): void;
}

// Human worker is forced to implement robot-specific methods
export class HumanWorker implements Worker {
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

  // ❌ Forced to implement methods that don't make sense
  chargeBattery(): void {
    throw new Error("Humans don't have batteries!");
  }

  performMaintenance(): void {
    throw new Error("Humans don't need maintenance!");
  }
}

// Robot worker is forced to implement human-specific methods
export class RobotWorker implements Worker {
  work(): void {
    console.log("Robot working...");
  }

  // ❌ Forced to implement methods that don't make sense
  eat(): void {
    throw new Error("Robots don't eat!");
  }

  sleep(): void {
    throw new Error("Robots don't sleep!");
  }

  takeBreak(): void {
    throw new Error("Robots don't take breaks!");
  }

  chargeBattery(): void {
    console.log("Robot charging battery...");
  }

  performMaintenance(): void {
    console.log("Robot performing self-maintenance...");
  }
}

// React component showing the problem
import React, { useState } from 'react';

export const WorkerDemo: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const testHumanWorker = () => {
    const human = new HumanWorker();
    const newErrors: string[] = [];
    
    try {
      human.work();
      human.eat();
      human.chargeBattery(); // This will throw!
    } catch (e: any) {
      newErrors.push(e.message);
    }
    
    setErrors(newErrors);
  };

  const testRobotWorker = () => {
    const robot = new RobotWorker();
    const newErrors: string[] = [];
    
    try {
      robot.work();
      robot.chargeBattery();
      robot.eat(); // This will throw!
    } catch (e: any) {
      newErrors.push(e.message);
    }
    
    setErrors(newErrors);
  };

  return (
    <div className="p-4">
      <div className="space-x-2">
        <button onClick={testHumanWorker} className="px-4 py-2 bg-blue-500 text-white rounded">
          Test Human Worker
        </button>
        <button onClick={testRobotWorker} className="px-4 py-2 bg-green-500 text-white rounded">
          Test Robot Worker
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-4">
          <p className="text-red-600 font-bold">Errors (ISP Violation):</p>
          {errors.map((error, i) => (
            <p key={i} className="text-red-500">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};
