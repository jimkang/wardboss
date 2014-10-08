var _ = require('lodash');

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

    function callFnWithProvider() {
      var extemporaneousParams = Array.prototype.slice.call(arguments, 0);
      var extemporaneousOpts;

      if (extemporaneousParams.length === 1 && 
        typeof extemporaneousParams[0] === 'object') {
        extemporaneousOpts = extemporaneousParams[0];
      }

      var provider = constituent.providers[fn.name];
      provider(function passParamsToFn(error, params) {
        var result;

        if (typeof params === 'object') {
          if (Array.isArray(params)) {
            // Assumes fn takes a "normal" list of arguments.            
            var curried = _.curry(fn);
            result = curried.apply(curried, params.concat(extemporaneousParams));
          }
          else {
            // Assumes fn to be an opts-based function.
            var opts = _.defaults(extemporaneousOpts, params);
            result = fn(opts);
          }
        }
        else {
          // Just try to run it with the non-object params.
          result = fn(params);
        }
        // var masalaResult = masala.apply(masala, [fn].concat(params));
        // // PROBLEM: What if the function returns another function?
        // if (typeof masalaResult === 'function') {
        //   masalaResult = masalaResult(overrides);
        // }
        // if (typeof masalaResult === 'function') {
        //   masalaResult = masalaResult();
        // }
        // return masalaResult;
        return result;
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
