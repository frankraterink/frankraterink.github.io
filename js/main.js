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

    var timer = $('#timer');
    if (timer) {
      this.startTimer(timer);
    }

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

  startTimer: function(timer){

    if (Notification.permission !== "granted")
      Notification.requestPermission();

    console.log('start timer', timer);
    var countdown = timer.find('#countdown');
    var focustask = timer.find('#focustask');
    var focusminutes = timer.find('#focusminutes');
    var focusstart = timer.find('#focusstart');
    var focusdone = timer.find('#focusdone');
    var timer;
    var timerIsOn = false;
    var s;
    var s = 60;

    focusminutes.change(function(){
      s = parseInt(focusminutes.val()) * 60
    });
    focusstart.click(function(){
      if (s == null) {
        focusminutes.focus();
        return;
      }


      if (timerIsOn) {
        timerIsOn = false;
        focusstart.text('start');
        var secOnPause = s;
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timerIsOn = true;
        focusstart.text('pause');

        if (s == null || s == 0) {
          s = parseInt(focusminutes.val()) * 60
        }
        timer = setInterval(function() {
          s--;

          d = Number(s);
          var th = Math.floor(d / 3600);
          var tm = Math.floor(d % 3600 / 60);
          var ts = Math.floor(d % 3600 % 60);

          var countdowntext = (th == 0 ? '' : (th + ":")) + (tm < 10 && th > 0 ? '0' + tm : tm) + ":" + (ts < 10 ? '0' + ts : ts); //zero padding on minutes and seconds

          countdown.text(focustask.val() + ' · ' + countdowntext);


          document.title = 'focus  ☯  ' + countdowntext;

          if (s == 0) {
            clearInterval(timer);
            timerIsOn = false;
            focusstart.text('start');
            focusminutes.val('');
            s = 0;
            document.title = 'focus  ☯  done';

            if (Notification.permission !== "granted")
              alert('Goed dat je je tijd hebt genomen om te focussen.');
            else {
              var notification = new Notification('focus', {
                body: 'Goed dat je je tijd hebt genomen om te focussen.'
              });

              notification.onclick = function () {
                window.open("http://franklabs.nl/focus");
              };
            }
          }
        }, 1000);
      }

    });
    focusdone.click(function(){
      clearInterval(timer);
      timerIsOn = false;
      focusstart.text('start');
      focusminutes.val('');
      s = 0;
      focustask.val('').focus();
    });


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
