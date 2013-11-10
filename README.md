#ngDynamicColumns

ngDynamicColumns is providing two angularJS directives to render a datatable with full dynamic columns. That means, that
the order of the columns in a datatable is not hard-coded but can be freely changed. A column can be toggled on and off too.

The cell contents and the contents of the headers are defined with directives so that they can be as complex and flexible
as you like. You can use every angularJS feature in them as you like.

##Installation

* with bower: `bower install ngDynamicColumns`
* manual: download `ngDynamicColumns.js`

Inside your angularJS app define a dependency to 'ngDynamicColumns' like this: `angular.module("app", ["ngDynamicColumns"])`

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

##Configuration

Both directives need the same configuration object to render the columns. The object should be an array of objects and
the objects need to have these attributes:
