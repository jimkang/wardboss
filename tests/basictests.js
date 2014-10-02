var assert = require('assert');
var wardboss = require('../wardboss');

describe('createBoss', function createBossSuite() {
  it('should create a boss object', 
    function testCreateBoss(testDone) {
      var testboss = wardboss.createBoss('testboss');
      assert.equal(typeof testboss.addConstituent, 'function');
      assert.equal(typeof testboss.addFn, 'function');
      assert.equal(typeof testboss.fns, 'object');
      testDone();
    }
  );
});

describe('addConstituent', function addConstituentSuite() {
  it('should add a constituent to the boss using constituentName as the key', 
    function testAddConstituentToBoss(testDone) {
      var boss = wardboss.createBoss('Ed');
      boss.addConstituent('ventra');
      assert.equal(typeof boss.ventra, 'object');
      assert.equal(typeof boss.ventra.providers, 'object');
      testDone();
    }
  );
});

describe('addFn', function addFnSuite() {  
  it('should add `fn` to boss.fns', 
    function testAddConstituentToBoss(testDone) {
      var boss = wardboss.createBoss('rusty');

      function getConstructionDeals(opts) {
        var deals = [];
        if (opts.zone === 'municipal') {
          deals = ['sewage', 'bus shelters'];
        }
        else if (opts.zone === 'commercial') {
          deals = ['rail yard', 'fictional project'];
        }
        setTimeout(function passBack() {
          opts.done(null, deals);
        }, 
        0);
      }

      function dealParamsForBackOfTheYards(done) {
        setTimeout(function callDone() {
          done(null, [{
            zone: 'municipal'
          }]);
        },
        0);
      }

      function dealParamsForCicero(done) {
        setTimeout(function callDone() {
          done(null, [{
            zone: 'commercial'
          }]);
        },
        0);
      }

      boss.addFn({
        fn: getConstructionDeals,
        providers: {
          'Back of the Yards': dealParamsForBackOfTheYards,
          Cicero: dealParamsForCicero
        }
      });

      assert.equal(typeof boss.fns.getConstructionDeals, 'function',
        'getConstructionDeals function was not added to boss.fns.'
      );

      assert.ok(
        getConstructionDeals.name in boss['Back of the Yards'].providers,
        'No provider added to Back of the Yards for getConstructionDeals'
      );

      assert.ok(
        getConstructionDeals.name in boss.Cicero.providers,
        'No provider added to Cicero for getConstructionDeals'
      );

      assert.deepEqual(boss['Back of the Yards'].getConstructionDeals, 
        dealParamsForBackOfTheYards,
        'Back of the Yards provider for getConstructionDeals not added.'
      );

      assert.deepEqual(boss.Cicero.getConstructionDeals, 
        dealParamsForCicero,
        'Cicero provider for getConstructionDeals not added.'
      );

      assert.ok(getConstructionDeals.name in boss['Back of the Yards']);
      assert.ok(getConstructionDeals.name in boss.Cicero);
      assert.equal(
        typeof boss['Back of the Yards'].getConstructionDeals, 'function'
      );
      assert.equal(typeof boss.Cicero.getConstructionDeals, 'function');

      testDone();
    }
  );
});
