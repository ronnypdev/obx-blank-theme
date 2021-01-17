(function($) {

  // Add a listener for "submit on change" <select> and <input> elements.
  $(document).on('change', '[data-submit-on-change]', function() {
    var $input = $(this), target = $input.attr('data-submit-on-change');
    $(target).submit();
  });

  // Add a listener for "Ajax load on submit" <form> elements.
  $(document).on('submit', '[data-submit-load]', function(e) {
    e.preventDefault();
    var $form = $(this),
        url = $form.attr('action'),
        target = $form.attr('data-submit-load'),
        data = $form.serialize();

    loadAndUpdateHistoryState(url, target, data);
  });

  // Add a listener for "Ajax load on click" <a> elements.
  $(document).on('click', '[data-click-load]', function(e) {
    e.preventDefault();
    var $link = $(this),
        url = $link.attr('href'),
        target = $link.attr('data-click-load');

    loadAndUpdateHistoryState(url, target, '');
  });

  // Perform an Ajax load using jQuery with the given parameters and update history state.
  function loadAndUpdateHistoryState(url, target, data) {
    $(target).load(url + ' ' + target, data, function() {
      window.history.pushState({}, null, url + '?' + data);
    });
  }

  // Using the given address, get the cheapest shipping rate estimate using the Ajax API and
  // update the given target element with a message.
  window.fetchShippingRateEstimate = function(target, shipping_address) {
    if(!shipping_address) return;
    $.ajax({
      url: '/cart/shipping_rates.json',
      data: $.serialize({ shipping_address: shipping_address }),
      success: function(shipping_rates) {
        if(shipping_rates.length === 0) return;
        var shipping_rate = shipping_rates[0];
        $(target).html(
          '<em>' +
            shipping_rate.name + ' ($' + shipping_rate.price + ') to ' +
            shipping_address.city + ', ' + shipping_address.province +
          '</em>'
        );
      }
    });
  };

  // Remove the 'no-js' class from the body element, as JS is now available and initialised.
  $('body').removeClass('no-js');

})(jQuery);