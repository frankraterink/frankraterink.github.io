function Franklabs() {

	this.gotoPhoto = 0;
	this.windowScrollTop = 0;
	this.headerAnimation = true;

	this.launchLazyLoading();

	$(this.init.bind(this)); //set franksite as this
}

Franklabs.prototype = {
	init: function() {
		
		this.$body = $('body');
		this.$window = $(window);
		this.$header = $('.site-header');

		var gallery = $('.gallery').length;
		if (gallery && !this.is_touch_device()) {
			this.headerAnimation = false;
			this.launchGalleryIntroAnimation();
			this.launchGalleryKeyboardNav();
		}

		// set this for event handlers
		// to prevent more than one instance of mousemove and scroll
		// and to be able to unbind
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onScroll = this.onScroll.bind(this);

		this.enhanceForNonTouchDevices();

		this.$window.resize(this.enhanceForNonTouchDevices.bind(this));
	},
	

	enhanceForNonTouchDevices: function () {
		// unbind previous bind
		this.unbindHeaderAnimation();

		if (this.is_touch_device() || innerWidth < 1150) {
			this.$body.removeClass('enhanceUIforNonTouch');
			this.resetHeader();
			this.$header.removeClass('hidden');
		} else {
			this.$body.addClass('enhanceUIforNonTouch');
			this.bindHeaderAnimation();	
		}
	},

	is_touch_device: function() {
		return (('ontouchstart' in window)
			|| (navigator.MaxTouchPoints > 0)
			|| (navigator.msMaxTouchPoints > 0));
	},

	resetHeader: function() {
		this.setTranslate(0, 0);
	},

	launchLazyLoading: function() {
		$("img.lazy").lazyload({
			threshold : 1500
		});
	},

	launchGalleryIntroAnimation: function () {
		var photoFrameTween = new ui.Tween({
			values: {
				height: '107vh'
			},
			duration: 1200
		});

		var photoFrameFigureTween = new ui.Tween({
			values: {
				width: '1057px'
			},
			duration: 1200
		});

		$("html, body").animate({ scrollTop: 0 }, 800, function(){
			
			var photoFrames = ui.select('.photo-frame'); // select returns Iterator
			photoFrames.stagger('start', {
				interval: 5,
				ease: 'easeOut'
			}, photoFrameTween);

			var photoFramesFigure = ui.select('.photo-frame figure'); // select returns Iterator
			photoFramesFigure.stagger('start', {
				interval: 5,
				ease: 'easeOut'
			}, photoFrameFigureTween);
		});

		setTimeout(function(){
			this.headerAnimation = true;
		}.bind(this), 3000);
	},

	launchGalleryKeyboardNav: function() {
		var $photos = $('.photo-frame');
		this.$body.keydown(function(e) {
			if(e.keyCode == 39 || e.keyCode == 40) { // right, down
				e.preventDefault();
				if (this.gotoPhoto < $photos.length - 1) {
					this.gotoPhoto++;
					this.$window.scrollTop($photos.eq(this.gotoPhoto).offset().top);	
				}
			}

			else if(e.keyCode == 37 || e.keyCode == 38) { // right, down
				e.preventDefault();
				if (this.gotoPhoto > 0) {
					this.gotoPhoto--;
					this.$window.scrollTop($photos.eq(this.gotoPhoto).offset().top);
				}			
			}
		}.bind(this));
	},

	bindHeaderAnimation: function() {
		this.$body.on('mousemove', this.onMouseMove);
		this.$window.on('scroll', this.onScroll);
	},

	unbindHeaderAnimation: function() {
		this.$body.off('mousemove', this.onMouseMove);
		this.$window.off('scroll', this.onScroll);
	},

	onMouseMove: function() {
		this.$header.addClass('visible');

		if (this.headerAnimation) {
			this.setHeaderLocation(event.pageX, event.pageY);	
		}
	},

	onScroll: function() {
		this.windowScrollTop = this.$window.scrollTop();
	},

	setHeaderLocation: function(x, y) {
		var movedX = (x * -1 + 300)/1.5;
		var movedY = (y * -1 + 300)/1;
		if (this.windowScrollTop > 0) {
			movedY += this.windowScrollTop;
		}
		this.setTranslate(movedX, movedY);
	},

	setTranslate: function(x, y) {
		var translate = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
		this.$header.css({
			'-webkit-transform' : translate,
			'-ms-transform'     : translate,
			'transform'         : translate
		});
	}

}

franklabs = new Franklabs();