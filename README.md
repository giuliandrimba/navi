# Navi

Navi is a router and page navigation library.

## How it works

## Documentation

## `map`

Responsible for maping the request of a page with an javascript view.

> Sintax: `Navi.map(route, view, render_target, optional)`

### Parameters

### __route__: 

String pattern or regular expression to be matched against the requests. It can accept optional parameters preceded by " : ".
> __Examples:__

``` javascript
"works/:id" //"works/1", "works/2", etc
```
``` javascript
"works/:id/:page" //"works/1/2", "works/2/3", etc
```

### __view__: 

This is the "view" object of the page, this object is responsible for rendering the page (eg: using templates) and applying intro and outro animations.

A Navi view must have the following methods:

##### render()
Must return the HTML of the page, that will be used by Navi to render the page.

> __Example__:

``` javascript
render:function()
{
  return "<p>This is the content of the page</p>"
}
```

If you passed optional parameters in the route:

``` javascript
Navi.map("work/:id",work_view,"body");
```
They will be accessible as parameters in the `render` method.

``` javascript
render:function(id)
{
  return "<p>The work id is" + id + "</p>"
}
```


##### intro(callback)
Responsible for animating the introduction of the view. It is called after the `render` method, and has to call a callback when the animation is finished to notify Navi the the page has showed.

> __Example__:

``` javascript
intro:function(callback)
{
  var main = $(".main_page");
  main.css({opacity:0});
  main.animate({opacity:1},1000, callback);
}
```

##### outro(callback)
Responsible for animating the exit of the view. It is called before the Navi removes the page from the DOM. It has to call a callback when the animation is finished to notify Navi the the page can be removed.

> __Example__:

``` javascript
outro:function(callback)
{
  var main = $(".main_page");
  main.css({opacity:0});
  main.animate({opacity:1},1000, callback);
}
```

### __render_target__: 

This is the element at which the view will be renderer, it accepts any css selector.

> __Example__:
``` javascript
Navi.map("home",home_view,".home_content div")
```

Navi will insert the `home_view` `render` method at the element `$(".home_content div")`

### optional: 

Navi.map accepts some optional parameters:

`{modal:true}`: Sets the page as modal, it will be rendered above the current page, and the URL will no change.

> __Example__:
``` javascript
Navi.map("home",home_view,".home_content div",{modal:true});
```

Navi will insert the `home_view` `render` method at the element `$(".home_content div")`

## `init`

Initializes the Navi library.

> Sintax: `Navi.init()`

It should be called after all the Navi mappings.

### Events

##### route_change: 

Event fired when the URL changes. It passes an object with the name of the page to the handler.

> Example:

``` javascript
Navi.bind("route_change", onRouteChange);

function onRouteChange(params)
{
  console.log("new page is ", params.page);
}
```

##### page_change: 

Event fired when the page finished its introduction. It passes an object with the name of the page to the handler.

> Example:

``` javascript
Navi.bind("page_change", onPageChange);

function onRouteChange(params)
{
  console.log("new page is ", params.page);
}
```

## Examples
_(Coming soon)_

## License
Copyright (c) 2012 Giulian Drimba  
Licensed under the MIT license.
