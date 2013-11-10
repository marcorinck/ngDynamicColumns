/*global angular:true*/
angular.module("ngDynamicColumns").directive("columnHeader", function ($rootScope, dynamicColumnService) {
    "use strict";

    var columns;

    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            columns = $scope["column-header"];

            $rootScope.$on("columnToggled", function (event, columnId) {
                dynamicColumnService.toggleColumn($element, columnId);
            });

            $rootScope.$on("recreateColumns", function () {
                dynamicColumnService.renderColumn($scope, $element, $scope[$attrs.columnHeader]);
            });

            $rootScope.$on("columnOrderChanged", function(event, sourceId, destinationId) {
                dynamicColumnService.changeColumnOrder($element, sourceId, destinationId);
            });
        },
        link: function ($scope, $element, $attrs) {
            if (!$attrs.columnHeader) {
                throw new Error("columnHeader directive needs a column configuration object, but got " + $attrs.dynamicRow);
            }

            if (!$scope[$attrs.columnHeader]) {
                throw new Error("Can't find the column configuration object on the scope: " + $attrs.columnHeader);
            }

            columns = $scope[$attrs.columnHeader];
            dynamicColumnService.renderColumn($scope, $element, columns);
        }
    };
});