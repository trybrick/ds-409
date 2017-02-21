var storeApp = angular
  .module('storeApp', ['infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'angulartics'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // disable theme
    gsn.config.SiteTheme = '402';
    gsn.config.defaultMobileListView = true;

    gsn.applyConfig(gsn.config, false);
    $locationProvider.html5Mode(true).hashPrefix('!');
    $locationProvider.rewriteLinks = false;


    var le = [gsn.getThemeUrl('/views/layout.html')];
    for (var i = 1; i < 5; i++) {
      le.push(gsn.getThemeUrl('/views/layout-brick' + i + '.html'));
    }
    var homeFile = '/proxy/Content/meta/' + gsn.config.ChainId + '/?name=home page&meta=home&type=text/html';
    var urls = [
      {
        login: 0,
        store: 0,
        path: '/',
        tpl: homeFile
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/article',
        tpl: gsn.getThemeUrl('/views/engine/article.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/article/:id',
        tpl: gsn.getThemeUrl('/views/engine/article.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[1],
        path: '/circular',
        tpl: gsn.getThemeUrl('/views/engine/circular-view-flyer.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[1],
        path: '/circular/list',
        tpl: gsn.getThemeUrl('/views/engine/circular-view-list.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[1],
        path: '/circular/text',
        tpl: gsn.getThemeUrl('/views/engine/circular-view-list.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/contactus',
        tpl: gsn.getThemeUrl('/views/engine/contact-us.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/coupons',
        tpl: gsn.getThemeUrl('/views/engine/coupons-printable.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/coupons/digital',
        tpl: gsn.getThemeUrl('/views/engine/coupons-digital.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/coupons/store',
        tpl: gsn.getThemeUrl('/views/engine/coupons-store.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/mealplannerfull',
        tpl: gsn.getThemeUrl('/views/engine/meal-planner.html')
      }
      , {
        login: 1,
        store: 0,
        layout: le[0],
        path: '/savedlists',
        tpl: gsn.getThemeUrl('/views/engine/saved-lists.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/mylist',
        tpl: gsn.getThemeUrl('/views/engine/shopping-list.html')
      }
      , {
        login: 0,
        store: 0,
        path: '/mylist/print',
        tpl: gsn.getThemeUrl('/views/engine/shopping-list-print.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/mylist/email',
        tpl: gsn.getThemeUrl('/views/engine/shopping-list-email.html')
      }
      , {
        login: 1,
        store: 0,
        layout: le[0],
        path: '/myrecipes',
        tpl: gsn.getThemeUrl('/views/engine/my-recipes.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/product',
        tpl: gsn.getThemeUrl('/views/engine/product.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/product/search',
        tpl: gsn.getThemeUrl('/views/engine/product-search.html')
      }
      , {
        login: 1,
        store: 0,
        path: '/profile',
        tpl: gsn.getThemeUrl('/views/engine/profile-edit.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipe/search',
        tpl: gsn.getThemeUrl('/views/engine/recipe-search.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipe',
        tpl: gsn.getThemeUrl('/views/engine/recipe-details.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipe/:id',
        tpl: gsn.getThemeUrl('/views/engine/recipe-details.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipecenter',
        tpl: gsn.getThemeUrl('/views/engine/recipe-center.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipevideo',
        tpl: gsn.getThemeUrl('/views/engine/recipe-video.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/recipevideo/:id',
        tpl: gsn.getThemeUrl('/views/engine/recipe-video.html')
      }
      , {
        login: 0,
        store: 0,
        path: '/registration',
        tpl: gsn.getThemeUrl('/views/engine/registration.html')
      }
      , {
        login: 0,
        store: 0,
        path: '/registration/facebook',
        tpl: gsn.getThemeUrl('/views/engine/registration.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/signin',
        tpl: gsn.getThemeUrl('/views/engine/signin.html')
      }
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/store/:id',
        tpl: gsn.getThemeUrl('/views/engine/store-info.html')
      }
 /*     , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/storelocator',
        tpl: gsn.getThemeUrl('/views/engine/store-locator.html')
      }
*/
      , {
        login: 0,
        store: 0,
        layout: le[0],
        path: '/unsubscribe',
        tpl: gsn.getThemeUrl('/views/engine/unsubscribe.html')
      }
      , {
        login: 0,
        store: 1,
        layout: le[0],
        path: '/liquor',
        tpl: gsn.getThemeUrl('/views/engine/static-content.html')
      }

    ];


    angular.forEach(urls, function(v, k) {
      $routeProvider.when(v.path, {
        templateUrl: v.tpl,
        caseInsensitiveMatch: true,
        storeRequired: v.store,
        requireLogin: v.login,
        controller: v.controller,
        layout: v.layout
      })
    });
	
    $routeProvider.when('/coupons/printable', {
      redirectTo: '/coupons',
      caseInsensitiveMatch: true
    });

    $routeProvider.otherwise({
      templateUrl: gsn.getThemeUrl('/views/engine/static-content.html'),
      caseInsensitiveMatch: true
    });
  }]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['storeApp']);
  angular.element("a").not('[target]').prop('target', '_self');
});

storeApp.directive('cbPageScroll', ['FeedService', '$timeout', function(FeedService, $timeout) {
  var directive = {
    link: link,
    restrict: 'A'
  };
  return directive;

  function link(scope, element, attrs) {
    $anchor = $(element);
    $anchor.bind('click', function(event) {
      $('html, body').stop().animate({
        scrollTop: $(attrs.cbPageScroll).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
    });
  }
}]);