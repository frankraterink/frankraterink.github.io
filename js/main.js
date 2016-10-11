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
			//this.launchGalleryIntroAnimation();
			this.launchGalleryKeyboardNav();
		}

		// set this for event handlers
		// to prevent more than one instance of mousemove and scroll
		// and to be able to unbind
		this.onScroll = this.onScroll.bind(this);

		this.enhanceForNonTouchDevices();



		this.$window.resize(this.enhanceForNonTouchDevices.bind(this));
	},

	enhanceForNonTouchDevices: function () {
		// unbind previous bind

		if (this.is_touch_device() || innerWidth < 1150) {
			this.$body.removeClass('enhanceUIforNonTouch');
			this.$header.removeClass('hidden');
		} else {
			this.$body.addClass('enhanceUIforNonTouch');

		}
	},

	is_touch_device: function() {
		return (('ontouchstart' in window)
			|| (navigator.MaxTouchPoints > 0)
			|| (navigator.msMaxTouchPoints > 0));
	},

	launchLazyLoading: function() {
		$("img.lazy").lazyload({
			threshold : 1500
		});
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

	onScroll: function() {
		this.windowScrollTop = this.$window.scrollTop();
	},

}

franklabs = new Franklabs();
