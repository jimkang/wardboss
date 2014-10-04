var _ = require('lodash');

function createBoss(bossname) {
  var boss = {
    addConstituent: addConstituent,
    addFn: addFn,
    fns: {}
  };

  function addConstituent(constituentName) {
    boss[constituentName] = {
      providers: {}
    };
  }

  function addConstituentIfNotThere(constituentName) {
    if (!(constituentName in boss)) {
      addConstituent(constituentName);
    }
  }

  function addFnProviderForConstituent(fn, provider, constituent) {
    boss[constituent].providers[fn.name] = provider;
  }

  function addFn(opts) {
    boss.fns[opts.fn.name] = opts.fn;

    _.keys(opts.providers).forEach(addConstituentIfNotThere);

    var addProviderForConstituent = 
      _.curry(addFnProviderForConstituent)(opts.fn);

    _.each(opts.providers, addProviderForConstituent);
  }

  return boss;
}

module.exports = {
  createBoss: createBoss
};
