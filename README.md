wardboss
========

wardboss decides who gets what when they ask for it. In other words, it does basic dependency injection and currying.

It will call functions for you and provide parameters to those functions. However, the parameters it provides depending on which *constituent* the function is called for.

So, if you call a function named `showJobs` for the constituent `bigjoerusty`, it will be passed the param ['committeeman']. However, if you call `showJobs` for the constituent `vrdolyak`, wardboss passes the params ['sanitation chief'], ['zoning permits'].

Let's say you have a function that takes three params, like so:

    function showJobs(jobs, owedfavors, done) {
      console.log(jobs, owedfavors);
      setTimeout(done, 0);
    }

You create a wardboss.

    var boss = wardboss.createBoss();

After that, you can register functions with wardboss, giving *providers* for each constituent. A provider takes a callback, to which it passes an array of (all or some of) the params that the function should get. 

    boss.addFn({
      fn: showJobs,
      providers: {
        bigjoerusty: function provideShowJobsArgs(done) {
          setTimeout(function callDone() {
            done(null, [['committeeman']]);
          },
          0);
        },
        vrdolyak: function provideShowJobsArgs(done) {
          setTimeout(function callDone() {
            done(null, [['sanitation chief'], ['zoning permits']]);
          },
          0);
        }
      }
    }

Then, you call the function like so. You can pass along any params that are not provided by the providers.

    boss.vrdolyak.showJobs(function doneShowingJobs(error, result) {
      console.log('The jobs and favors will have been logged.');
    });

    boss.bigjoerusty.showJobs(['look the other way'], function doneShowingJobs(error, result) {
      console.log('The jobs and favors will have been logged.');
    });

Installation
------------

    npm install wardboss

Specification
-------------

**createBoss** =>
  - Returns a `boss` object with the following methods and properties:
    - addConstituent
    - addFn
    - fns, an object with function names as the keys and functions as the values
    - $, an object that has constituent names as keys and `constituent` objects as values.
      - Each `constituent` has:
        - `providers`, a dictionary of function name keys and provider function values.

**boss.addConstituent(constituentName)** =>
  - Adds a `constituent` to `boss.$` using constituentName as the key.

**boss.addFn(opts)**
  - Where:
    - opts is an object containing:
      - `fn`, a function
      - `providers`, an object in which:
        - The keys correspond to `constituent` names
        - The values are functions that:
          - Take a callback, `done`.
          - Call it with `error`, `params`, where:
            - `params` is an array of arguments to be passed to `fn`.
  - =>
    - Adds `fn` to `boss.fns`.
    - Adds values of `providers` to `constituent`.`providers` using 'fn' name as key.
    - Adds a method with the name `fn.name` to each `constituent` with a value that is:
      - A function that calls a function using a parameters from the appropriate provider.

**boss.$.&lt;constituent c&gt;.&lt;function f&gt;(params)** =>
  - Gets provider `p` from `c`.
  - Calls `p` to get arguments, which it combines with `params` (params override arguments) and  passes to them `f`.

Tests
-----

Run tests with `make test`.

License
-------

MIT.
