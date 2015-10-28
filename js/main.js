var $body;
var $header;

var gotoPhoto = 0;
var windowScrollTop = 0;
var headerAnimation = true;

// ON LAUNCH
launchLazyLoading();

// ON DOC READY
$(function(){
	// DEFINE VARS
	$body = $('body');
	$header = $('.site-header');

	// LAUNCH THE ENHANCEMENTS
	
	var gallery = $('.gallery').length;
	if (gallery > 0) {
		headerAnimation = false;
		launchGalleryIntroAnimation();
		launchGalleryKeyboardNav();	
	}

	//console.log($(window).width());
	if ($(window).width() > 600) {
		bindHeaderAnimation();	
	}

	isTouchDevice();

	$(window).resize(function() {

		isTouchDevice();


	  if ($body.hasClass('enhanceUIforNonTouch')) {
			bindHeaderAnimation();
		} else {
			$body.unbind("mousemove");
			resetHeader();
		}
	});
});

function isTouchDevice() {
  if ('ontouchstart' in window || 'onmsgesturechange' in window || $(window).width() < 600) {
  	$body.removeClass('enhanceUIforNonTouch');
  } else {
  	$body.addClass('enhanceUIforNonTouch');
  }
};

function resetHeader() {
	var translate = 'translate(0px, 0px)';

  $header.css({
    '-webkit-transform' : translate,
    '-ms-transform'     : translate,
    'transform'         : translate
  });
}


function launchLazyLoading() {
	$("img.lazy").lazyload({
		threshold : 1500
	});
}

function launchGalleryIntroAnimation() {
	var photoFrameTween = new ui.Tween({
    values: {
    	height: '103vh',
    	minHeight: '830px'
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
		headerAnimation = true;
	}, 3000);
}

function launchGalleryKeyboardNav() {
	
	var $photos = $('.photo-frame');

	$body.keydown(function(e) {
		if(e.keyCode == 39 || e.keyCode == 40) { // right, down
			e.preventDefault();
			if (gotoPhoto < $photos.length - 1) {
				gotoPhoto++;
				$(window).scrollTop($($photos[gotoPhoto]).offset().top);	
			}
		}

		else if(e.keyCode == 37 || e.keyCode == 38) { // right, down
			e.preventDefault();
			if (gotoPhoto > 0) {
				gotoPhoto--;
				$(window).scrollTop($($photos[gotoPhoto]).offset().top);
			}			
		}


	});
}

function bindHeaderAnimation() {
	$body.on('mousemove', function(event) {
		//console.log('aa');
		$header.addClass('visible');
    if (headerAnimation) {
    	setHeaderLocation(event.pageX, event.pageY);	
    }
    
  });

  $(window).on('scroll', function(){
  	
  	windowScrollTop = $(window).scrollTop();
  	
  });
}


function setHeaderLocation(x, y) {
	
	var movedX = (x * -1 + 300)/1.5;
  var movedY = (y * -1 + 300)/1;

  if (windowScrollTop > 0) {
  	movedY += windowScrollTop;
  }

  var translate = 'translate(' + movedX + 'px, ' + movedY + 'px)';


  $header.css({
    '-webkit-transform' : translate,
    '-ms-transform'     : translate,
    'transform'         : translate
  });
}


































