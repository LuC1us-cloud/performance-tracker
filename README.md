# performance-tracker-light

**PerformanceTracker** is a Typescript module that makes it easy to track the performance of your code. It provides a simple way to define actions you want to track as an array of strings, and then see the results in either string or object format.

## Getting started

To get started, simply import the PerformanceTracker class from the `'performance-tracker-light'` module. Then, define a namespace for the tracker and an array of actions you want to track.

```Typescript
import PerformanceTracker from 'performance-tracker-light';

const NAMESPACE = 'Example_App';
const ACTIONS = ['action1', 'action2', 'action3'];

const tracker = new PerformanceTracker(ACTIONS, NAMESPACE);
```

Once you have defined your tracker, you can start tracking the performance of your code. To do this, simply call the `lap()` method on the tracker after each action you want to track.

```Typescript
doSlowStuff();
tracker.lap();

doMoreSlowStuff();
tracker.lap();

doEvenMoreSlowStuff();
tracker.lap();
```

After you have finished tracking your code, you can see the results in either string or object format. To get the results as a string, simply call the `toString()` method on the tracker.

```Typescript
const resultsString = tracker.toString();
console.log(resultsString);
```

To get the results as an object, simply call the `toObject()` method on the tracker.

```Typescript
const resultsObject = tracker.toObject();
saveWherever(resultsObject);
```

That's it! With PerformanceTracker, you can easily track the performance of your code and see the results in a format that works best for you.
