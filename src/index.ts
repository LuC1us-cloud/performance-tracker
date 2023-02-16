import { Console } from 'console';
import { Transform } from 'stream';
import ActionDuration from './actionDuration';

const ts = new Transform({
  transform(chunk: any, enc: any, cb: (arg0: null, arg1: any) => void) {
    cb(null, chunk);
  },
});
const logger = new Console({ stdout: ts });

function timeTable(data: any[]) {
  const newData = data.map((item: { duration: number }) => {
    return {
      ...item,
      duration: isNaN(item.duration) ? item.duration : item.duration + ' ms',
    };
  });
  logger.table(newData);
  let result = (ts.read() || '').toString();
  return result ? `\n${result}` : '';
}

function regularTable(data: { [x: string]: any }) {
  const newData = Object.keys(data).reduce((acc, key) => {
    if (data[key] instanceof Date) {
      acc[key as keyof Object] = data[key].toISOString();
    } else {
      // if the value is a string, longer than 50 characters, truncate it
      if (typeof data[key] === 'string' && data[key].length > 20) {
        acc[key as keyof Object] = (data[key].substring(0, 20) + '...') as any;
      } else {
        acc[key as keyof Object] = data[key];
      }
    }
    return acc;
  }, {});

  logger.table(newData);
  let result = (ts.read() || '').toString();
  return result ? `\n${result}` : '';
}

const fakeConsole = {
  timeTable: timeTable,
  table: regularTable,
};

class PerformanceTracker {
  private readonly _namespace: string = '';
  private _trackers: ActionDuration[];

  constructor(trackers: string[], namespace: string, started: boolean = true) {
    this._trackers = trackers.map((tracker) => {
      return {
        action: tracker,
        startTimestamp: NaN,
        endTimestamp: NaN,
        duration: NaN,
      };
    });
    this._namespace = namespace;
    if (started) {
      this.start();
    }
  }

  public get namespace(): string {
    return this._namespace;
  }

  /**
   * starts the next tracker or the tracker with the given action name
   * @param action
   * @returns void
   */
  public start(action?: string) {
    if (action) {
      this._trackers.forEach((tracker) => {
        if (tracker.action === action) {
          tracker.startTimestamp = Date.now();
        }
      });
      return;
    }

    // find the first tracker that hasn't been started yet
    const tracker = this._trackers.find((tracker) => isNaN(tracker.startTimestamp));
    if (tracker) {
      tracker.startTimestamp = Date.now();
    }
  }

  /**
   * Start all trackers that haven't been started yet
   * @returns void
   */
  public startAll() {
    // start all trackers, which haven't been started yet
    this._trackers.forEach((tracker) => {
      if (isNaN(tracker.startTimestamp)) {
        tracker.startTimestamp = Date.now();
      }
    });
  }

  /**
   * Stop the current tracker or the tracker with the given action name
   * @param action
   * @returns void
   */
  public stop(action?: string) {
    if (action) {
      this._trackers.forEach((tracker) => {
        if (tracker.action === action) {
          tracker.endTimestamp = Date.now();
          tracker.duration = tracker.endTimestamp - tracker.startTimestamp;
        }
      });
      return;
    }

    // find the first tracker that hasn't been stopped yet
    const tracker = this._trackers.find((tracker) => isNaN(tracker.endTimestamp));
    if (tracker) {
      tracker.endTimestamp = Date.now();
      tracker.duration = tracker.endTimestamp - tracker.startTimestamp;
    }
  }

  /**
   * Stop the current tracker and start the next one
   * @returns void
   */
  public stopAndStart() {
    this.stop();
    this.start();
  }

  /**
   * Stop the current tracker and start the next one
   * @returns void
   * @see stopAndStart
   */
  public lap() {
    this.stopAndStart();
  }

  public stopAll() {
    // stop all trackers, which haven't been stopped yet
    this._trackers.forEach((tracker) => {
      if (isNaN(tracker.endTimestamp)) {
        tracker.endTimestamp = Date.now();
        tracker.duration = tracker.endTimestamp - tracker.startTimestamp;
      }
    });
  }

  public getTrackers() {
    return this._trackers;
  }

  public getTracker(action: string) {
    return this._trackers.find((tracker) => tracker.action === action);
  }

  /**
   * Returns a formatted string of the tracker table
   * @param total if true, the total duration will be added to the table
   * @returns string
   */
  public toString(total: boolean = false): string {
    return fakeConsole.timeTable(this.toObject(total)).trim();
  }

  /**
   * Returns an object of the tracker table
   * @param total if true, the total duration will be added to the table
   * @returns object[]
   */
  public toObject(total: boolean = false): object[] {
    let totalDuration = 0;
    const objArray = this._trackers.map((tracker) => {
      if (!isNaN(tracker.duration)) {
        totalDuration += tracker.duration;
      }
      return {
        namespace: this._namespace,
        action: tracker.action,
        duration: tracker.duration,
      };
    });
    if (total) {
      objArray.push({
        namespace: this._namespace,
        action: 'Total duration',
        duration: totalDuration,
      });
    }
    return objArray;
  }

  /**
   * Returns a boolean indicating if all trackers have been stopped
   * @returns boolean
   */
  public isAllStopped(): boolean {
    return this._trackers.every((tracker) => !isNaN(tracker.endTimestamp));
  }
}

export default PerformanceTracker;
export { regularTable, timeTable };
