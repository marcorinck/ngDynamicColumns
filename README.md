#ngDynamicColumns

ngDynamicColumns is providing two angularJS directives to render a datatable with full dynamic columns. That means, that
the order of the columns in a datatable is not hard-coded but can be freely changed. A column can be toggled on and off
too.

The cell contents and the contents of the headers are defined with their own directives so that they can be as complex
and flexible as angularJS allows. You can use every angularJS feature in them as you like.

##Installation

* with bower: `bower install ngDynamicColumns` (not yet!)
* manual: download `ngDynamicColumns.js`

Inside your angularJS app define a dependency to 'ngDynamicColumns' like this: `angular.module("app", ["ngDynamicColumns"])`

##Configuration

Both directives need the same configuration object to render the columns. The object should be an array of objects and
the objects need to have these attributes:

`insert more doc here`

Example:

````javascript
$scope.columns = [
    {"id": "manufacturer", rowDirective: "manufacturer", columnDirective: 'manufacturer-header', visible: true, clazz: 'manufacturerClass'},
    {"id": "model", rowDirective: "model", columnDirective: 'model-header', visible: true, clazz: 'modelClass'},
];

````

##Usage

ngDynamicColumns currently is specifically designed to render the &lt;td&gt; and &lt;th&gt; tags of a html table.
This is an example usage:

````html
<table>
  <thead>
    <tr column-header="columns"/>
  </thead>
  <tbody>
    <tr ng-repeat="item in items" dynamic-row="columns" />
  </tbody>
</table>
````

###dynamic-row directive

This directive should be used in conjunction with a ng-repeat on a tr element and renders for every repeat a set of
td elements in the desired order. This directive needs a column configurstion object to get the neccessary information
how to render the columns/td tags. See below for info about this configuration object.

###column-header directive

This directive should be used on a tr element in a thead section and renders th elements according to the column
configuration object.

###Events

As ngDynamicColumns was designed to be used with complex and huge tables in mind, it does not use any watchers by itself
to minimize impact on performance (though your column and row directives can use watchers of course).

So, to rerender the table after changes in the column configuration you have to emit events on the $rootScope.
ngDynamicColumns acts on these events:

* __columnToggled__ - this event expects a column ID as transmitted parameter and toggles visibility of said column ID.
 To toggle the visibility it sets and removes the ng-hide class on &lt;td&gt; and &lt;th&gt; elements
* __recreateColumns__ - this rerenders the whole &lt;table&gt; with all elements. Warning: this can have huge impact on
 rendering performance when your table has a lot of DOM elements, as all elements are deleted and recreated again. You
 can use this event, when column order has changed for instance. It does not need any parameters
* __columnOrderChanged__ - this event __moves__ one column to the place of another column. It expects two paramters: the
 source column ID and the destination column ID. This can be used for instance after a drag and drop action by the user
 who moves columns around. As this does not delete elements from the DOM but moves existing elements to another place, its
 very fast even in huge and complex tables.

###Content directives

`insert more doc here`