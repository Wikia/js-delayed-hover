JS delayed hover
================
JS delayed hover is module that enable fires event when you hover over element and move your mouse slow enough.

##Demo:
[Live demo](https://rawgithub.com/Wikia/js-delayed-hover/master/index.html)

##Usage:

    var container = document.getElementById( 'testContainer' );
    delayedHover(
        container, // HTML node element to watch
        {
            checkInterval: 100, // How often mouse speed is calculated
            maxActivationDistance: 20, // Breakpoint for activation, onActivate callback will be fired when mouse speed is below this value
            onActivate: function () { // Function to call when mouse speed meets required conditions
                container.classList.add( 'active' );
            },
            onDeactivate: function() { // Function to call when you stop hovering element
                container.classList.remove( 'active' );
            }
        }
    );
    
##Licence
[MIT](http://en.wikipedia.org/wiki/MIT_License)
