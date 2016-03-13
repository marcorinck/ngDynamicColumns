(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("columnHeader", ['$rootScope', 'dynamicColumnService', function ($rootScope, dynamicColumnService) {
		function arraymove(array, fromIndex, toIndex) {
			var element = array[fromIndex];
			array.splice(fromIndex, 1);
			array.splice(toIndex, 0, element);
		}

		return {
			restrict: 'A',
			controller: function($scope, $element) {
				$scope.dropped = function(source, dest) {
					var result;
					result = dynamicColumnService.changeColumnOrder($element, source, dest);
					$scope.$apply(function() {
						arraymove($scope.columns, result.sourceIndex, result.destIndex);
					});
				};
			},
			link: function (scope, element, attrs) {
				if (!attrs.columnHeader) {
					throw new Error("columnHeader directive needs a column configuration object, but got " + attrs.dynamicRow);
				}

				if (!scope[attrs.columnHeader]) {
					throw new Error("Can't find the column configuration object on the scope: " + attrs.columnHeader);
				}

				dynamicColumnService.renderColumn(scope, element, scope[attrs.columnHeader]);

				$rootScope.$on("columnToggled", function (event, columnId) {
					dynamicColumnService.toggleColumn(element, columnId);
				});

				$rootScope.$on("recreateColumns", function () {
					dynamicColumnService.renderColumn(scope, element, scope[attrs.columnHeader]);
				});

				$rootScope.$on("columnOrderChanged", function (event, sourceId, destinationId) {
					dynamicColumnService.changeColumnOrder(element, sourceId, destinationId);
				});
			}
		};
	}]);
})(angular);
