/*
function toggleMenu(visible) {
  document.querySelector('.side-menu').classList.toggle('side-menu--show', visible);
}

document.querySelector('.hamburger-image').addEventListener('click', function(e) {
  e.preventDefault();
  toggleMenu();
});

*/

const select = {
  mainContent: 'main',
  navLinks: '.menu-links',
  chartContainer: '#myChart',
  legendContainer: '#myChartLegend'
};

const classNames = {

  activationClass: {
    general: 'template template--general',
    links: 'template template--links',
    banners: 'template template--banners',
    details: 'template template--details',
    personal: 'template template--personal',
    postback: 'template template--general',
    payout: 'template template--payout',    
  },

  navActive: 'active',
};


const app = {

  initHamburger: function() {
    const thisApp = this;
  
    document.querySelector('.hamburger-image').addEventListener('click', function(e) {
      e.preventDefault();
      thisApp.toggleMenu();
    });
  },

  toggleMenu: function(visible) {
    document.querySelector('.side-menu').classList.toggle('side-menu--show', visible);
  },
  
  initChart: function() {
    var ctx = document.querySelector(select.chartContainer).getContext('2d');    
    
    // eslint-disable-next-line no-undef
    var myChart = new Chart(ctx, {
      // 1
      type: 'bar',
      // options needed to generate custom html legend     
      options: {
        legendCallback: function(chart) { 
          var text = []; 
          text.push('<ul class="' + chart.id + '-legend">'); 
          for (var i = 0; i < chart.data.datasets.length; i++) {
            // modification of default legendCallback to identify hidden base data
            if (chart.isDatasetVisible(i)){              
              text.push(`<li class="${chart.data.datasets[i].label.toLowerCase()}-tab active">`);
            } else {
              text.push(`<li class="${chart.data.datasets[i].label.toLowerCase()}-tab">`);
            }    
            if (chart.data.datasets[i].label) { 
              text.push(chart.data.datasets[i].label); 
            } 
            text.push('</li>'); 
          } 
          text.push('</ul>'); 
          return text.join(''); 
        },      
        legend: {
          display: false,        
          onClick: function(e, legendItem) {
            var index = legendItem.datasetIndex;
            // modification of original default onClick, it was this.chart instead of this
            var ci = this;
            var meta = ci.getDatasetMeta(index);        
            // See controller.isDatasetVisible comment
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;        
            // We hid a dataset ... rerender the chart
            ci.update();
          },
        }
      },
      
      data: {
      // 2
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        // 3
        datasets: [{
          // 4
          label: 'Signups',
          // 5
          backgroundColor: '#8DBEC8',
          borderColor: '#8DBEC8',
          // 6
          data: [ 52, 51, 41, 94, 26, 6, 72, 9, 21, 88 ],
          hidden: true,
        },
        {
          label: 'FTD',
          backgroundColor: '#F29E4E',
          borderColor: '#F29E4E',
          data: [ 6, 72, 1, 0, 47, 11, 50, 44, 63, 76 ],
          hidden: true,
        },
        {
          label: 'Earned',
          backgroundColor: '#71B374',
          borderColor: '#71B374',
          data: [ 59, 49, 68, 90, 67, 41, 13, 38, 48, 48 ],
          // 7
          hidden: false,
        }]
      },
    });
    let myLegendContainer = document.querySelector(select.legendContainer);

    // generate HTML legend
    myLegendContainer.innerHTML = myChart.generateLegend();

    // bind onClick event to all LI-tags of the legend
    let legendItems = myLegendContainer.getElementsByTagName('li');
    for (let i = 0; i < legendItems.length; i += 1) {
      legendItems[i].addEventListener('click', legendClickCallback, false);      
    }

    function legendClickCallback(event) {
      event = event || window.event;
    
      var target = event.target || event.srcElement;
      while (target.nodeName !== 'LI') {
        target = target.parentElement;
      }
      var parent = target.parentElement;
      var chartId = parseInt(parent.classList[0].split('-')[0], 10);
      // eslint-disable-next-line no-undef
      var chart = Chart.instances[chartId];
      var index = Array.prototype.slice.call(parent.children).indexOf(target);
      console.log('click w co wykryto', chart.legend.legendItems[index]);
      chart.legend.options.onClick.call(chart, event, chart.legend.legendItems[index]);
      if (chart.isDatasetVisible(index)) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
    }
  },

  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.mainContent).children;
    thisApp.navLinks = document.querySelectorAll('.menu-links a');
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchinHash = thisApp.pages[0];
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchinHash = page;
        break;
      } 
    }
    
    thisApp.activatePage(pageMatchinHash.id);
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();
        console.log('clickedElement', this);

          
        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        thisApp.toggleMenu();
      });
    } 
  
  },

  initModals: function() {
    const thisApp = this;

    /* Add closing listeners to all modals */
    // by button
    document.querySelectorAll('#overlay .js--close-modal').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        thisApp.closeModals();
      });
    });
    // by clicking outside
    document.querySelector('#overlay').addEventListener('click', function(e) {
      if(e.target === this) {
        thisApp.closeModals();
      }
    });
    // by esc key on keybord
    document.addEventListener('keyup', function(e) {
      if(e.keyCode === 27) {
        thisApp.closeModals();
      }
    });    

    /* Add openning listeners of specific modals */
    document.querySelector('#testMyModal').addEventListener('click', function() {
      const modal = document.querySelector('#myModal');
      thisApp.openModal(modal);
    });

    document.querySelectorAll('#loginTrigger')
      .forEach((trigger) => trigger
        .addEventListener('click', function() {
          const modal = document.querySelector('#loginModal');
          thisApp.openModal(modal);
        })
      );
  },

  closeModals: function() {
    document.getElementById('overlay').classList.remove('show');
  },

  openModal: function(modal) {
    document.querySelectorAll('#overlay > *').forEach(function(modal) {
      modal.classList.remove('show');
    });
    document.querySelector('#overlay').classList.add('show');
    modal.classList.add('show');
  },

  activatePage: function(pageId) {
    const thisApp = this;

    thisApp.body = document.querySelector('body');
    window.location.hash = '#/' + pageId;

    thisApp.body.className = classNames.activationClass[pageId];

    console.log('bodyClassName', thisApp.body.className);

    /* add class "active" to matching links, remove from non-matching */

    for (let link of thisApp.navLinks) {      
      link.classList.toggle(
        classNames.navActive, 
        link.getAttribute('href') == '#' + pageId
      );      
    }
  
  },

  start: function() {
    const thisApp = this;
    thisApp.initHamburger();
    thisApp.initPages();
    thisApp.initChart();
    thisApp.initModals();
  }

};

  

 
/*
  start: function() {
    const thisApp = this;
    console.log('*** App starting ***');
    thisApp.initHome();
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    
  },

};
*/

app.start();