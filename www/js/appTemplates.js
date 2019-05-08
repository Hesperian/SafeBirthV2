/*
  appTemplates

  HTML Template7 Templates

*/



const appTemplates = {
  "page-header": `
<div class="content-block page-header">
  <div class="header-title">{{page.title}}</div>
  <div class="checkbox-favorites">
    <input type="checkbox" value="0" id="{{state "pageInitId"}}"/>
    <label class="star-holder" for="{{state "pageInitId"}}">
      <img class="favorite-icon checked" src="./img/star-checked.svg"/>
      <img class="favorite-icon unchecked" src="./img/star-unchecked.svg"/>
    </label>
  </div>
</div>
`
};

export {
  appTemplates
};