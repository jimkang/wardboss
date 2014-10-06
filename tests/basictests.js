var assert = require('assert');
var wardboss = require('../wardboss');
var sinon = require('sinon');

// Functions and providers for the tests.

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


// The actual tests.

describe('createBoss', function createBossSuite() {
  it('should create a boss object', 
    function testCreateBoss(testDone) {
      var testboss = wardboss.createBoss('testboss');
      assert.equal(typeof testboss.addConstituent, 'function');
      assert.equal(typeof testboss.addFn, 'function');
      assert.equal(typeof testboss.fns, 'object');
      assert.equal(typeof testboss.$, 'object');
      testDone();
    }
  );
});

describe('addConstituent', function addConstituentSuite() {
  it('should add a constituent to the boss using constituentName as the key', 
    function testAddConstituentToBoss(testDone) {
      var boss = wardboss.createBoss('Ed');
      boss.addConstituent('ventra');
      assert.equal(typeof boss.$.ventra, 'object');
      assert.equal(typeof boss.$.ventra.providers, 'object');
      testDone();
    }
  );
});

describe('addFn', function addFnSuite() {  
  it('should add `fn` to boss.fns', 
    function testAddConstituentToBoss(testDone) {
      var boss = wardboss.createBoss('rusty');

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
        getConstructionDeals.name in boss.$['Back of the Yards'].providers,
        'No provider added to Back of the Yards with getConstructionDeals key'
      );

      assert.ok(
        getConstructionDeals.name in boss.$.Cicero.providers,
        'No provider added to Cicero with getConstructionDeals key'
      );

      assert.deepEqual(
        boss.$['Back of the Yards'].providers[getConstructionDeals.name],
        dealParamsForBackOfTheYards,
        'Incorrect provider for Back of the Yards and getConstructionDeals'
      );

      assert.deepEqual(
        boss.$.Cicero.providers[getConstructionDeals.name],
        dealParamsForCicero,
        'Incorrect provider for Cicero and getConstructionDeals'
      );

      assert.ok(
        getConstructionDeals.name in boss.$['Back of the Yards'],
        'Did not add caller function named after getConstructionDeals to ' + 
        'Back of the Yards'
      );
      assert.ok(
        getConstructionDeals.name in boss.$.Cicero,
        'Did not add caller function named after getConstructionDeals to ' + 
        'Cicero'
      );

      assert.equal(
        typeof boss.$['Back of the Yards'].getConstructionDeals, 'function'
      );
      assert.equal(typeof boss.$.Cicero.getConstructionDeals, 'function');

      testDone();
    }
  );
});

describe('run function', function runFnSuite() {  
  var sandbox;
  var boss;
  var botyProviderSpy;
  var ciceroProviderSpy;

  beforeEach(function setUp() {
    sandbox = sinon.sandbox.create();
    botyProviderSpy = sandbox.spy(dealParamsForBackOfTheYards);
    ciceroProviderSpy = sandbox.spy(dealParamsForCicero);
    getConstructionDealsSpy = sandbox.spy(getConstructionDeals);

    boss = wardboss.createBoss('vrdolyak');

    boss.addFn({
      fn: getConstructionDeals,
      providers: {
        'Back of the Yards': dealParamsForBackOfTheYards,
        Cicero: dealParamsForCicero
      }
    });
  });

  afterEach(function tearDown() {
    sandbox.restore();

    boss = null;
    botyProviderSpy = null;
    ciceroProviderSpy = null;
  });

  it('should call fn using the params from the Cicero provider',
    function testRunFn(testDone) {

      boss.$.Cicero.getConstructionDeals({
        done: checkCiceroFnCallOnNextTick
      });

      function checkCiceroFnCallOnNextTick(error, deals) {
        process.nextTick(function doCheck() {
          checkCiceroFnCall(error, deals);
        });
      }

      function checkCiceroFnCall(error, deals) {
        debugger;
        assert.ok(ciceroProviderSpy.calledOnce, 
          'The Cicero provider for getConstructionDeals was not called once.'
        );
        assert.equal(
          getConstructionDealsSpy.getCall(0).args.zone, 'commercial',
          'getConstructionDeals was not called with opts from provider.'
        );
        testDone();
      }
    }
  );

});
