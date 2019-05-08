/*
 *  localizeable resources
 * 
 * usage: resources.get('this.that.finally')
 */

import { appConfig } from './appConfig';

import { resources as enResrouces } from '../locales/en/resources/resources';
import { resources as esResources } from '../locales/es/resources/resources';
import { resources as frResources } from '../locales/fr/resources/resources';
import { resources as swResources } from '../locales/sw/resources/resources';

var resources_data = {
  en: enResrouces,
  es: esResources,
  fr: frResources,
  sw: swResources
};

const locale = appConfig.locale();

function bestBrowserLocale() {
  const lang = window.navigator.language;

  if (!lang) return 'en';
  const langtags = lang.toLocaleLowerCase().split('-');
  // check most specific to least specific
  for(let i = langtags.length; i > 0; i--) {
    const langtag = langtags.slice(0, i).join('-');
    if (resources_data[langtag]) return langtag;
  }

  return 'en';
}

// Reset locale to default if needed.
if (!locale || !resources_data[locale]) {
  appConfig.locale(bestBrowserLocale());
}

const pageResources = appConfig.pageResources();

// Extract resources compiled out from page contents
for (let k in pageResources) {
  resources_data[k].pages = pageResources[k];
}

const languages = [{
    language: 'English',
    language_code: 'en'
  },
  {
    language: 'Français',
    language_code: 'fr'
  },
  {
    language: 'Español',
    language_code: 'es'
  },
  {
    language: 'Kiswahili',
    language_code: 'sw'
  }
];

const resources = {
  get: function(path, optLocale) {
    const locale = optLocale || appConfig.locale();
    const pathElements = path.split('.');

    let context = resources_data[locale];

    pathElements.forEach(function(pathComponent) {
      if (context) {
        context = context[pathComponent];
      }
    });

    return context;
  },
  getLanguages() {
    return languages;
  }
};

export {
  resources
};