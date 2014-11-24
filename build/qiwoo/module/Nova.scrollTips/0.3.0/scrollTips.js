(function(root, factory) {
if(typeof exports === 'object') {
module.exports = factory();
} else if(typeof define === 'function' && define.amd) {
define(['module/widget/1.0.2/widget','module/iscroll/5.1.1/iscroll'], factory);
} else {
root['ScrollTips'] = factory();
}
})(this, function(Widget,IScroll) {
Widget = Widget || this.Widget;
IScroll = IScroll || this.IScroll;


	var directionMap = {
			X: 'left',
			Y: 'top'
		};

	var ScrollTips = Widget.extend({
		attrs: {
			direction: 'Y',
			itemScroll: null,
			selecters: {
				target: '.scrolltips-target'
			},
			elementOffset: null,
			itemsPosition: null
		},
		setup: function(){
			if (this.get('itemScroll') == null) {
				throw new Error('itemScroll is null');
			};
			this._bindEvent();
		},
		refresh: function(){
			var direction = this.get('direction'),
				itemScroll = this.get('itemScroll'),
				targetCls = this.get('selecters.target'),
				targetList = $(targetCls, itemScroll.scroller);

			elementOffset = IScroll.utils.offset(itemScroll.wrapper);
			itemsPosition = getPositionList(targetList, directionMap[direction], itemScroll);

			this.set('elementOffset', elementOffset);
			this.set('itemsPosition', itemsPosition);
		},
		_bindEvent: function(){
			var me = this,
				$element = this.$element,
				itemScroll = this.get('itemScroll'),
				direction = this.get('direction'),
				position,
				orgPosition,
				index,
				isPosing= false;

			itemScroll.on('scroll', function(){
				if (!isPosing) {
					me.trigger('posStart');
				}

				clearTimeout(isPosing);
				isPosing = setTimeout(function(){
					isPosing = false;
					me.trigger('posEnd');
				}, 50);

				var elementOffset = me.get('elementOffset'),
					itemsPosition = me.get('itemsPosition');

				orgPosition = position;
				position = -(this.y + elementOffset[directionMap[direction]]);
				var i = getIndex(position, itemsPosition, index, orgPosition);

				if (i != index) {
					index = i;
					me.trigger('change', [{index: index, position: position}]);
				}
			});

		}
	});

	/*getIndex(position, itemsPosition, index, orgPosition);*/
	function getIndex(p, pl, startIndex, op){
		if(pl.length == 0){ return null; }

		var i = startIndex;

		if(startIndex === undefined) {

			if (p<pl[0]) { return 0; }

			for (i = 0; i < pl.length-1; i++) {
				if(pl[i] <= p && pl[i+1] > p){
					return i;
				}
			}

			return pl.length-1;
		} else {
			op === undefined && (op = p);
			if (p-op>0) {
				if (p<pl[0]) { return 0; }

				for (; i < pl.length-1; i++) {
					if(pl[i] <= p && pl[i+1] > p){
						return i;
					}
				}

				return pl.length-1;
			} else if(p-op<0) {
				if(pl[i] <= p){ return i; }

				for (; i > 0; i--) {
					if(pl[i] > p && pl[i-1] <= p){
						return i-1;
					}
				}

				return 0;
			}
		}

		return i;
	}

	function getPositionList(els, direction, itemScroll){
		return els.map(function(index,item){
			return -IScroll.utils.offset(item)[direction];
		});
	}

	return ScrollTips;
});