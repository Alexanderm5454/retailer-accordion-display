"use strict";angular.module("retailerAccordionDisplayApp",["ngAnimate","ngCookies","ngResource","ngRoute","scriptsngSanitize","ngTouch","LocalStorageModule"]).config(["localStorageServiceProvider",function(a){a.setPrefix("ls")}]).run(["$rootScope","$http","categoryData",function(a,b,c){function d(a){sessionStorage.getItem("categories")&&sessionStorage.getItem("categoriesAndSubs")?(f=sessionStorage.getItem("categories").split(","),e=JSON.parse(sessionStorage.getItem("categoriesAndSubs")),a&&"function"==typeof a&&a()):b.get("/retailer-accordion-display/scripts/json/categories.json").then(function(b){e=b.data.categories;for(var c in b.data.categories)b.data.categories.hasOwnProperty(c)&&f.push(c);sessionStorage.setItem("categories",f),sessionStorage.setItem("categoriesAndSubs",JSON.stringify(e)),a&&"function"==typeof a&&a()},function(a){console.error("response: ",a)})}var e={},f=[];d(function(){a.categories=f,c.categories=f,c.categoriesAndSubs=e})}]).config(["$routeProvider",function(a){a.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/jewelry/wish-list/:category",{templateUrl:"views/wish-list.html",controller:"wishListCtrl"}).when("/jewelry/:pageNumber/:category",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/jewelry/:pageNumber/:category/:subCategory",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/jewelry/:pageNumber/:category/:itemPath/:index",{templateUrl:"views/item.html",controller:"ItemCtrl"}).when("/jewelry/wish-list",{templateUrl:"views/wish-list.html",controller:"wishListCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/jewelry/0/earrings"})}]),function(a){var b=angular.module("retailerAccordionDisplayApp");b.value("itemsPerPage",15),b.value("baseUrl","jewelry"),b.factory("urlPath",["$location","baseUrl","itemsPerPage",function(a,b,c){return{loadItemPage:function(d){var e=d.index,f=0;e>=c&&(f=Math.ceil((e+1)/c)-1,e=d.index-c*f),a.path([b,f,d.category,d.slug,e].join("/"))}}}]),b.factory("selectedItem",function(){return{data:{}}}),b.factory("wishList",["localStorageService",function(a){function b(){a.get("wishListItems")&&(c=a.get("wishListItems"))}var c={};return c.wishListArray=[],{addItem:function(d){if("object"==typeof d&&d.hasOwnProperty("id")){var e=d.id,f=d.category;b(),f in c||(c[f]={}),e in c[f]||(c[f][e]=d,c.wishListArray.push(d),a.set("wishListItems",c)),console.log("items: ",c)}else console.error("addItem function parameter 'wishListed' must be an object")},removeItem:function(d){if("object"==typeof d&&d.hasOwnProperty("id")){b();var e=d.id,f=d.category;f in c&&e in c[f]&&(delete c[f][e],JSON.stringify(c[f])===JSON.stringify({})&&delete c[f]);for(var g=-1,h=0,i=c.wishListArray.length;i>h;h++)if(c.wishListArray[h].title===d.title){g=h;break}-1!==g&&c.wishListArray.splice(g,1),a.set("wishListItems",c),console.log("items: ",c)}},getItems:function(a){return b(),c[a]||{}},getArrayItems:function(){return b(),c.wishListArray||[]}}}]),b.factory("items",["$http","$location","itemsPerPage","baseUrl",function(a,b,c,d){function e(b,c){var d=b+".json";a.get("//json/"+d).then(function(a){f[b]=a.data.items,sessionStorage.setItem(b,JSON.stringify(f[b])),c&&"function"==typeof c&&c()},function(a){console.error("response: ",a)})}var f={};return{currentCategory:"",currentSubCategory:"",categories:[],infoList:{items:[]},itemsPerPage:c,pageNumber:0,numberOfPages:1,init:function(b){if(sessionStorage.getItem("categories"))this.categories=sessionStorage.getItem("categories").split(","),b&&"function"==typeof b&&b();else{var c=this;a.get("/retailer-accordion-display/scripts/json/categories.json").then(function(a){c.categories=a.data.categories,sessionStorage.setItem("categories",c.categories),b&&"function"==typeof b&&b()},function(a){console.error("response: ",a)})}},setItems:function(a,c){if(this.categories=a,b.path()){for(var g=b.path().split("/"),h=g[3],i=0,j=this.categories.length;j>i;i++)if(h===this.categories[i]){this.currentCategory=this.categories[i];break}var k=this,l=function(){k.infoList.items.length=0;var a,b,d=parseInt(g[2],10),e=f[k.currentCategory];if(5===g.length){var h=[];k.currentSubCategory=g[4];for(var i=0,j=e.length;j>i;i++)if(e[i].sub_categories)for(var l=0,m=e[i].sub_categories.length;m>l;l++)e[i].sub_categories[l]===k.currentSubCategory&&h.push(e[i]);e=h}else k.currentSubCategory="";k.numberOfPages=Math.ceil(e.length/k.itemsPerPage);for(var n=0,o=k.numberOfPages;o>n;n++)if(d===n){k.pageNumber=n;break}a=k.pageNumber*k.itemsPerPage,b=a+k.itemsPerPage,k.infoList.items=e.slice(a,b),c&&"function"==typeof c&&c()};sessionStorage.getItem(this.currentCategory)?(f[this.currentCategory]=JSON.parse(sessionStorage.getItem(this.currentCategory)),l()):(""===this.currentCategory&&b.path([d,this.categories[0]].join("/")),e(this.currentCategory,l))}}}}]),b.controller("MainCtrl",["$scope","$http","$timeout","$location","localStorageService","categoryData","items","wishList","baseUrl",function(b,c,d,e,f,g,h,i,j){b.subCategories=[],b.currentCategory="",b.currentSubCategory="",b.infoList={items:[]},b.pageNumber=0,b.numberOfPages=1,b.showPageNumbers=!1,h.setItems(g.categories,function(){b.infoList.items=h.infoList.items,b.pageNumber=h.pageNumber,b.numberOfPages=h.numberOfPages}),b.currentCategory=h.currentCategory,b.currentSubCategory=h.currentSubCategory,b.subCategories=g.categoriesAndSubs[b.currentCategory];var k=i.getItems(h.currentCategory);b.inWishList=function(a){return a in k},b.setCategory=function(c){b.pageNumber=0,e.path([j,b.pageNumber,c].join("/")),a("body, html").animate({scrollTop:0},0)},b.setSubCategory=function(a){e.path([j,0,b.currentCategory,a].join("/"))},b.pageNav=function(c){var d=!1;"next"===c&&b.pageNumber<b.numberOfPages-1?(b.pageNumber++,d=!0):"previous"===c&&b.pageNumber>0&&(b.pageNumber--,d=!0),d===!0&&(e.path([j,b.pageNumber,b.currentCategory].join("/")),a("body, html").animate({scrollTop:0},0))},b.numberOfPagesDisplay=function(){return b.showPageNumbers=b.numberOfPages>1,new Array(b.numberOfPages)},b.setPageNumber=function(c){b.pageNumber=c,e.path([j,b.pageNumber,b.currentCategory].join("/")),a("body, html").animate({scrollTop:0},0)},b.sortItemsByPrice=function(a){b.infoList.items.sort(function(b,c){var d,e;return"high"===a?(d=c,e=b):(d=b,e=c),d.price>e.price?1:-1})}}]),b.directive("grid",["selectedItem","wishList","urlPath",function(b,c,d){return{restrict:"E",templateUrl:"views/grid.html",link:function(e,f){var g=a(f.find(".wishListIcon")[0]),h={delay:{show:400,hide:100},title:"Add to Wish List"};f.on("mouseover",function(){var a=f.find(".wishListIcon")[0];a.style.visibility="visible",g.hasClass("wishListIconSelected")&&(h.title="Remove from Wish List"),g.attr("data-toggle","tooltip").tooltip(h)}).on("mouseout",function(){f.find(".wishListIconNotSelected")[0]&&(f.find(".wishListIconNotSelected")[0].style.visibility="hidden")}),g.on("click",function(b){b.stopPropagation();var d=+a(f.children()[0]).context.id;if(a(this).hasClass("wishListIconNotSelected")){var g=e.infoList.items[d];c.addItem(g),a(this).addClass("wishListIconSelected").removeClass("wishListIconNotSelected"),h.title="Remove from Wish List"}else if(a(this).hasClass("wishListIconSelected")){var i=e.infoList.items[d];c.removeItem(i),a(this).removeClass("wishListIconSelected").addClass("wishListIconNotSelected"),h.title="Add to Wish List"}a(this).tooltip("hide").attr("data-original-title",h.title).tooltip("fixTitle").tooltip(h)}),f.on("click",function(c){c.stopPropagation(),e.index=+a(f.children()[0]).context.id,b.data=e.infoList.items[e.index],d.loadItemPage(b.data),e.$apply()})}}}]),b.filter("firstLetterCaps",function(){return function(a){if(a){var b=a.charAt(0).toUpperCase(),c=a.slice(1,a.length);return b+c}}})}(jQuery),function(a){var b=angular.module("retailerAccordionDisplayApp");b.factory("categoryData",[function(){return{categories:[],categoriesAndSubs:{}}}]),b.controller("navController",["$scope","$location","baseUrl",function(b,c,d){b.setCategory=function(b){c.path([d,0,b].join("/")),a("body, html").animate({scrollTop:0},0)},b.setSubCategory=function(a){c.path([d,0,b.currentNavCategory,a].join("/"))},b.isCurrentNavCategory=function(a){return b.currentNavCategory===a}}]),b.directive("navMenu",["categoryData",function(b){return{restrict:"E",templateUrl:"views/navMenu.html",replace:!0,link:function(c,d){function e(){g.css({visibility:"visible"}),f.css({backgroundColor:"rgb(175, 196, 207)"}),c.displaySubCategories=function(a){c.currentNavCategory=a,c.menuSubCategories=b.categoriesAndSubs[a]},g.children().on("click",function(a){a.stopPropagation(),g.css({visibility:"hidden"}),f.css({backgroundColor:"#e7e7e7"})})}var f=a(d[0].getElementsByClassName("jewelryMenu")),g=a(d[0].getElementsByClassName("navCategories")[0]),h=40*b.categories.length;c.currentNavCategory=b.categories[0],c.menuSubCategories=b.categoriesAndSubs[c.currentNavCategory],a(".navSubCategories").css({minHeight:h}),d.on("mouseover",function(){e()}).on("mouseout",function(){g.css({visibility:"hidden"}),f.css({backgroundColor:"#e7e7e7"})})}}}])}(jQuery),function(a){var b=angular.module("retailerAccordionDisplayApp");b.controller("ItemCtrl",["$scope","$location","selectedItem","items","categoryData","baseUrl",function(b,c,d,e,f,g){b.infoList={items:[]},b.pageNumber=0,b.pathDisplay=[],b.categoriesAndSubs=[],b.setCategory=function(a,d){var e="";b.pageNumber=c.path().split("/")[2],e=0===a?[g,b.pageNumber,d].join("/"):[g,0,b.item.category,d].join("/"),c.path(e)},b.item=d.data,b.loadItem=function(){if(b.categories=f.categories,b.item&&JSON.stringify(b.item)!==JSON.stringify({}))a("body, html").animate({scrollTop:0},0);else{var d=c.path().split("/"),g=parseInt(d[d.length-1],10),h=-1;e.setItems(b.categories,function(){for(var a=0,c=e.infoList.items.length;c>a;a++)if(g===a){h=a;break}b.item=e.infoList.items[h]})}if(b.categoriesAndSubs.push(b.item.category),b.item.sub_categories.length>0)for(var i=0,j=b.item.sub_categories.length;j>i;i++)b.categoriesAndSubs.push(b.item.sub_categories[i])}}]),b.directive("wishListButton",["wishList",function(b){return{restrict:"E",replace:!0,templateUrl:"views/wishListButton.html",link:function(c,d){c.wishListButtonText="Add to Wish List";var e=b.getArrayItems(),f=!1;c.inWishListArray=function(a){for(var b=0,d=e.length;d>b;b++)if(e[b].id===a){c.wishListButtonText="Remove from Wish List",f=!0;break}return f},a(d).on("click",function(){f?(b.removeItem(c.item),f=!1,a(this).removeClass("itemInWishList").addClass("itemNotInWishList"),a(this).text("Add to Wish List")):(b.addItem(c.item),f=!0,a(this).removeClass("itemNotInWishList").addClass("itemInWishList"),a(this).text("Remove from Wish List"))})}}}])}(jQuery),function(a){var b=angular.module("retailerAccordionDisplayApp");b.controller("wishListCtrl",["$scope","wishList","$location","categoryData","baseUrl",function(a,b,c,d,e){a.infoList={items:[]},a.category="",a.pageNumber=0,a.loadWishList=function(){var e=c.path().split("/"),f={};if(a.categories=d.categories,4===e.length){a.category=e[3],f=b.getItems(a.category);for(var g in f)f.hasOwnProperty(g)&&a.infoList.items.push(f[g])}else a.infoList.items=b.getArrayItems()},a.setCategory=function(a){c.path([e,"wish-list",a].join("/"))}}]),b.directive("wishListItem",["selectedItem","$location","wishList","urlPath",function(b,c,d,e){return{restrict:"E",templateUrl:"views/wishListItem.html",link:function(c,f){var g=a(f.children().find(".removeFromWishList"));f.on("click",function(d){d.stopPropagation(),c.index=+a(f.children()[0]).context.id,b.data=c.infoList.items[c.index],e.loadItemPage(b.data),c.$apply()}),g.on("click",function(b){b.stopPropagation();var e=a(f.children()[0]);e.fadeOut(800,function(){var a=+e.context.id,b=c.infoList.items[a];d.removeItem(b),c.infoList.items.length=0,c.loadWishList(),c.$apply(),e.fadeIn(0)})})}}}])}(jQuery),angular.module("retailerAccordionDisplayApp").controller("AboutCtrl",["$scope",function(a){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("retailerAccordionDisplayApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/cartItem.html",'<div class="cartItem"> <img class="cartImage" ng-src="{{ cartItem.image }}"> <p class="cartItemName">{{ cartItem.title }}</p> <span class="removeFromCart" ng-click="removeFromCart(cartItem)">Remove From Cart</span> <span class="cartItemPrice">{{ cartItem.price | currency:$ }}</span> </div>'),a.put("views/collapsible.html",'<div class="collapsibleItem"> <img class="collapsibleImgSmall" ng-src="{{ item.imageThumb }}"> <div class="collapsibleHeader"> <span class="collapsibleTitle">{{ item.title }}</span> <p class="itemPrice">{{ item.price | currency:$ }}</p> <span class="collapsibleDescription">{{ item.description }}</span> <span class="cartStatus" ng-show="item.inCart" ng-click="switchView(\'cart\')"><em>In Cart</em></span> </div> <img class="collapsibleImgLarge"> <span class="content"> <p class="collapsibleContent">{{ item.content }}</p> <span class="addToCart" ng-click="addToCart(item)">Add to Cart</span> <span class="compare" ng-click="addCompare(item)">Compare</span> </span> </div> <script>/*\n        $(\'.collapsibleDisplay\').fadeOut(100);\n        $(\'.shoppingCartDisplay\').hide();\n        $(\'.compareDisplay\').hide();\n        $(\'.sortItems\').show();\n\n        function display(delay) {\n            if (!delay) {\n                delay = 150;\n            }\n            $timeout(function() {\n                $scope.currentCategory = category;\n                $scope.infoList.items = $scope.allItems[category].slice();\n                $timeout(function() {\n                    $(\'.collapsibleDisplay\').fadeIn("fast");\n                //    $location.path($scope.currentCategory);\n                }, 100);\n            }, delay);\n        }\n\n        if ($scope.allItems[category]) {\n            display(150);\n        } else {\n            getCategoryItems(category, display, 150);\n        }\n        */</script>'),a.put("views/compareItem.html",'<img class="compareImg" ng-src="{{ compare.image }}"> <span class="removeCompare" ng-click="removeCompare(compare)">Remove</span> <span class="addToCartCompare" ng-click="addToCart(compare)">Add to Cart</span> <p class="compareTitle">{{ compare.title }}</p> <span class="comparePrice">{{ compare.price | currency:$ }}</span>'),a.put("views/grid.html",'<span id="{{ $index }}" class="gridItem"> <span ng-class="inWishList(item.id) ? \'wishListIconSelected\' : \'wishListIconNotSelected\'" class="wishListIcon btn btn-default glyphicon glyphicon-heart"></span> <img class="gridImageSmall" ng-src="{{ item.imageThumb }}"> <span class="gridItemTitle">{{ item.title }}</span> <span class="gridItemPrice">{{ item.price | currency:$ }}</span> </span>'),a.put("views/item.html",'<div class="categories"> <!---\n        <span class="category" ng-click="setCategory(category)" ng-repeat="category in categories">\n            {{ category | firstLetterCaps }}\n        </span>\n        --> <span ng-repeat="category in categoriesAndSubs track by $index"> <span ng-click="setCategory($index, category)" class="category">{{ category | firstLetterCaps }}</span> <span ng-if="$index === 0 && categoriesAndSubs.length > 1" class="glyphicon glyphicon-circle-arrow-right"></span> </span> <!-- <a href="#/jewelry/wish-list"><span class="category">Wish List</span></a> --> </div> <div class="itemContainer" ng-init="loadItem()"> <div class="itemTitle">{{ item.title }}</div> <div class="gridImageLargeContainer"> <img class="gridImageLarge" src="{{ item.image }}"> </div> <wish-list-button></wish-list-button> <div>{{ item.description }}</div> <br> <span>{{ item.content }}</span> </div>'),a.put("views/main.html",'<div class="container"> <span class="categoryTitle">{{ currentSubCategory || \'\' | firstLetterCaps }} {{ currentCategory | firstLetterCaps }}</span> <ul class="navContainer"> <a href="#/jewelry/0/{{ currentCategory }}"><li class="navContainerTitle">{{ currentCategory | firstLetterCaps }}</li></a> <li class="category" ng-click="setSubCategory(subCategory)" ng-repeat="subCategory in subCategories"> {{ subCategory | firstLetterCaps }} </li> <a href="#/jewelry/wish-list"><li class="category">Wish List</li></a> <li>Shopping Cart: {{ cartItemsLength || "Empty" }} </li> <li><p class="searchText">Sort/Search</p> <div> <span ng-click="sortItemsByPrice(\'low\')">Price Low</span> <span ng-click="sortItemsByPrice(\'high\')">Price High</span> </div> <form class="form-search"> <div class="input-append"> <input placeholder="Search" type="text" class="span2 search-query" ng-model="searchTerms"> <button class="btn btn-default glyphicon glyphicon-search" ng-click="searchItems()"></button> </div> </form> </li> </ul> <div class="gridDisplay"> <span class="pageNavContainer"> <span ng-show="showPageNumbers"> <span class="previousPage glyphicon glyphicon-menu-left" ng-click="pageNav(\'previous\')"></span> <span class="pageNumbers" ng-class="{\'currentPageNumber\': pageNumber === $index}" ng-repeat="page in numberOfPagesDisplay() track by $index" ng-click="setPageNumber($index)">{{ $index + 1 }}</span> <span class="nextPage glyphicon glyphicon-menu-right" ng-click="pageNav(\'next\')"></span> </span> </span> <span class="gridItemWrapper" ng-repeat="item in infoList.items"> <grid></grid> </span> </div> <span ng-show="showPageNumbers" class="pageNavContainer"> <span class="previousPage glyphicon glyphicon-menu-left" ng-click="pageNav(\'previous\')"></span> <span class="pageNumbers" ng-class="{\'currentPageNumber\': pageNumber === $index}" ng-repeat="page in numberOfPagesDisplay() track by $index" ng-click="setPageNumber($index)">{{ $index + 1 }}</span> <span class="nextPage glyphicon glyphicon-menu-right" ng-click="pageNav(\'next\')"></span> </span> <!--\n    <div class="compareDisplay">\n        <h2 class="displayTitle">Compare</h2>\n        <ul>\n            <li ng-repeat="compare in compareItems">\n                <compare-item></compare-item>\n            </li>\n        </ul>\n    </div>\n    <div class="shoppingCartDisplay">\n        <h2 class="displayTitle">Shopping Cart</h2>\n        <div ng-repeat="cartItem in cartItems">\n            <cart-item></cart-item>\n        </div>\n        <div class="cartBottomLine">\n            <span class="grandTotal">Grand Total: {{ grandTotal | currency:$ }}</span>\n        </div>\n    </div>\n    --> </div>'),a.put("views/navMenu.html",'<ul class="nav navbar-nav"> <li class="jewelryMenu mainNavLink"> <a hre="#/jewelry/0/earrings"> Jewelry <span class="caret"></span> </a> </li> <span class="navCategories"> <ul> <li ng-class="isCurrentNavCategory(category) ? \'currentNavCategory\' : \'\' " ng-repeat="category in categories" ng-mouseover="displaySubCategories(category)" ng-click="setCategory(category)"> <!-- <span ng-show="isCurrentNavCategory(category)">All </span> --> <span ng-class="isCurrentNavCategory(category) ? \'glyphicon glyphicon-menu-right\' : \'\' "></span> <a>{{ category | firstLetterCaps }}</a> <!-- <span ng-if="category" class=" glyphicon glyphicon-menu-right"></span> --> </li> <span class="navSubCategories"> <ul> <li ng-repeat="subCategory in menuSubCategories" ng-click="setSubCategory(subCategory)"><a>{{ subCategory | firstLetterCaps }}</a></li> </ul> </span> </ul> </span> </ul>'),a.put("views/wish-list.html",'<div class="container" ng-init="loadWishList()"> <span class="categoryTitle">{{ category || \'\' | firstLetterCaps }} {{category ? "in" : \'\'}} Wish List</span> <ul class="navContainer"> <a href="#/jewelry/wish-list"><li class="navContainerTitle">Wish List</li></a> <li class="category" ng-click="setCategory(category)" ng-repeat="category in categories"> {{ category | firstLetterCaps }} </li> <li>Shopping Cart: {{ cartItemsLength || "Empty" }} </li> <li><p class="searchText">Sort/Search</p> <div> <span ng-click="sortItemsByPrice(\'low\')">Price Low</span> <span ng-click="sortItemsByPrice(\'high\')">Price High</span> </div> <form class="form-search"> <div class="input-append"> <input placeholder="Search" type="text" class="span2 search-query" ng-model="searchTerms"> <button class="btn btn-default glyphicon glyphicon-search" ng-click="searchItems()"></button> </div> </form> </li> </ul> <div class="gridDisplay"> <span class="pageNavContainer"> </span> <span class="gridItemWrapper" ng-repeat="item in infoList.items track by $index"> <wish-list-item></wish-list-item> </span> </div> </div>'),a.put("views/wishListButton.html","<span ng-class=\"inWishListArray(item.id) ? 'itemInWishList' : 'itemNotInWishList'\" class=\"itemViewWishListButton btn btn-default\">{{ wishListButtonText }}</span>"),a.put("views/wishListItem.html",'<span id="{{ $index }}" class="wishListItem"> <img class="gridImageSmall" ng-src="{{ item.imageThumb }}"> <span class="wishListTitle">{{ item.title }}</span> <span class="wishListPrice">{{ item.price | currency:$ }}</span> <span class="removeFromWishList btn btn-default">Remove</span> </span>')}]);
