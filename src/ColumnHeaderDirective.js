/*global angular:true*/
angular.module("ngDynamicColumns").directive("columnHeader", function($rootScope, dynamicColumnService) {
    "use strict";

    var columns;

    return {
        restrict: 'A',
        controller: function($scope, $element) {
            columns = $scope["column-header"];

            $rootScope.$on("columnToggled", function(event, columnId) {
                dynamicColumnService.toggleColumn($element, columnId);
            });
        },
        link: function($scope, $element, $attrs){
            if (!$attrs.columnHeader) {
                throw new Error("columnHeader directive needs a column configuration object, but got " + $attrs.dynamicRow);
            }

            if (!$scope[$attrs.columnHeader]) {
                throw new Error("Can't find the column configuration object on the scope");
            }

            columns = $scope[$attrs.columnHeader];
            dynamicColumnService.renderColumn($scope, $element, columns);
        }
    };
});