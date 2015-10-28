$(function(){

  var $body,
  $form,
  $name,
  $address,
  $number,
  $addition,
  $zip,
  $city,
  $submit,
  addressOrdered = false;

  function init(){
    $body = $('body'),
    $form = $('.testform');
    $name = $form.find('[data-role=name]');
    $address = $form.find('[data-role=address]');
    $number = $form.find('[data-role=address-number]');
    $addition = $form.find('[data-role=address-addition]');
    $zip = $form.find('[data-role=zip]');
    $city = $form.find('[data-role=city]');
    $submit = $form.find('[data-role=submit]');



    $address.blur(function(){
      var addressValue = $(this)[0].value;
      onLeaveAddress(addressValue);
    });

    $number.blur(function(){
      var numberValue = $(this)[0].value;
      onLeaveNumber(numberValue);
    });

    $addition.blur(function(){
      var additionValue = $(this)[0].value;
      onLeaveAddition(additionValue);
    });

    $zip.blur(function(){
      var zipValue = $(this)[0].value;
      onLeaveZip(zipValue);
    });

    $city.blur(function(){
      var cityValue = $(this)[0].value;
      onLeaveCity(cityValue);
    });

    $form.find('input[type=text]').click(function(){
      $form.removeClass('address-complete');
    });

    $submit.focus(function(){
      onFocusSubmit();
    });

    // $body.click(function(){
    //   checkIfFieldIsFocussed();
    // });

    var ua = navigator.userAgent,
            event = (ua.match(/iPad/i)) ? "touchstart" : "click";

    $(document).on(event, function (ev) {
        $form.blur();
        checkIfFieldIsFocussed();
    });

    $body.keydown(function(e){
      if (e.which == 13) {

        if (!$submit.is(':focus')){
          e.preventDefault();
          $submit.focus();
        }

      }
    });

    $body.keyup(function(e){
      checkIfFieldIsFocussed();
    });


  }

  function checkIfFieldIsFocussed() {
    var focussedForm = $form.find('input[type=text]').is(':focus');
    if ($name.val() && $address.val() && $number.val() && $zip.val() && $city.val() && !focussedForm) {
      $form.addClass('address-complete');
    } else if (focussedForm) {
      $form.removeClass('address-complete');
    }
  }

  function onLeaveName(nameValue) {

  }

  function onLeaveAddress(addressValue) {
    if (!addressOrdered) {

      //console.log('addressV:', addressValue);
      var addressParts = addressValue.split(' ');
      //console.log('addressP:', addressParts);

      var partCount = addressParts.length;

      var street = '';
      var number = '';
      var numberReady = false;
      var addition = '';


      $(addressParts).each(function(index, value){

        index++;

        if (isNothing(value) || value == street) {
          //console.log('empty... do nothing >' + value + '<', index, partCount);
        }
        else if (isNumber(value)) {
          //console.log('number... add to address number: >' + value + '<', index, partCount);
          number = value;
        }
        else if ((typeof value == "string" && ((index != partCount) || index == 1)) || number == '' && !isNumber(value.charAt(0))) {
          //console.log('string... this is the street:  >' + value + '<', index, partCount);
          if (street == '') {
            street = value;
          } else {
            street = street + ' ' + value;
          }
        }
        else if (typeof value == "string" && index == partCount) {
          //console.log('string... this is the addition:  >' + value + '<', index, partCount);

          // when number and addition are written without space it is a addition as total, so
          // we have to extract the number and addition out of it.
          for (i = 0; i < value.length; i++) {
            var va = value.charAt(i)
            if (!numberReady && isNumber(va)) {
              number = number + va;
            } else {
              numberReady = true;
              addition = addition + va;
            }
          }
        }
      });

      updateStreet(street);
      updateNumber(number);
      updateAddition(addition);
      if (number != '' || addition != '') {
        $zip.focus();
      }
    }
  }

  function onLeaveAddition(additionValue) {
    if (additionValue == '') {
      $form.removeClass('both-visible');
    }
    $addition.val($addition.val().toUpperCase());
  }

  function onLeaveNumber(numberValue) {
    var number = '';
    var addition = '';
    var numberReady = false;

    // when number and addition are written without space it is a addition as total, so
    // we have to extract the number and addition out of it.
    for (i = 0; i < numberValue.length; i++) {
      var va = numberValue.charAt(i);
      if (va != ' ') {
        if (!numberReady && isNumber(va)) {
          number = number + va;
        } else {
          numberReady = true;
          addition = addition + va;
        }
      }
    }

    updateNumber(number);
    if (addition != '') {
      updateAddition(addition);
    }
  }

  function onLeaveZip(zipValue) {
    if (zipValue != '') {
      var numbers = '';
      var letters = '';
      var areZipNrsSet = false;

      for (i = 0; i < zipValue.length; i++) {
        var s = zipValue.charAt(i);
        if (isNumber(s) && !areZipNrsSet && s != ' ') {
          numbers = numbers + s;
        } else {
          areZipNrsSet = true;
          if (s != ' ') {
            letters = letters + s;
          }
        }
      }
      var newZip = numbers + ' ' + letters.toUpperCase();
      $zip.val(newZip);
    }
  }

  function onLeaveCity(cityValue, e) {
    var cityParts = cityValue.split(' ');
    var newCity = '';
    $(cityParts).each(function(index, value){

      // capitalize words with more than 2 chars
      if (value.length > 2) {
        value = value.substring(0, 1).toUpperCase() + value.substring(1, value.length);
      }

      if (newCity == '') {
        newCity = value;
      } else {
        newCity = newCity + ' ' + value;
      }
    });

    $city.val(newCity);
  }

  function onFocusSubmit() {
    focusOnFirstRequiredField();
  }

  function focusOnFirstRequiredField() {
    if ($name.val() == "") {
      setTimeout(function() {
        $name.focus();
      }, 0);


    }
    else if ($address.val() == "") {
      setTimeout(function() {
        $address.focus();
      }, 0);

    }
    else if ($number.val() == "") {
      setTimeout(function() {
        $number.focus();
      }, 600);
    }
    else if ($zip.val() == "") {
      setTimeout(function() {
        $zip.focus();
      }, 0);

    }
    else if ($city.val() == "") {
      setTimeout(function() {
        $city.focus();
      }, 0);

    }
  }

  function updateStreet(street) {
    if (street != '') {
      $('#address').val(street);
    }
  }

  function updateNumber(number) {
    if (number != '') {
      // fill and show number
      $('#address-number').val(number);
      addressOrdered = true;
    } else {
      addressOrdered = false;
    }
  }

  function updateAddition(addition) {
    if (addition != '') {
      // fill and show addition
      $('#address-addition').val(addition.toUpperCase());
      $form.addClass('both-visible');
      addressOrdered = true;
    } else {
      $form.removeClass('both-visible');
      addressOrdered = false;
    }
  }

  function isNothing(s) {
    return s.length == 0;
  }

  function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


  init();

});