/*global angular:true*/
angular.module("ngDynamicColumns").directive("dynamicRow", function ($rootScope, dynamicColumnService) {
    "use strict";
    return {
        restrict: 'A',
        controller: function ($scope, $element) {

            $rootScope.$on("columnToggled", function (event, columnId) {
                dynamicColumnService.toggleColumn($element, columnId);
            });
        },
        link: function ($scope, $element, $attrs) {
            if (!$attrs.dynamicRow) {
                throw new Error("dynamicRow direcive needs a column configuration object, but got " + $attrs.dynamicRow);
            }

            if (!$scope[$attrs.dynamicRow]) {
                throw new Error("Can't find the column configuration object on the scope");
            }
            dynamicColumnService.renderRow($scope, $element, $scope[$attrs.dynamicRow]);
        }
    };
});
