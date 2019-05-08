/*
 *  Sidepanels
 * 
 */

import {
  Template7,
  Dom7
} from 'framework7/framework7.esm.bundle.js';
import './sidepanels.scss';
import {
  resources
} from '../resources';
import {
  appConfig
} from '../appConfig';

const $$ = Dom7;

// Get a link to the current page, but for a different locale
function getCurrentPageLinkForLocale(language_code) {
  var currentRoute = window.app.views.main.router.currentRoute;
  const path = currentRoute.path.replace(/^\/locales\/[^/]*/, ''); // trim any absolute locale path

  var link = `/locales/${language_code}${path}`;

  return link;
}

function getSideLinks() {
  return resources.get('sidelinks');
}


const settingsContent = Template7.compile(`
<div id="language-choices" class="list list-block">
  <ul>
    <li id="settings-language-header" class="item-content settings-header">
      <div class="item-media">
        <i class="icon material-icons">language</i>
      </div>
      <div class="item-inner">
        <div class="item-title">{{settings.languages.title}}</div>
      </div>
    </li>
    {{#each items}}
    <li class="panel-close">
      <a href="#" data-lang="{{language_code}}" class="language-switch item-link item-content panel-close {{classes}}">
        <div class="item-inner">
          <div class="item-title">{{language}}</div>
        </div>
      </a>
    </li>
    {{/each}}
    <li class="panel-close settings-header">
      <a href="/pages/J5-settings" class="item-link item-content panel-close">
        <div class="item-media">
          <i class="icon material-icons">settings_applications</i>
        </div>
        <div class="item-inner">
          <div class="item-title">{{settings.settings.title}}</div>
        </div>
      </a>
    </li>
    <li class="panel-close settings-header">
      <a href="/pages/J4-help" class="item-link item-content panel-close">
        <div class="item-media">
          <i class="icon material-icons">help_outline</i>
        </div>
        <div class="item-inner">
          <div class="item-title">{{settings.help.title}}</div>
        </div>
      </a>
    </li>
    <li class="panel-close settings-header">
      <a href="/pages/J2-About_us" class="item-link item-content panel-close">
        <div class="item-media">
          <i class="icon material-icons">people</i>
        </div>
        <div class="item-inner">
          <div class="item-title">{{settings.about.title}}</div>
        </div>
      </a>
    </li>
  </ul>
</div>
`);

function updateSettings() {
  const settings$ = $$('#settings');
  let context = {};
  context.settings = resources.get('settings');
  context.items = resources.getLanguages().map(item => {
    const link = getCurrentPageLinkForLocale(item.language_code);

    return {
      link: link,
      classes: (appConfig.locale() === item.language_code) ?  'current-locale' : '',
      language: item.language,
      language_code: item.language_code
    }
  });

  settings$.html(settingsContent(context));
}

const sidelinksContent = Template7.compile(`
<div class="sidelinks list list-block">
  <ul>
    {{#each items}}
    <li class="panel-close">
      <a href="{{link}}" class="item-link item-content panel-close">
        {{#if media}}
        <div class="item-media">
          <img class="icon panel-icon" src="{{media}}"></img>
        </div>
        {{/if}}
        <div class="item-inner">
          <div class="item-title">{{title}}</div>
        </div>
      </a>
    </li>
    {{/each}}
  </ul>
</div>
`);

const pageIcons = {
  '/': 'img/home-button_pink.png'
};

function updateSideLinks() {
  const sidelinks$ = $$('#sidelinks');

  let context = {};
  context.items =  resources.get('sidelinks').map(item => ({
    media: pageIcons[item.link],
    link: item.link,
    title: item.title
  }));

  sidelinks$.html(sidelinksContent(context));
}

function updateSidePanels() {
  updateSettings();
  updateSideLinks();
}


export {
  updateSidePanels
};