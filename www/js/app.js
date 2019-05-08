/*
 *  Safe Birth
 *  Copyright Hesperian Health Guides 2017-2018
 *
 */

//import Framework7, { Dom7, Template7 } from 'framework7';
import Framework7, {
  Dom7,
  Template7
} from 'framework7/framework7.esm.bundle.js';

import {
  appTemplates
} from './appTemplates';

import 'framework7-icons';
import '../../node_modules/material-icons/iconfont/material-icons.css';

/*
import VirtualList from 'framework7/components/virtual-list/virtual-list.js';
import Swiper from 'framework7/components/swiper/swiper.js';
*/

import {
  resources
} from './resources';
import {
  createRoutes
} from './routes';
import '../css/styles.scss';
import {
  appConfig
} from './appConfig';

import {
  createSearchList,
  createSearchBar
} from './search/search';

import './favorites/favorites';

import {
  updateSidePanels
} from './sidepanels/sidepanels';


import {
  initSettings
} from './settings/settings';

import { initializeAccordions } from './accordion/accordion';


// Framework7.use([VirtualList, Swiper]);

(function() {
  // Dom7
  var $$ = Dom7;

  let routes = createRoutes();
  let templates = {};

  const statusBarBackgroundColor = '#000000';
  const statusBarForgroundColor = 'white';

  // Framework7 App main instance
  var app = new Framework7({
    root: '#app', // App root element
    id: 'org.hesperian.Safe-Birth', // App bundle ID
    name: 'Safe Birth', // App name
    theme: 'md',
    pushState: true,
    pushStateSeparator: '#!/',
    pushStateOnLoad: true,
    routes: routes,
    touch: {
      fastClicksExclude: "label.checkbox, label.radio"
    },
    statusbar: {
      'iosBackgroundColor': statusBarBackgroundColor,
      'androidBackgroundColor': statusBarBackgroundColor,
      'iosTextColor': statusBarForgroundColor,
      'androidTextColor': statusBarForgroundColor
    }
  });

  // Init/Create main view
  var mainView = app.views.create('.view-main', {
    url: '/',
    allowDuplicateUrls: false
  });

  let pageInitId = 0; // counter of page inits for unique id purposes

  const buildConfig = {
    version: __VERSION__
  };

  Template7.registerHelper('build', function(k) {
    return buildConfig[k];
  });

  Template7.registerHelper('state', function(k) {
    switch (k) {
      case 'pageInitId':
        return `pageInitId=${pageInitId}`;
    }
    return `${k}?`;
  });

  Template7.registerHelper('debug', function(k) {
    switch (k) {
      case 'currentLocale':
        return appConfig.locale();
    }
    return `${k}?`;
  });


  $$('script.template').each(function() {
    var template = $$(this);
    var name = template.data('template-name');
    var html = template.html();

    templates[name] = {
      compiledTemplate: Template7.compile(html)
    };
  });

  for (const k in appTemplates) {
    templates[k] = {
      compiledTemplate: Template7.compile(appTemplates[k])
    };
  }

  function getContext(contextPath, pageId) {
    const context = contextPath ? resources.get(contextPath) : {};

    let ret = Object.assign({}, context);

    if (pageId) {
      ret.page = resources.get('pages')[pageId];
    }

    return ret;
  }

  $$(document).on('page:init', '.page', function(e) {
    const page = e.detail;
    const pageId = page.$el.data('id');
    const instances = $$('.template', page.el);

    instances.each(function() {
      var e = $$(this);
      var t = e.data('template-name');
      var contextPath = e.data('template-context');
      var context = getContext(contextPath, pageId);
      var compiledTemplate = templates[t].compiledTemplate;

      e.html(compiledTemplate(context));
    });
    $$('#app').removeClass('global-search-in global-search-enabled');
    $$('#app').removeClass('global-search-enabled');

    pageInitId++;
  });

  $$(document).on('page:beforin', '.page', function(e) {
    $$('#app').removeClass('global-search-in global-search-enabled');
    $$('#app').removeClass('global-search-enabled');
  });

  $$('.template-partial').each(function() {
    var $el = $$(this);
    var tName = $el.data('template');
    var tSource = $el.html();
    Template7.registerPartial(tName, tSource);
  });


  // Page formater utility class - a wraper for putting
  // ICU message templates in the content of a page element,
  // and then formatting it on page load.

  // Formatters based on DOM element by id
  // The DOM element starts with the ICU message formatter
  // Initialize with formatters = { 'DomId: {}, ...}
  function PageContentFormatter(formatters) {
    this.mf = new MessageFormat();
    this.formatters = formatters;
  }

  // prepare. Call before calling format().
  // Extracts and remembers the template
  // Safe to call multiple times.
  PageContentFormatter.prototype.prepare = function() {
    var k;
    var formatters = this.formatters;
    for (k in formatters) {
      if (!formatters[k].fn) {
        formatters[k].fn = this.mf.compile($$('#' + k).text());
      }
    }
  };

  // Fill the dom content based on the template
  PageContentFormatter.prototype.format = function(id, args) {
    var txt = this.formatters[id].fn(args);
    $$('#' + id).text(txt);
  };

  document.addEventListener("deviceready", function() {

    document.addEventListener(
      'backbutton',
      function() {
        mainView.router.back();
      },
      true
    );
  }, false);


  /*
   *  Page initialization for various page types.
   */
  $$(document).on('page:init', function(e) {
    updateSidePanels();

    let searchbar = createSearchBar(app, e.detail.$pageEl);
    let searchList = createSearchList(app, e.detail.$pageEl);

    $$(document).on('page:afterout', e.detail.$pageEl, function(_e) {
      //searchbar.clear();
      searchbar.disable();
    });

    $$(document).on('page:beforeremove', e.detail.$pageEl, function(_e) {
      searchbar.destroy();
      searchbar = null;
      // hitting an intermittent exception thrown here where somehow the $el is gone already.
      if (searchList.$el.length) {
        searchList.destroy();
      }
      searchList = null;
    });

  });

  // https://silvantroxler.ch/2016/setting-voiceover-focus-with-javascript/
  function setVoiceOverFocus(element) {
    var focusInterval = 10; // ms, time between function calls
    var focusTotalRepetitions = 10; // number of repetitions

    element.setAttribute('tabindex', '0');
    element.blur();

    var focusRepetitions = 0;
    var interval = window.setInterval(function() {
      element.focus();
      focusRepetitions++;
      if (focusRepetitions >= focusTotalRepetitions) {
        window.clearInterval(interval);
      }
    }, focusInterval);
  }

  $$(document).on('page:beforein', function(e) {
    const page = e.detail;
    const sectionId = page.route.params && page.route.params.sectionId;

    if (sectionId) {
      const sectionEl$ = $$(`[data-section="${sectionId}"]`, page.el);
      if (sectionEl$.length) {
        if (sectionEl$.hasClass('accordion-item')) {
          app.accordion.open(sectionEl$)
        }
        sectionEl$[0].scrollIntoView();
      }
    }
  });

  $$(document).on('page:afterin', function(e) {
    var page = e.detail;
    var $container = $$(page.container);

    // Voiceover can find elements on the non-visible pages
    // so we hide them to aria.
    $$('.page-on-center').attr('aria-hidden', false);
    $$('.page-on-left,.page-on-right').attr('aria-hidden', true);

    // default accessibility target
    var focus = $container.find('.page-header');
    if (focus.length) {
      setVoiceOverFocus(focus[0]);
    }
  });

  // .external-site links open in browser
  $$(document).on('click', '.external-site', function(e) {
    var href = $$(this).attr('href');
    //alert('opening ' + href);

    e.preventDefault();
    e.stopPropagation();
    if (window.cordova) {
      window.cordova.InAppBrowser.open(href, '_system');
    } else {
      window.open(href, '_system');
    }
    return false;
  });

  $$(document).on('click', 'a.language-switch', function(e) {
    const lang = $$(this).data('lang');
    appConfig.locale(lang);

    mainView.router.clearPreviousPages();
    mainView.router.refreshPage();
  });

  window.app = app;

  initSettings();
  initializeAccordions();
})();