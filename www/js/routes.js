/*
 *  routes
 *  usage: routes.createRoutes()
 */

import { appConfig } from './appConfig';

function pageRoutes() {
  function resolver(routeTo, routeFrom, resolve, reject) {
    const locale = appConfig.locale();
    var pagePathElement = routeTo.params.pageId;
    resolve({
      templateUrl: `./locales/${locale}/${pagePathElement}.html`
    });
  }

  const pageIdElement = ':pageId';

  let pageRoutes = [
    {
      path: `/pages/${pageIdElement}`,
      async: resolver
    },
    {
      path: `/pages/${pageIdElement}/:sectionId`,
      async: resolver
    }
  ];

  return pageRoutes;
}

function createRoutes() {
  var routes = [
    {
      path: '/',
      async: function(routeTo, routeFrom, resolve, reject) {
        var locale = appConfig.locale();
        resolve({
          templateUrl: `./locales/${locale}/index.html`
        });
      }
    },
    ...pageRoutes()
  ];

  return routes;
}

export { createRoutes };
