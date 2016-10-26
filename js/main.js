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


    var countdown = timer.find('#countdown');
    var focustask = timer.find('#focustask');
    var focusminutes = timer.find('#focusminutes');
    var focusstart = timer.find('#focusstart');
    var focusdone = timer.find('#focusdone');
    var tasklist = timer.find('#tasklist');
    var comments = timer.find('#comments p');
    var timer;
    var timerIsOn = false;
    var s;
    var defaultTime = 120;
    var s = defaultTime;
    var startTime;
    var now;

    focusminutes.change(function(){
      s = parseInt(focusminutes.val()) * 60
    });
    focusstart.click(function(e){

      if (Notification.permission !== "granted")
        Notification.requestPermission();

      e.preventDefault();

      if (timerIsOn) {
        // KLAAR
        clearInterval(timer);

        if (timerIsOn) {
          var newTask = $('<li>' + focustask.val() + '</li>');
          tasklist.find('ul').prepend(newTask);
        }

        timerIsOn = false;

        focustask.prop('disabled', false);
        focusminutes.prop('disabled', false);


        focusstart.text('start');
        focusminutes.val('');
        s = defaultTime;
        focustask.val('').focus();

        document.title = 'focus  ☯  done';


      } else {
        // START

        if (focustask.val() == '') {
          focustask.focus();
          return;
        }

        if (s == null || isNaN(s)) {
          s = defaultTime;
        }

        if (s > 2400) {
          comments.text('Iets minder hooi op de vork is ook prima.');
          focusminutes.focus();
          return;
        }

        if (s < 0) {
          comments.text('Probeer te focussen op de toekomstige tijd.');
          focusminutes.focus();
          return;
        }

        startTime = new Date();

        comments.text('');

        clearInterval(timer);
        timerIsOn = true;
        focusstart.text('klaar');

        focustask.prop('disabled', true);
        focusminutes.prop('disabled', true);

        if (s == null || s == 0) {
          s = parseInt(focusminutes.val()) * 60
        }
        timer = setInterval(function() {

          now = new Date();

          var sec = s - Math.floor((now - startTime)/1000);

          d = Number(sec);
          var th = Math.floor(d / 3600);
          var tm = Math.floor(d % 3600 / 60);
          var ts = Math.floor(d % 3600 % 60);

          var countdowntext = (th == 0 ? '' : (th + ":")) + (tm < 10 && th > 0 ? '0' + tm : tm) + ":" + (ts < 10 ? '0' + ts : ts); //zero padding on minutes and seconds

          countdown.text(focustask.val() + ' · ' + countdowntext);


          document.title = 'focus  ☯  ' + countdowntext;

          if (sec == 0 || sec < 0) {
            // KLAAR
            var newTask = $('<li>' + focustask.val() + '</li>');
            tasklist.find('ul').prepend(newTask);

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

            clearInterval(timer);
            timerIsOn = false;
            focusstart.text('start');
            focustask.val('');
            focusminutes.val('');
            focustask.prop('disabled', false);
            focusminutes.prop('disabled', false);
            s = defaultTime;
            document.title = 'focus  ☯  done';


          }
        }, 300);
      }

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
