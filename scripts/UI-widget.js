(function($){

	$.widget("ui.mywidget", {
		options: {
			autoOpen: true
		},

		_create: function(){

			// by default, consider this thing closed.
			this._isOpen = false;

			// remember this instance
			$.ui.mywidget.instances.push(this.element);
		},

		_init: function(){

			// call open if this instance should be open by default
			if( this.options.autoOpen ){
				this.open();
			}
		},

		open: function(){
			this._isOpen = true;

			// trigger beforeopen event.  if beforeopen returns false,
			// prevent bail out of this method. 
			if( this._trigger("beforeopen") === false ){
				return;
			}

			// call methods on every other instance of this dialog
			$.each( this._getOtherInstances(), function(){
				var $this = $(this);

				if($this.mywidget("isOpen")){
					$this.mywidget("close");
				}
			});

			// more open related code here

			// trigger open event
			this._trigger("open");

			return this;
		},

		close: function(){
			this._isOpen = false;

			// trigger close event
			this._trigger("close");

			return this;
		},

		isOpen: function(){
			return this._isOpen;
		},

		destroy: function(){
			// remove this instance from $.ui.mywidget.instances
			var element = this.element,
				position = $.inArray(element, $.ui.mywidget.instances);

			// if this instance was found, splice it off
			if(position > -1){
				$.ui.mywidget.instances.splice(position, 1);
			}

			// call the original destroy method since we overwrote it
			$.Widget.prototype.destroy.call( this );
		},

		_getOtherInstances: function(){
			var element = this.element;

			return $.grep($.ui.mywidget.instances, function(el){
				return el !== element;
			});
		},

		_setOption: function(key, value){
			this.options[key] = value;

			switch(key){
				case "something":
					// perform some additional logic if just setting the new
					// value in this.options is not enough. 
					break;
			}
		}
	});

	$.extend($.ui.mywidget, {
		instances: []
	});

})(jQuery);