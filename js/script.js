var LABELS = [
  'Aktien',
  'Anleihen',
  'Gold',
  'Rohstoffe',
  'Bargeld',
  'Immobilien',
  'Alternativ'
];

var COLORS = [
  '#f44336',
  '#2196f3',
  '#4caf50',
  '#ff9800',
  '#ec407a',
  '#ffc107',
  '#9e9e9e'
];

var MAX_ALLOCATION = 100;
var THE_ALLOCATION = [14, 22, 12, 18, 13, 9, 12];

function generateRandomAllocation() {
  var allocation = [];
  var sum = 0;

  for (var i = 0; i < LABELS.length; i++) {
    var val = Math.random();
    allocation.push(val);
    sum += val;
  }

  return allocation.map(function (v) { return v * MAX_ALLOCATION / sum });
}

(function() {

  var timeout;
  var $search = $('#search').on('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      $('.search-container').addClass('searching');
      $('.screen-background').css('opacity', 0);
      $('.results-container').removeClass('hidden');
      $('.navbar-high > nav').removeClass('navbar-move');
    }, 300);
  }).on('blur', function () {
    if ($search.val() === '') {
      $('.search-container').removeClass('searching');
      $('.screen-background').css('opacity', 1);
      $('.results-container').addClass('hidden');
      $('.navbar-high > nav').addClass('navbar-move');
    }
  });

})();

(function() {
  var $content = $('#create-content');
  var $create = $('#create').on('input', function () {
    if ($create.val() === '') {
      $content.addClass('removed');
    } else {
      $content.removeClass('removed');
    }
  });

  $('.create-button').on('click', function () {
    $content.addClass('removed');
    $('.create-title').text($create.val());
    $create.val('');
    $('.create-placeholder').addClass('removed').on('transitionend', function () {
      $('.create-target').removeClass('hidden');
    });
  });
})();

$(function () {
  $('.parallax').parallax();
  $('select').material_select();
  $('.scrollspy').scrollSpy();

  $('.sidenav').pushpin({
    top: 140,
    offset: 70
  });

  $('.pushpin').each(function () {
    var $this = $(this);
    $this.pushpin({
      top: $this.offset().top,
      offset: 70
    })
  });

  $('.navbar-high > nav').pushpin({
    top: 64,
    offset: 0
  });

  $('.character-counter').characterCounter();

  $('.datepicker').pickadate({
    today: 'Heute',
    clear: '',
    close: 'Fertig',

    monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    firstDay: 1,
    min: new Date(),

    selectMonths: true,
    selectYears: 35
  });
});

$('.target-chart').each(function () {
  var data = {
    labels: LABELS,
    datasets: [
      {
        data: generateRandomAllocation(),
        backgroundColor: COLORS
      }]
  };

  var chart = new Chart(this, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: false,
      legend: { display: false },
      tooltips: { enabled: false }
    }
  });
});

$('.description-chart').each(function () {
  var data = {
    labels: ["Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    datasets: [
      {
        label: "Developed Europe",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
        spanGaps: false
      }
    ]
  };

  var chart = new Chart(this, {
    type: 'line',
    data: data,
    options: {
      legend: { display: false }
    }
  });

});

$('.assets-chart').each(function () {
  var data = {
    labels: LABELS,
    datasets: [
      {
        data: THE_ALLOCATION,
        backgroundColor: COLORS
      }]
  };

  var assetsChart = new Chart(this, {
    type: 'doughnut',
    data: data,
    options: {
      legend: { display: false }
    }
  });

  var miniChart = new Chart($('.mini-chart'), {
    type: 'doughnut',
    data: data,
    options: {
      responsive: false,
      legend: { display: false },
      tooltips: { enabled: false }
    }
  });

  var $amounts = $('.asset-amount');

  var $sliders = $('.asset-slider')
    .attr('max', MAX_ALLOCATION - 1)
    .on('change', function (e) {
      var i = $sliders.index(this);
      var val = parseInt($(this).val());
      var old = THE_ALLOCATION[i];
      var diff = val - old;
      var other = MAX_ALLOCATION - old;
      for (var j = 0; j < THE_ALLOCATION.length; j++) {
        if (i === j) {
          THE_ALLOCATION[j] = val;
        } else {
          THE_ALLOCATION[j] -= diff * THE_ALLOCATION[j] / other;
        }
      }
      updateView();
    });

  function updateView() {
    $sliders.each(function (i) {
      $(this).val(THE_ALLOCATION[i]);
    });

    $amounts.each(function (i) {
      var fmt = THE_ALLOCATION[i].toFixed(2).replace(/(\d)(?=(\d{3})\.)/g, '$1.');
      $(this).text(fmt + ' %');
    });

    assetsChart.update();
    miniChart.update();
  }

  updateView();
});

$('.compare-chart').each(function () {
  var data = {
    labels: LABELS,
    datasets: [
      {
        label: "Soll",
        backgroundColor: COLORS,
        data: THE_ALLOCATION
      },
      {
        label: "Ist",
        borderWidth: 2,
        borderColor: '#aaa',
        data: generateRandomAllocation()
      }
    ]
  };

  var chart = new Chart(this, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        yAxes: [{ ticks: { min: 0 } }]
      },
      legend: { position: 'bottom' }
    }
  });
});

$('.research-chart').each(function () {
  var data = {
    labels: ["Oktober", "November", "Dezember", "Januar", "Februar", "März", "April"],
    datasets: [
      {
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
        spanGaps: false
      },
      {
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(255,152,0,0.4)",
        borderColor: "rgba(255,152,0,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(255,152,0,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,152,0,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [30, 57, 54, 79, 81, 76, 85],
        spanGaps: false
      }
    ]
  };

  var chart = new Chart(this, {
    type: 'line',
    data: data,
    options: {
      legend: { display: false }
    }
  });
});

$('.products-button').click(function () {
  $('.invest-steps').addClass('move');
  var $invest = $('.invest-wrapper').addClass('hidden').one('transitionend', function () {
    $invest.css('display', 'none');
    var $products = $('.products-wrapper').css('display', 'block');
    setTimeout(function () { $products.removeClass('hidden'); }, 0)
  });
});

$('.products-back').click(function () {
  var $products = $('.products-wrapper').addClass('hidden').one('transitionend', function() {
    $products.css('display', 'none');
    var $invest = $('.invest-wrapper').css('display', 'block');
    setTimeout(function () { $invest.removeClass('hidden'); }, 0);
    $('.invest-steps').removeClass('move');
  })
});

$('.product').click(function () {
  var $icon = $(this).find('.material-icons').first();
  console.log($icon.text());
  if ($icon.text() === 'add') {
    $icon.text('done');
  } else {
    $icon.text('add');
  }

  $icon.toggleClass('green');
});

$('.transaction').click(function () {
  var $tx = $(this).toggleClass('grey-text text-lighten-1');

  var icon = $tx.data('icon');
  var $icon = $tx.find('.material-icons').first();
  $tx.data('icon', $icon.text());
  $icon.text(icon);

  $icon.toggleClass('orange');
});

$('.asset-class').on('mouseenter', function () {
  var name = $(this).find('.legend-description').text();
  $('.asset-name').text(name);
});
