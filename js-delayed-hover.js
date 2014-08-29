/**
 * JS delayed hover is module that enable fires event when you
 * hover over element and move your mouse slow enough.
 *
 * Usage:
 *
 * 	var container = document.getElementById( 'testContainer' );
 *	delayedHover(
 *		container, // HTML node element to watch
 *		{
 *			checkInterval: 100, // How often mouse speed is calculated
 *			maxActivationDistance: 20, // Breakpoint for activation, onActivate callback will be fired when mouse speed is below this value
 *			onActivate: function () { // Function to call when mouse speed meets required conditions
 *				container.classList.add( 'active' );
 *			},
 *			onDeactivate: function() { // Function to call when you stop hovering element
 *				container.classList.remove( 'active' );
 *			}
 *		}
 *	);
 *
 * Copyright 2014 Wikia Inc.
 * Released under the MIT license
 * https://github.com/Wikia/js-delayed-hover
 */

(function() {
	var utils, DelayedHoverModule;

	/**
	 * Additional functions to help module to work.
	 */
	utils = {
		/**
		 * Just simple one-time-defined function that will do nothing
		 */
		noop: function() {},

		/**
		 * Returns first object extended by the properties of the second
		 * @param {Object} dst Object to be extended
		 * @param {Object} src Object with properties that should be added to the previous
		 * @return {Object} Extended object
		 */
		extend: function(dst, src) {
			var p;
			for (p in src) {
				if (src.hasOwnProperty (p)) {
					dst[p] = src[p];
				}
			}
			return dst;
		}
	};

	/**
	 * Module core
	 */
	DelayedHoverModule = function() {
		var getMoveDistance,
			mouseEnterHandler, mouseLeaveHandler, mouseMoveHandler,
			lastLocation, lastCheckedLocation, options, possiblyActivate, timeoutId;

		/**
		 * Module options
		 */
		options = {
			checkInterval: 100,
			maxActivationDistance: 20,
			onActivate: utils.noop,
			onDeactivate: utils.noop
		};

		/**
		 * Calculate distance between
		 * !Important: This is not a real distance, it's a sum of distances on both axes.
		 * This solution was chosen to increase module performance.
		 * @returns {number}
		 */
		getMoveDistance = function() {
			return Math.abs( lastCheckedLocation.x - lastLocation.x ) + Math.abs( lastCheckedLocation.y - lastLocation.y );
		}

		/**
		 * Function that checks mouse speed  activates callback when conditions are met
		 */
		possiblyActivate = function() {
			if ( lastLocation && getMoveDistance() <= options.maxActivationDistance ) {
				options.onActivate();
			} else {
				timeoutId = setTimeout( possiblyActivate, options.checkInterval );
			}

			if ( lastLocation ) {
				lastCheckedLocation = lastLocation;
			}
		};

		/**
		 * Mouse move handler
		 */
		mouseMoveHandler = function( e ) {
			lastLocation = {x: e.pageX, y: e.pageY};
		};

		mouseEnterHandler = function( e ) {
			lastCheckedLocation = {x: e.pageX, y: e.pageY};
			lastLocation = null;
			possiblyActivate();
		};

		mouseLeaveHandler = function() {
			if ( timeoutId ) {
				clearTimeout( timeoutId );
			}

			options.onDeactivate();
		};

		/**
		 * Prepare variable, hook handler
		 */
		this.init = function( elem, opts ) {
			options = utils.extend(options, opts);

			elem.addEventListener( 'click', options.onActivate );
			elem.addEventListener( 'mouseenter', mouseEnterHandler );
			elem.addEventListener( 'mouseleave', mouseLeaveHandler );
			elem.addEventListener( 'mousemove', mouseMoveHandler );

			return this;
		}
	}


	window.delayedHover = function( elem, options ) {
		var delayedHover = new DelayedHoverModule();
		return delayedHover.init( elem, options );
	};
})();
