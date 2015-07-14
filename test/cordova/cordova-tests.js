document.addEventListener('deviceready', function () {
  mocha.setup('bdd');
  require('./evothings-backend-test');
  mocha.run();

  //var refresh = document.createElement('button');
  //refresh.className = 'refresh';
  //refresh.textContent = 'Refresh Page';
  //refresh.addEventListener('click', function () {
  //  window.location.reload();
  //});
  //document.body.appendChild(refresh);

  var connectingNotice = document.querySelector('#connectingNotice');
  connectingNotice.parentNode.removeChild(connectingNotice);
}, false);
