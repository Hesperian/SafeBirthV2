/*
 *  
 * 
 *    
 */

import {
  Template7,
  Dom7
} from 'framework7/framework7.esm.bundle.js';
import './settings.scss';
import {
  resources
} from '../resources';
import {
  appConfig
} from '../appConfig';

let $$ = Dom7;

const methodsList = Template7.compile(`
<div class="list media-list toggle-list methods-toggle-list">
  <ul>
    {{#each methods}}
    <li>
      <div class="item-content">
        <div class="item-media">
        <label class="toggle">
            <input type="checkbox" name="methods" value="{{id}}" />
            <span class="toggle-icon"></span>
          </label>
        </div>
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title">{{title}}</div>
          </div>
        </div>
      </div>
    </li>
    {{/each}}
  </ul>
</div>
`);


function initSettings() {

  $$(document).on('page:reinit', '.page[data-id="J5-settings"]', function(e) {
    const page = e.detail;
  });

  $$(document).on('page:init', '.page[data-id="J5-settings"]', function(e) {
    const page = e.detail;
    
  });
}

export {
  initSettings,
};