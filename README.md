wardboss
========

wardboss decides who gets what when they ask for it. In other words, it does incredibly basic dependency injection.

    function showJobs(jobs, owedfavors, done) {
      console.log(jobs, owedfavors);
      setTimeout(done, 0);
    }

    var boss = wardboss.createBoss();
    boss.addConstituent('bigjoerusty');
    boss.addConstituent('vrdolyak');

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
            done(null, [['sanitation chief'], ['zoning permits']]]);
          },
          0);
        }
      }
    }

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

**boss.addConstituent(constituentName)** =>
  - Adds a `constituent` to `boss` using constituentName as the key.
    - Each `constituent` has:
      - `providers`, a dictionary of function name keys and provider function values.

**boss.addFn(opts)
  Where:
    - opts is an object containing:
      - `fn`, a function
      - `providers`, an object in which:
        - The keys correspond to `constituent` names
        - The values are functions that:
          - Take a callback, `done`.
          - Call it with `error`, `params`, where:
            - `params` is an array of arguments to be passed to `fn`.
  =>
    - Adds `fn` to `boss.fns`.
    - Adds values of `providers` to `constituent`.`providers` using values' function names as keys.
    - Adds a method with the name `fn.name` to each `constituent` with a value that is:
      - A function that calls a function using a parameters from the appropriate provider.

**boss.<constituent c>.<function f>(params)** =>
  - Gets provider `p` from `c`.
  - Calls `p` to get arguments, which it passes to `f`.

Tests
-----

Run tests with `make test`.

License
-------

MIT.
