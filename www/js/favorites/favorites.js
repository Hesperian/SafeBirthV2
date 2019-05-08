/*
 *  favorites
 * 
 *  Handles favorites list
 */

import {
  Template7,
  Dom7
} from 'framework7/framework7.esm.bundle.js';
import './favorites.scss';
import {
  resources
} from '../resources';
import {
  appConfig
} from '../appConfig';

import * as Sortable from 'sortablejs';

let $$ = Dom7;

const tileList = Template7.compile(`
  {{#each items}}
  <li class="tile elevation-5" data-pageId="{{pageId}}">
    <a class="link tile-link" href="{{url}}">
      {{#if imgsrc}}<img src="{{imgsrc}}" alt="">{{/if}}
      <span>{{title}}</span>
    </a>
    <span class="close-tile star-holder" data-url="{{url}}">
      <img class="favorite-icon checked" src="./img/star-checked.svg"/>
      <img class="favorite-icon unchecked" src="./img/star-unchecked.svg"/>
    </span>
  </li>
  {{/each}}
`);

let favoritesItems = appConfig.favorites();

function setClass(element, classname, value) {
  if (value) {
    element.addClass(classname);
  } else {
    element.removeClass(classname);
  }
}

function updateFavoritesList($parentEl) {
  const pages = resources.get('pages');

  const context = {
    items: favoritesItems.filter(fav => pages[fav.pageId])
  }

  context.items.forEach((fav) => {
    const page = pages[fav.pageId];
    fav.imgsrc = page.imgsrc;
    fav.url = page.route;
    fav.title = page.title;
  });

  $parentEl.html(tileList(context));

  $parentEl.parents('.page').each(function() {
    const empty = (favoritesItems.length === 0);
    setClass($$(this), 'favorites-empty', empty);
    setClass($$(this), 'favorites-nonempty', !empty);
  });
}

function addFavorite(pageId) {
  const pages = resources.get('pages');
  const page = pages[pageId];

  if (page && !isFavorite(pageId)) {
    favoritesItems.push({
      pageId: pageId
    });
    appConfig.favorites(favoritesItems);
  }
}

function removeFavorite(pageId) {

  for (let i = favoritesItems.length - 1; i >= 0; i--) {
    if (favoritesItems[i].pageId === pageId) {
      favoritesItems.splice(i, 1);
    }
  }

  appConfig.favorites(favoritesItems);
}

function isFavorite(pageId) {
  for (let i = 0; i < favoritesItems.length; i++) {
    if (favoritesItems[i].pageId === pageId) return true;
  }
  return false;
}

$$(document).on('change', '.page-current .checkbox-favorites input', (e) => {
  const checked = $$(e.target).prop('checked');
  const page$ = $$(e.target).parents('.page');
  const pageId = page$.data('id');

  if (checked) {
    addFavorite(pageId);
  } else {
    removeFavorite(pageId);
  }
});

$$(document).on('page:init', '.page.has-favorites', (e) => {
  const page = e.detail;
  const $favs = $$('.favorites-list > ul', page.el);
  Sortable.create($favs[0], {
    onUpdate: function(_evt) {
      let newFavorites = [];
      $$('li', $favs[0]).each(function() {
        const pageId = $$(this).data('pageId');
        newFavorites.push({'pageId': pageId});
      });
      favoritesItems = newFavorites;
      appConfig.favorites(favoritesItems);
    }
  });
});


$$(document).on('page:beforein', function(e) {
  const page = e.detail;
  const pageId = page.$el.data('id');

  $$(".checkbox-favorites input", page.el).prop('checked', isFavorite(pageId));
});

$$(document).on('page:beforein', '.page.has-favorites', (e) => {
  const page = e.detail;
  updateFavoritesList($$('.favorites-list > ul', page.el));
});


$$(document).on('click', '.page.has-favorites .close-tile', function() {
  const $tile = $$(this);
  const $listItem = $tile.parents('.favorites-list > ul > li');

  let pageId = $listItem.data('pageId');

  $listItem.animate({
    'opacity': 0.0
  }, {
    complete: function(elements) {
      removeFavorite(pageId);

      $tile.parents('.favorites-list > ul').each(function() {
        updateFavoritesList($$(this));
      });
    }
  });
});
