# OpenLMIS-UI Coding Conventions

This document describes the desired formatting to be used withing the OpenLMIS-UI repositories, many of the conventions are adapted from [John Papa's Angular V1 styleguide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) and [SMACSS by Jonathan Snook.](https://smacss.com/)

## General
The following conventions should be applied to all sections of UI development:
* All intentation should be 4 spaces
* Legacy code should be refactored to meet coding conventions
* No thrid party libraries should be included in a OpenLMIS-UI repository

## File Structure
All file types should be organized together within the `src` directory according to functionality, not file type — the goal is to keep related files together.

Use the following conventions:
* File names are lowercase and dash-seperated
* Files in a directory should be as flat as possible (avoid sub-directories)
* If there are more than 12 files in a directory, try to divide files into subdirectories based on functional area

*Each file type section below has specifics on their naming conventions*

## HTML Markup Guidelines

Less markup is better markup, and semantic markup is the best.

This means we want to avoid creating layout specific markup that defines elements such as columns or icons. Non-semantic markup can be replicated by using CSS to create columns or icons. In some cases a layout might not be possible without CSS styles that are not supported across all of our supported browsers, which is perfectly acceptiable.

Here is a common pattern for HTML that you will see used in frameworks like Twitter's Bootstrap (which we also use)
```
<li class="row">
	<div class="col-md-9">
		Item Name
	</div>
	<div class="col-md-3">
		<a href="#" class="btn btn-primary btn-block">
			<i class="icon icon-trash"></i>
			Delete
		</a>
	</div>
</li>
<div class="clearfix"></div>
```

The above markup should be simplified to:
```
<li>
	Item Name
	<button class="trash">Delete</button>
</li>
```
This gives us simpler markup, that could be restyled and reused depending on the context that the HTML section is inserted into. We can recreate the styles applied to the markup with CSS such as:
* A ::before pseudo class to display an icon in the button
* Using float and width properties to correctly display the button
* A ::after pseudo class can replace any 'clearfix' element (which shouldn't exist in our code)

See the UI-Styleguide for examples of how specific elements and components should should be constructed and used. 

### Naming Convention
_descriptive-name_.html

## SASS & CSS Formatting Guidelines

General SASS and CSS conventions:
* Only enter color values in a variables file
* Only enter pixel or point values in a variables file
* Variable names should be lowercase and use dashes instead of spaces (ie: _$sample-variable_) 
* Avoid class names in favor of child element selectors where ever possible
* Files should be less than 200 lines long
* CSS class names should be lowercase and use dashes instead of spaces

### SMACSS
The CSS styles should reflect the SMACSS CSS methodology, which has 3 main sections — base, layout, and module. SMACSS has other sections and tennants, which are useful, but are not reflected in the OpenLMIS-UI coding conventions. 

#### Base
CSS styles applied directly to elements to create styles that are the same throughout the application.

#### Layout
CSS styles that are related primarly to layout in a page — think position and margin, not color and padding — these styles should never be mixed with base styles (responsive CSS should only be implemented in layout).

#### Module
This is a css class that will modify base and layout styles for an element and it's sub-elements.

### SASS File-Types
Since SASS pre-processes CSS, there are 3 SCSS file types to be aware of which are processed in a specific order to make sure the build process works correctly.

#### Variables
A variable file is either named 'variables.scss' or matches '*.variables.scss'

Varriables files are the first loaded file type and include any variables that will be used through out the application — *There should be as few of these files as possible*.

The contents of a varriables file should only include SASS variables, and output no CSS at anypoint.

There is no assumed order in which varriables files will be included, which means:
* Varriable files shouldn't have overlapping varriables
* Implement [SASS's variable default (!default)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_)

### Mixins
A mixin file matches the following pattern *.mixin.scss

Mixins in SASS are reusable functions, which are loaded second in our build process so they can use global variables and be used in any other SCSS file. 

There should only be one mixin per file, and the file name should match the function's name, ie: 'simple-function.mixin.scss'

### All Other SCSS and CSS Files
All files that match '*.scss' or '*.css' are loaded at the same time in the build process. This means that no single file can easily overwrite another files CSS styles unless the style is more specific or uses `!imporant` — This creates the following conventions:
* Keep CSS selectors as general as possible (to allow others to be more specific)
* Avoid using !important

To keep file sizes small, consider breaking up files according to SMACSS guidelines by adding the type of classes in the file before .scss or .css (ie: `navigation.layout.scss`)

## Javascript Formatting Guidelines

General conventions:
* All code should be within an [immedately invoked scope](https://github.com/johnpapa/angular-styleguide/tree/master/a1#iife)
* *ONLY ONE OBJECT PER FILE*
* Variable and function names should be written in camelCase
* All Angular object names should be written in CamelCase

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation) built with [grunt-ngdocs.](https://www.npmjs.com/package/grunt-ngdocs)

* Any object's exposed methods or variables must be documented with ngDoc

### Unit Testing Guidelines
stub stub stub

### Angular V1 Object Guidelines
AngularJS has many different object types — here are the following types the OpenLMIS-UI primarily uses. If there is a need for object types not documented, please refer to the John Papa Angular V1 styleguide.

#### Constants
Constants are Javascript variables that won't change but need to be resued between multiple objects within an Angular module. Using constants is important because it becomes possible to track an objects dependencies, rather than use variables set on the global scope.

It's also [useful to wrap 3rd party objects and libraries](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#vendor-globals) (like jQuery or bootbox) as an Angular constant. This is useful because the dependency is declared on the object. Another useful feature is that if the library or object isn't included, Angualr will throw a single verbose error message.

*Conventions:*
* All constant variable names should be upper case and use underscores instead of spaces (ie VARIABLE_NAME) 
* If a constant is only relivant to a single Angular object, set it as a variable inside the scope, not as an Angular constant
* If the constant value needs to change depending on build variables, format the value like @@VARIABLE_VALUE, and which should be replaced by the grunt build process if there is a matching value
* Wrap 3rd party services as constants, if are not already registered with Angular

#### Service
[John Papa refers to services as Singletons,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#services) which means they should only be used for application information that has a single instance. Examples of this would include the current user, the application's connection state, or the current library of localization messages.

*Conventions:*
* Services should always return an object
* Services shouldn't have their state changed through properties, only method calls

#### Factory
Factories should be the most used Angualr object type in any application. [John Papa insists that factories serve a single purpose,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#factories) and should be extended by variabled they are called with.

This means that Factories should generally return a function that will return an object or set of objects that can be manipulated. It is common for a factory to include methods for interacting with a server, but this isn't nessicarry.

An example factory might look like:

```
angular.module('openlmis-sample')
    .factory('SampleFactory', sample);

sample.$inject = [];
function sample(){
	var savedContext;
	
	return function (context) {
		savedContext = context;
	}
}

```

#### Controller
Controllers are all about connecting data and logic from Factories and Services to HTML Views. An ideal controller won't do much more than this, and will be as 'thin' as possible.

Controllers are typically specific in context, so as a rule controllers should never be reused. A controller can be linked to a HTML form, which might be reused in multiple contexts — but that controller most likely wouldn't be applicable in other places.

It is also worth noting that [John Papa insists that controllers don't directly manipulate properties](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#controllers) in $scope, but rather the [ControllerAs](https://docs.angularjs.org/api/ng/directive/ngController) syntax should be used which injects the controller into a HTML block's context. The main rationale is that it makes the $scope variables less cluttered, and makes the controller more testable as an object.

*General Conventions*
* Should be only object changing application $state
* Is used in a single context
* Doesn't directly manipulate $scope variables

#### Routes
Routing logic is defined by [UI-Router,](https://ui-router.github.io/ng1/) where a URL path is typically paired with an HTML View and Controller.

*General Conventions*
* The [UI-Router resolve properties](https://github.com/angular-ui/ui-router/wiki#resolve) are used to ease loading on router
* [Routes should define their own views,](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y271) if their layout is more complicated than a single section 

#### HTTP Interceptor
HTTP Interceptors are technically factories that have been configured to 'intercept' certain types of requests in Angular and modify their behavior. This is recommended because other Angular objects can use consistent Angular objects, reducing the need to write code that is specialized for our own framework.

The Angular guide to writting [HTTP Interceptors is here](https://docs.angularjs.org/api/ng/service/$http#interceptors)

*General Conventions*
* Write interceptors so they only chanage a request on certain conditions, so other unit tests don't have to be modified for the interceptors conditions
* Don't include HTTP Interceptors in openlmis-core, as the interceptor might be injected into all other unit tests — which could break everything

#### Directive
Directives are pieces of HTML markup that have been extended to do a certain function. *This is the only place where it is reasonable to manipulate the DOM*.

*General Conventions*
* Restrict directives to only elements or attributes
* Don't use an isolated scope unless you absolutely have to
* If the directive needs extenal information, use a controller — don't manipulate data in a link function

#### Modal
A modal object isn't a 'native Angular object' — it is a service or factory that displays a modal window. This is done for convience and because it allows modal windows to not be declared in html files — and be used more easily by controllers (or even services, if appropriate).

*General Conventions*

#### HTML Views
Angular allows HTML files to have variables and simple logic evaluated within the markup.

*General Conventions*
* If there is logic that is more complicated than a single if statement, move that logic to a controller
* Use filters to format variable output — don't format variables in a controller