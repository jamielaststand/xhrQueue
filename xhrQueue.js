/*
 * xhrqueue Plugin
 * @author      Jamie Greenway
 * @since       10/02/2014
 *
 * Use this to push ajax requests to a queue.
 * Queue iterates through every second to perform requests.
 *
 * Documentation:
 * You will first need to start the plugin running in your script, do this as follows:
 * xhrqueue.run();
 *
 * Add requests to the queue
 * From your script call the addReq() function and pass in your options as follows:
 * xhrqueue.addReq({
 *	type: IE 'POST',
 *	url: 'Some URL',
 *	data: {Params},
 *	success: function(data) {
 *	    // Do somthing with the returned data
 *	},
 *	error: function() {
 *	    // Handle the errors
 *	},
 *	dataType: IE 'json'
 *   });
 */
var xhrqueue = (function() {
	var requests = [];

	return {
		addReq: function(opt) {
			requests.push(opt);
		},
		removeReq: function(opt) {
			//Checks to see if opt is in array then removes it from requests
			if( $.inArray(opt, requests) > -1)
				requests.splice($.inArray(opt, requests), 1);
		},
		run: function() {
			// starts a loop and looks for requests to be performed
			var self = this,
				orgSuc;

			if(requests.length) {
				oriSuc = requests[0].complete;

				requests[0].complete = function() {
					if(typeof oriSuc === 'function') oriSuc();
					requests.shift();
					self.run.apply(self, []);
				};

				$.ajax(requests[0]);
			} else {
				self.tid = setTimeout(function() {
					self.run.apply(self, []);
				}, 1000);
			}
		},
		// Stops the plugin running and clears the time
		stop: function() {
			requests = [];
			clearTimeout(this.tid);
		}
	};
}());
