'use strict';

describe('Controller: MainCtrl', function() {

    beforeEach(module('retailerApp'));

    var $controller,
        $scope,
        $location;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_('MainCtrl', {$scope: $scope});
    }));

    describe("$scope.inWishList", function() {
        it('Should return true if the object items contains the the key "earrings" and if "category contains the key "earrings0"', function () {
            var items = {};
            items['earrings'] = {
                "earrings0": {
                    "id": "earrings0",
                    "title": "Diamond Stud Earrings",
                    "slug": "diamond-stud-earrings",
                    "category": "earrings",
                    "sub_categories": ["stud", "diamond"],
                    "description": "Lorem ipsum dolor sit amet",
                    "content": "Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.  Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.  Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse. Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.  Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.  Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.  Lorem ipsum dolor sit amet, te case apeirian vel, nec cu quot fierent gloriatur. No sed altera aliquam. Doming omnium nominati et quo, id tale homero recusabo vim, ius laudem suscipiantur ad. Diam doctus et has, quot adolescens ullamcorper sea ei. Et mei epicuri ponderum efficiendi, qui in explicari assueverit, sit et expetendis definiebas. Exerci fastidii ex mea, ei pro elaboraret liberavisse.",
                    "price": 700.00,
                    "inCart": false,
                    "imageThumb": "images/earrings/thumb_Earrings 37 thumb.jpg",
                    "image": "images/earrings/Earrings 37 thumb.jpg",
                    "index": 0
                }
            };
            $scope.wishListItems = items['earrings'];
            expect($scope.inWishList("earrings0")).toBe(true);
        });
    });

    describe("Page navigation method", function() {
        var category = "earrings",
            subCategory = "stud",
            $location,
            baseUrl;

        beforeEach(inject(function(_$location_, _baseUrl_) {
            $location = _$location_;
            $scope.pageNumber = 0;
            baseUrl = _baseUrl_;
        }));

        describe("function $scope.setCategory", function () {
            it('Should set the url so that $location.path() returns "/jewelry/0/earrings"', function () {
                $scope.setCategory(category);
                expect($location.path()).toBe("/jewelry/0/earrings");
            });
        });

        describe("function $scope.setSubCategory", function () {
            it('Should set the url so that $location.path() returns "/jewelry/0/earrings/stud"', function () {
                $scope.currentCategory = category;
                $scope.setSubCategory(subCategory);
                expect($location.path()).toBe("/jewelry/0/earrings/stud");
            });
        });

        describe("function $scope.pageNav with direction = 'next'", function() {
           it('Should set the url so that $location.path() returns "/jewelry/1/earrings"', function() {
               $scope.currentCategory = category;
               $scope.numberOfPages = 4;
               $scope.pageNav("next");
               expect($location.path()).toBe("/jewelry/1/earrings");
           });
        });

        describe("function $scope.pageNav with direction = 'previous'", function() {
           it('Should set the url so that $location.path() returns "/jewelry/0/earrings"', function() {
               $scope.currentCategory = category;
               $scope.numberOfPages = 4;
               $scope.pageNumber = 1;
               $scope.pageNav("previous");
               expect($location.path()).toBe("/jewelry/0/earrings");
           });
        });

    });


});

