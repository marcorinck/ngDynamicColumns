/**
 * ngDynamicColumns - v0.3.0 - 2015-08-20
 * https://github.com/marcorinck/ngDynamicColumns
 * Copyright (c) 2015 Marco Rinck; Licensed MIT
 */
(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("columnHeader", ['$rootScope', 'dynamicColumnService', function ($rootScope, dynamicColumnService) {

		return {
			restrict: 'A',
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

(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").factory("dynamicColumnService", ['$compile', function ($compile) {

		function createScopedAttrs(options) {
			var key, attrString = "";

			if (options.scopedAttrs) {
				for (key in options.scopedAttrs) {
					if (options.scopedAttrs.hasOwnProperty(key)) {
						attrString = attrString+ ' ' + key + '="' + options.scopedAttrs[key] + '"';
					}
				}
			}

			return attrString;
		}

		function getTh(options) {
			var elemenString = '<table><tr><th data-col-id="' + options.id + '"' + options.directive + ' class="' + options.clazz + '"';

			elemenString = elemenString + createScopedAttrs(options) + '></th></tr></table>';

			return elemenString;
		}

		function getTd(options) {
			var elementString = '<table><tr><td data-col-id="' + options.id + '"' + options.directive + ' class="' + options.clazz + '"';

			elementString = elementString + createScopedAttrs(options) + '></td></tr></table>';

			return elementString;
		}

		function createElement(elementName, options) {
			var element;

			if (elementName === "th") {
				element = getTh(options);
			} else if (elementName === "td") {
				element = getTd(options);
			}

			return angular.element(element).find(elementName);
		}

		function render(scope, element, columns, directiveName, elementName) {
			if (element.children()) {
				element.children().remove();
			}

			columns.forEach(function (column) {
				var options = {
					directive: column[directiveName],
					clazz: column.clazz || '',
					id: column.id
				};

				if (!column.visible) {
					options.clazz = options.clazz + " ng-hide";
				}

				if (column.scopedAttrs && angular.isObject(column.scopedAttrs)) {
					options.scopedAttrs = column.scopedAttrs;
				}

				element.append($compile(createElement(elementName, options))(scope));
			});
		}

		function renderRow(scope, element, columns) {
			render(scope, element, columns, "rowDirective", "td");
		}

		function renderColumn(scope, element, columns) {
			render(scope, element, columns, "columnDirective", "th");
		}

		function toggleColumn($element, toggledColumnId) {
			var columnElement, columnId, children = $element.children();

			Object.keys(children).some(function (key) {
				columnElement = children[key];
				columnId = columnElement.attributes["data-col-id"].value;

				if (columnId === toggledColumnId) {
					columnElement = angular.element(columnElement);
					if (columnElement.hasClass("ng-hide")) {
						angular.element(columnElement).removeClass("ng-hide");
					} else {
						angular.element(columnElement).addClass("ng-hide");
					}
					return true;
				}
			});
		}

		function changeColumnOrder($element, source, dest) {
			var forward = false, temp, children = $element.children(),
				sourceElement, destElement, sourceIndex, destIndex;

			Object.keys(children).some(function (key, index) {
				var columnId = children[key].attributes["data-col-id"].value;

				if (columnId === source) {
					sourceElement = angular.element(children[key]);
					sourceIndex = index;
				} else if (columnId === dest) {
					destElement = angular.element(children[key]);
					destIndex = index;

					if (!sourceElement) {
						forward = true;
					}
				}

				if (sourceElement && destElement) {
					return true;
				}
			});


			if (sourceElement && destElement) {
				if (forward) {
					temp = destElement.after(sourceElement);
					sourceElement.after(temp);

				} else {
					destElement.after(sourceElement);
				}

				return {
					destIndex: destIndex,
					sourceIndex: sourceIndex
				};
			}

			return null;
		}

		return {
			renderRow: renderRow,
			renderColumn: renderColumn,
			toggleColumn: toggleColumn,
			changeColumnOrder: changeColumnOrder
		};
	}]);

})(angular);

(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("dynamicRow", ['$rootScope', 'dynamicColumnService', function ($rootScope, dynamicColumnService) {
		var $event;

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

				$rootScope.$on("columnOrderChanged", function (event, sourceId, destinationId, options) {
					var indexes = dynamicColumnService.changeColumnOrder(element, sourceId, destinationId),
						_options = options || {};

					//move columns in column configuration too, but only once per event ...
					if ($event !== event && !_options.skipUpdatingColumnConfiguration) {
						scope[attrs.dynamicRow].splice(indexes.destIndex, 0, scope[attrs.dynamicRow].splice(indexes.sourceIndex,1)[0]);
						$event = event;
					}
				});
			}
		};
	}]);

})(angular);

(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns", []);
})(angular);
