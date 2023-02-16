# performance-tracker
A class that provides an easy way to track the performance of your code, then see it in string or object format.

Usage is very simple - define your actions you want to track as an array of strings and provide a namespace for the tracker for easier recognision what is being tracked.

Namespace can be any string.
Actions can be an array of any strings.

```
import PerformanceTracker from 'performance-tracker-light';

const NAMESPACE = 'Example_App';
const ACTIONS = ['action1', 'action2', 'action3'];

const tracker = new PerformanceTracker(ACTIONS, NAMESPACE);

doSlowStuff();
tracker.lap();

doMoreSlowStuff();
tracker.lap();

doEvenMoreSlowStuff();
tracker.lap();

const resultsString = tracker.toString();
const resultsObject = tracker.toObject();

console.log(resultsString);
saveWherever(resultsObject);
```
