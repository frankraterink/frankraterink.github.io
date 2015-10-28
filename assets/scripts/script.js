$(function(){

	var $photos,
	$body,
	$galleryMapLinks,
  $homepageLogo,
  homepageLogoHue,
	isMobile = false,
	photoCount;

	function init(){
		$photos = $('[data-role=wall]');
		$body = $('body');
    $homepageLogo = $('[data-role=homepageLogo]');
    homepageLogoHue = 0;

		photoCount = $photos.length;

		// checkIfDeviceIsMobile();

		// if (!isMobile) {
		//   replaceLowResImages();
		// }

		addGalleryMapToPage();

    addControlsToGallery();

    addKonamiCode();

    addMotion();

    setClassWhenLoaded();
	}

  function addControlsToGallery() {



    $body.keydown(function(e) {

      var $galleryMaps = $('[data-role=galleryMap]');

      $galleryMaps.each(function(i, el){
        var galleryMap = $(el);

        if (isFullyVisible(el)) {
          var activeMapItem = galleryMap.find('.active');

          if(e.keyCode == 37 || e.keyCode == 38) { // left, up
            e.preventDefault();
            if (activeMapItem.prev().is( "a" ) ) {
              gotoGalleryMapItem(activeMapItem.prev().attr('data-photolink'));
            }
          }
          else if(e.keyCode == 39 || e.keyCode == 40) { // right, down
            e.preventDefault();
            if (activeMapItem.next().is( "a" ) ) {
              gotoGalleryMapItem(activeMapItem.next().attr('data-photolink'));
            }
          }
          else if(e.keyCode == 8) {
            e.preventDefault();
            window.location.href= "index.html";
          }

          // when a active galleryMap is found the each can stop
          return false;
        }
      });

    });
  }

  function isFullyVisible(elem)
  {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();

      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

	function replaceLowResImages() {
    if (photoCount > 0) {
      $photos.each(function(index, el){
        var lowResImg = $(el).find('img');
        var highResUrl = lowResImg.attr('data-highResUrl');
        var highResImage = lowResImg.attr('src', highResUrl);
      });
    }
	}

	function checkIfDeviceIsMobile() {
  	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      isMobile = true;
    }
	}

	function addGalleryMapToPage(){

  	var isGalleryPage = $body.hasClass('gallery-page');

    if (photoCount > 0 && isGalleryPage) {

      // MAKE A GALLERY OBJECT
      var galleryMap = $('<div class="gallery-map" data-role="galleryMap"></div>');
      $photos.each(function(index, el){
        var photoNr = index + 1;
        var listItem = $('<a href="#' + photoNr + '" data-role="galleryMapLink" data-photolink="' + photoNr + '">foto ' + photoNr + '</a>');
        galleryMap.append(listItem);
      });

      // APPEND THE GALLERYMAP TO EACH PHOTO
      $photos.each(function(index, el){
        var photo = $(el);
        var newGalleryMap = galleryMap.clone();
        var selectedMapItem = "[data-photolink=" + (index + 1) + "]"
        newGalleryMap.find(selectedMapItem).addClass('active');
        photo.append(newGalleryMap);
      });

      // MAKE THE NAVIGATION VISIBLE
      $galleryMapLinks = $('[data-role="galleryMapLink"]');

      // MAKE GALLERY MAP ITEMS CLICKABLE AND PREVENT THE WINDOW HASH TO BE SET
      $galleryMapLinks.each(function(i, el){
        $(el).click(function(e){
          e.preventDefault();
          var nr = $(el).attr('data-photolink');
          gotoGalleryMapItem(nr);
        });
      });

    }
	}

  function gotoGalleryMapItem(nr) {
    $('html,body').scrollTop($("#"+nr).offset().top);
  }

	function selectGalleryMapItem(nr) {
  	$galleryMapLinks.removeClass('active');

  	$('[data-photoLink=' + nr + ']').addClass('active');
	}

  function addKonamiCode() {
    // Cheat.js
    // http://namuol.github.io/cheet.js/
    cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
      console.log('konami to be implemented');
    });
  }

  function setClassWhenLoaded() {
    $(document).ready(function(){
      // your code here
      $body.removeClass('loading');
  });

  }

  function addMotion() {
    var $motionMenuClickers = $('[data-role=motion-menu-click]');

    console.log($motionMenuClickers);

    $motionMenuClickers.each(function(index, el){
      console.log('aa', el);
      $(el).click(function(e){
        e.preventDefault();
        console.log('ennu', $(el).attr('href'));

        var url = $(el).attr('href').substring(1, $(el).attr('href').length);




        var width = $(el)[0].clientWidth;
        var height = $(el)[0].clientHeight;



        var elOffset = $(el).offset();
        var elTop = elOffset.top;
        var elLeft = elOffset.left;

        var windowScrollTop = $(window).scrollTop();

        console.log('pokpok', width, height, elTop, elLeft);

        $('.ani').css('height', height);
        $('.ani').css('width', width);
        $('.ani').css('left', elLeft);
        $('.ani').css('top', elTop - windowScrollTop);


        setTimeout(function(){
          $('.ani').addClass('shown');
        }, 50);

        setTimeout(function(){
          window.location = window.location.href + url;
        }, 600);



      });

    });


  }

	init();

});