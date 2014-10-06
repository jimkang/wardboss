var _ = require('lodash');
var masala = require('masala');

function createBoss(bossname) {
  var boss = {
    addConstituent: addConstituent,
    addFn: addFn,
    fns: {},
    $: {}
  };

  function addConstituent(constituentName) {
    boss.$[constituentName] = {
      providers: {}
    };
  }

  function addConstituentIfNotThere(constituentName) {
    if (!(constituentName in boss.$)) {
      addConstituent(constituentName);
    }
  }

  function addFnProviderForConstituent(fn, provider, constituent) {
    boss.$[constituent].providers[fn.name] = provider;
  }

  function addFnCallerToConstituent(fn, constituentName) {
    var constituent = boss.$[constituentName];
    constituent[fn.name] = callFnWithProvider

    function callFnWithProvider(overrideOpts) {
      var provider = constituent.providers[fn.name];
      provider(function passParamsToFn(error, params) {
        // var opts = _.defaults(overrideOpts, params);
        var masalaResult = masala.apply(masala, [fn].concat(params));
        // PROBLEM: What if the function returns another function?
        if (typeof masalaResult === 'function') {
          masalaResult = masalaResult(overrideOpts);
        }
        if (typeof masalaResult === 'function') {
          masalaResult = masalaResult();
        }
        return masalaResult;
      });
    };
  }

  function addFn(opts) {
    boss.fns[opts.fn.name] = opts.fn;

    _.keys(opts.providers).forEach(addConstituentIfNotThere);

    var addProviderForConstituent = 
      _.curry(addFnProviderForConstituent)(opts.fn);

    _.each(opts.providers, addProviderForConstituent);

    var addCaller = _.curry(addFnCallerToConstituent)(opts.fn);
    _.keys(boss.$).forEach(addCaller);
  }

  return boss;
}

module.exports = {
  createBoss: createBoss
};
