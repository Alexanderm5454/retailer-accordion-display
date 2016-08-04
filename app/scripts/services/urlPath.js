(function() {
    'use strict';

    var retailerApp = angular.module("retailerApp");

    retailerApp.factory("urlPath", urlPath);
    urlPath.$inject = ["$location", "baseUrl", "itemsPerPage"];

    function urlPath($location, baseUrl, itemsPerPage) {
        var path = {
            baseUrl: baseUrl,
            page: "",
            pageNumber: 0,
            category: "",
            slug: "",
            index: -1,
            subCategory: "",
            sortByPrice: ""
        };

        return {
            path: path,
            loadCategoryPage: loadCategoryPage,
            loadItemPage: loadItemPage
        };

        function loadCategoryPage(pageNumber, category, subCategory, order) {
            var currentPath = [];
            path.page = "categoryPage";
            path.pageNumber = pageNumber;
            path.category = category;
            path.subCategory = subCategory || '';
            path.sortByPrice = order || '';
            currentPath = [baseUrl, path.pageNumber, path.category];

            if (path.subCategory) {
                currentPath.push(path.subCategory);
            }
            if (path.sortByPrice) {
                currentPath.push("sort/price/" + path.sortByPrice);
            }
            $location.path(currentPath.join("/"));
        }

        function loadItemPage(item) {
            var pageNumber = 0;
            path.index = item.index;

            if (path.index >= itemsPerPage) {
                pageNumber = Math.ceil((path.index + 1) / itemsPerPage) - 1;
                path.index = item.index - (itemsPerPage * pageNumber);
            }
            path.page = "itemPage";
            path.pageNumber = pageNumber;
            path.category = item.category;
            path.slug = item.slug;

            $location.path([baseUrl, path.pageNumber, path.category, path.slug, path.index].join("/"));
        }
    }

}());