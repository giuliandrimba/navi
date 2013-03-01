# Navi

Navi is a router and page navigation library.

## How it works

## Documentation

## `map`

> Sintax: `map(route, view, render_target)`

#### Parameters

##### __route__: 

String pattern or regular expression to be matched against the requests. It can accept optional parameters preceded by ":".
> __Examples:__

``` javascript
"works/:id" //"works/1", "works/2", etc
```
``` javascript
"works/:id/:page" //"works/1/2", "works/2/3", etc
```

##### __view__: 

This is the "view" object of the page, this object is responsible for rendering the page (eg: using templates) and applying intro and outro animations.

A Navi view must have the following methods:

``` javascript
render()
```
> Must return the HTML of the page, that will be used by Navi to render the page.

> __Example__:

``` javascript
render:function()
{
  return "<p>This is the content of the page</p>"
}
```

## Examples
_(Coming soon)_

## License
Copyright (c) 2012 Giulian Drimba  
Licensed under the MIT license.
