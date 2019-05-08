/*
 *  appConfig
 * 
 *  
 */



// Default values
let config = {
  version: '0.0.2',
  locale: undefined, // will be set in resources.js initialization
  favorites: [],
};

try {
  const initialConfig = window.localStorage.getItem('appConfig');
  const initialConfigObject = JSON.parse(initialConfig);

  if (typeof initialConfigObject === 'object' && config.version === initialConfigObject.version) {
    // Shallow override of default values
    for (let k in config) {
      if (k in initialConfigObject) {
        config[k] = initialConfigObject[k];
      }
    }
  }
} catch (e) {}

function saveConfig() {
  window.localStorage.setItem('appConfig', JSON.stringify(config));
}

const appConfig = {
  locale: function(loc) {
    if (loc && (loc !== config.locale)) {
      config.locale = loc;
      saveConfig();
    }

    return config.locale;
  },
  favorites: function(fav) {
    if (fav) {
      config.favorites = fav;
      saveConfig();
    }

    return config.favorites;
  },
  pageResources: function() {
    return __PREPROCESS__;
  }
};

export {
  appConfig
};