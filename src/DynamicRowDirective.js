(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("dynamicRow", function ($rootScope, dynamicColumnService) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				if (!attrs.dynamicRow) {
					throw new Error("dynamicRow direcive needs a column configuration object, but got " + attrs.dynamicRow);
				}

				if (!scope[attrs.dynamicRow]) {
					throw new Error("Can't find the column configuration object on the scope: " + attrs.dynamicRow);
				}
				dynamicColumnService.renderRow(scope, element, scope[attrs.dynamicRow]);

				$rootScope.$on("columnToggled", function (event, columnId) {
					dynamicColumnService.toggleColumn(element, columnId);
				});

				$rootScope.$on("recreateColumns", function () {
					dynamicColumnService.renderRow(scope, element, scope[attrs.dynamicRow]);
				});

				$rootScope.$on("columnOrderChanged", function (event, sourceId, destinationId) {
					dynamicColumnService.changeColumnOrder(element, sourceId, destinationId);
				});
			}
		};
	});

})(angular);
