(function(){  

xtag.customEvents.resize = {
  onAdd: function(event, fn){
    var element = this,
        resize = 'onresize' in this;
        
    if (!resize && !this.xtag.sensor) {
      var sensor = this.xtag.sensor = document.createElement('div');
          sensor.className = 'resize-sensor';
          sensor.innerHTML = '<div class="resize-overflow"><div></div></div><div class="resize-underflow"><div></div></div>';
        
      var x = 0, y = 0,
          first = sensor.firstElementChild.firstChild,
          last = sensor.lastElementChild.firstChild,
          matchFlow = function(event){
            var change = false,
                width = element.offsetWidth;
            if (x != width) {
              first.style.width = width - 1 + 'px';	
              last.style.width = width + 1 + 'px';
              change = true;
              x = width;
            }
            var height = element.offsetHeight;
            if (y != height) {
              first.style.height = height - 1 + 'px';
              last.style.height = height + 1 + 'px';	
              change = true;
              y = height;
            }
            if (change && event.currentTarget != element) xtag.fireEvent(element, 'resize');
          };
      
      if (window.getComputedStyle(element).position == 'static'){
        element.style.position = 'relative';
        sensor._resetPosition = true;
      }
      
      xtag.addEvents(sensor, {
        overflow: matchFlow,
        underflow: matchFlow
      });
      xtag.addEvent(sensor.firstElementChild, 'overflow', matchFlow);
      xtag.addEvent(sensor.firstElementChild, 'underflow', matchFlow);
      
      element.appendChild(sensor);
      matchFlow({});
    }
    
    var events = this.xtag.flowEvents || (this.xtag.flowEvents = []);
    if (events.indexOf(fn) == -1) events.push(fn);
    if (!resize) this.addEventListener('resize', fn, false);
    this.onresize = function(e){
      events.forEach(function(fn){
        fn.call(element, e);
      });
    };
  },
  onRemove: function(event, fn){
    var events = this.xtag.flowEvents,
        index = events.indexOf(fn);
		if (index > -1) events.splice(index, 1);
		if (!events.length) {
			var sensor = this.xtag.sensor;
			if (sensor) {
				this.removeChild(sensor);
				if (sensor._resetPosition) this.style.position = 'static';
				delete this.xtag.sensor;
			}
			if ('onresize' in this) this.onresize = null;
			delete this.xtag.flowEvents;
		}
		this.removeEventListener('resize', fn);
  }
};

})();