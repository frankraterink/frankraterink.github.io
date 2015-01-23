$(function(){

  var $body,
  $urlCollector,
  $togglerEdit,
  $controlNext,
  readTimeInterval,
  $readTime,
  $contentTimeLeft,
  $contentTimeLeftTip;


  function init(){
    $body = $('body');
    $urlCollector = $('[data-role=url-collector]');
    $togglerEdit = $('[data-role=toggler-edit]');
    $controlNext = $('[data-role=control-next]');
    $readTime = $('[data-role=read-time]');
    $contentTimeLeft = $('[data-role=time-left]');
    $contentTimeLeftTip = $('[data-role=time-left-tip]');

    $togglerEdit.click(function(){
      toggleEdit();
    });

    fillInputs();

  }


  function toggleEdit() {
    $urlCollector.toggleClass('hidden');
    $controlNext.toggleClass('hidden')

    if ($urlCollector.hasClass('hidden')) {
      $togglerEdit.html('websites invoeren/bewerken');
        removeEmptyInputs();
        $body.removeClass('editing');
        updateUrl();
    } else {
      $togglerEdit.html('klaar!');
      $contentTimeLeft.html('');
      $contentTimeLeftTip.html('');
      $controlNext.html('');
      $body.addClass('editing');
      var $emptyInputs = $urlCollector.find('input[type=text][value=]');
      if ($emptyInputs.length > 0) {
        $emptyInputs[0].focus();
      }
    }
    // set html
    // add click action that is now on the blur
    updateInputs();

  }

  function updateInputs() {
    var $input = $urlCollector.find('input[type=text]');
    var countInput = $input.length;
    var $emptyInputs = $urlCollector.find('input[type=text][value=]');
    var countEmptyInputs = $emptyInputs.length;

    var isEmptyInputInFocus = $urlCollector.find('input[type=text][value=]:focus').length == 1;



    if (countInput < 26) {
      if (countInput == 0) {
        addInput("");
      } else if (countEmptyInputs < 2 && isEmptyInputInFocus) {
        addInput("");
      } else if (countEmptyInputs == 0) {
        addInput("");
      }
    }
  }



  function addInput(url) {
    var input = $('<input type="text" placeholder="bv. ‘nos.nl’" value="' + url + '" />');
    input.focus(function(){

      updateInputs();
    });

    $urlCollector.append(input);
  }

  function removeEmptyInputs() {
      var $emptyInputs = $urlCollector.find('input[type=text][value=]');
      $emptyInputs.remove();
  }

  function updateUrl() {


    var currentUrl = $(location).attr('href').split('?')[0];
    var newUrl = currentUrl + "?w="

    removeEmptyInputs();

    // get all inputfields
    var $inputs = $urlCollector.find('input[type=text]');

    // add each url to the new url
    $.each($inputs, function( index, value ) {
      var url = $(value).val();
      if (url != "") {

        if (!url.match("^http")) {
           url = "http://" + url
        }

        newUrl = newUrl + url + "|"
      }
    });

    // go to the new url
    window.location.href = newUrl;

  }

  function fillInputs() {

    var windowLocation = $(location).attr('href').split('?');

    if (windowLocation.length > 1) {

      var querystring = windowLocation[1];


      var urls = querystring.substring(2, querystring.length).split('|');
      var firstIsSet = false;

      $.each(urls, function( index, url ) {
        if (url != "") {
          $contentTimeLeft.html('Tip: sla deze pagina op in je favorieten.');
          // place input for each url
          addInput(decodeURIComponent(url));

          if (!firstIsSet) {
            $urlCollector.find('input[value="' + url + '"]').addClass('active');
            $controlNext.removeClass('noborder');
            setControlNext(url, "Begin");
            firstIsSet = true;
          }


        }
      });

    }


  }


  var min = 10,
  sec = 60;

  var everythingIsSet = false;

  function startTimer() {

    if (typeof readTimeInterval === 'undefined') {

      readTimeInterval = setInterval(function() {
        if (!everythingIsSet)
        {
          if (sec == 0) {
            sec = 60;
          }
          if (sec == 60) {
            min--;
          }

          sec--;

          var timeleft = min + ":" + pad(sec, 2);
          $readTime.html(timeleft);
          document.title = timeleft + " - max10minuten";

          // STOP TIMER WHEN DONE READING AND WINDOW HAS FOCUS
          if (document.hasFocus()) {
            if (doneReading) {
              everythingIsSet = true;
              clearInterval(readTimeInterval);
              setDoneContent();
            }
          }
        }

        if (min <= 0 && sec <= 0) {
          everythingIsSet = true;
          clearInterval(readTimeInterval);
          $controlNext.addClass('hidden');
          setOvertimeContent();
          alert('De 10 minuten zijn om!')
          // show timer done screen
        }
      }, 1000);




    }


  }

  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }

  function setOvertimeContent() {
    overtimeText = "Je hebt het niet binnen de tijd gehaald. Volgende keer beter.";
    $contentTimeLeft.html(overtimeText);
  }

  function setDoneContent() {
    var doneText = "Je hebt nog <strong>" + min + " minuten en " + sec + " seconden</strong> over.";

    $contentTimeLeft.html(doneText);

    if (min == 9) {
      $contentTimeLeftTip.html('Zo dan, daar ben je snel doorheen gesjeest.');
    } else if (min == 8) {
      $contentTimeLeftTip.html('Gelijk heb je, snel weer aan de slag!');
    } else if (min == 7) {
      $contentTimeLeftTip.html('Je kan mailen of chatten, maar je kunt ook iemand opzoeken om even face-to-face mee te praten.');
    } else if (min == 6) {
      $contentTimeLeftTip.html('Je kunt nog even je todo lijstje checken. Probeer dat lijstje zo nu en dan ook eens op te schonen.');
    } else if (min == 5) {
      $contentTimeLeftTip.html('Je zou je bureau of de tafel nog even op kunnen ruimen.');
    } else if (min == 4) {
      $contentTimeLeftTip.html('Werk nog even snel de notificaties op je mobiel weg, heb je dat ook weer gehad.');
    } else if (min == 3) {
      $contentTimeLeftTip.html('Denk eens aan vandaag. Waar werd je nu echt blij van?');
    } else if (min == 2) {
      $contentTimeLeftTip.html('Check ook meteen even welke browsertabjes je allemaal kunt sluiten.');
    } else if (min == 1) {
      $contentTimeLeftTip.html('Ga nog even lekker de benen strekken en koffie of thee halen.');
    } else if (sec > 30) {
      $contentTimeLeftTip.html('Focus even op iets in de verte. Dat is goed voor je ogen. En dan weer verder.');
    } else if (sec > 20) {
      $contentTimeLeftTip.html('Stretch even lekker je rug en armen en dan hup weer aan de slag.');
    } else if (sec <= 20) {
      $contentTimeLeftTip.html('Dat was op het nippertje!');
    }
  }

  var doneReading = false;

  function setControlNext(url, text) {
    var html;
    if (url == "") {
      html = $('<span>' + text + '</span>');
      $controlNext.addClass('noborder');
    } else {
      html = $('<a href="' + url + '" target="_blank">' + text + '</a>').click(function(){
        startTimer();
      });;
    }




    html.click(function(){


      var nextUrl = $urlCollector
                      .find('.active')
                      .removeClass('active')
                      .next()
                      .addClass('active');

      if (typeof nextUrl.val() !== 'undefined') {
        // NEXT
        setControlNext(nextUrl.val(), "Volgende");
        $contentTimeLeft.html('');
        $body.addClass('reading');
      } else {
        // DONE
        doneReading = true;
        $body.removeClass('reading');
        setControlNext("", "<strong>Je bent klaar!</strong>");
      }


    });
    $controlNext.html(html);
  }


  init();

});