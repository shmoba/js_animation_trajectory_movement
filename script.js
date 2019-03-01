window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var field = document.getElementById("field");
  var helicopter = document.getElementById("helicopter");

  var maxX = field.clientWidth - helicopter.offsetWidth;
  var maxY = field.clientHeight - helicopter.offsetHeight;

  var duration = 10; // seconds
  var gridSize = 100; // pixels

  var start = null;

  var continueAnimating = true; // переменная для отключения функции

  function step(timestamp) // полет
  {

  	if(!continueAnimating){return;}

    var progress, x, y, y2;
    if(start === null) start = timestamp;

    progress = (timestamp - start) / duration / 1000; // percent

    x = progress * maxX/gridSize; // x = ƒ(t)
    y = 2 * Math.sin(x); // y = ƒ(x)
    y2 = 2 * Math.cos(x);

    helicopter.style.left = Math.min(maxX, gridSize * x) + "px";
    helicopter.style.bottom = maxY/2 + (gridSize * y) + "px";

    if(progress >= 1) start = null; // reset to start position
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

function animate(options){
	var start = performance.now();
			
	requestAnimationFrame(function animation(time){
		var timeFraction = (time - start) / options.duration;
		if(timeFraction > 1) timeFraction = 1;
		
		var progress = options.timing(timeFraction);
		options.draw(progress);

		if(progress < 1) requestAnimationFrame(animation);
	});
};
		
function bounce(timeFraction){
	for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
		if (timeFraction >= (7 - 4 * a) / 11) {
			return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
		};
	};
};
		
function makeEaseOut(timing){
	return function(timeFraction){
		return 1 - timing(1 - timeFraction);
	};
};

var dropAnimating = true; // переменная для отключения функции
function dropAnimate() { 
	if(!dropAnimating){return;}

	var x = getCoordsLeft(explosion); // координата левая
	//var to = getCoordsTop(explosion);

	
	var too = getCoordsTop(explosion);

	explosion.id = 'gift'; // поменять анимацию

	var to = field.clientHeight - gift.offsetHeight;

	animate({ // вызов падения
		duration: 1000,
		timing: makeEaseOut(bounce),
		draw: function(progress){
			gift.style.top = to * progress + 'px'; // to * progress + 'px'
			x++;
			gift.style.left = x + 'px';
		}
	});
}

function getCoordsTop(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();
  return box.top + pageYOffset;
}

function getCoordsLeft(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();
  return box.left + pageXOffset;
}

console.log(getCoordsTop(helicopter));
document.getElementById('helicopter').addEventListener('click',function(){  // действия по клику на вертолет

	continueAnimating=false; // отключить вращение
	helicopter.id = 'explosion'; // поменять вертолет на взрыв
	setTimeout(dropAnimate, 1100); // поменять взрыв на выпадающий приз
	
	var modal = document.getElementById('myModal');
	var explosion = document.getElementById("explosion");
	var close = document.getElementsByClassName("close")[0];

	console.log(getCoordsTop(explosion));
	explosion.onclick = function() {

		dropAnimating = false; // отключить падение
		document.getElementById("explosion").remove(); // удалить взрыв
	    modal.style.display = "block"; // показать модальное окно

	    var date = new Date();
		var options = {year: 'numeric',month: 'long',day: 'numeric',hour: 'numeric',minute: 'numeric',second: 'numeric'};
		date = date.toLocaleString("ru", options);
		document.getElementById('time-output').innerHTML=date; // вывести текущую дату
	}

	close.onclick = function() { // закрыть модальное окно
	    modal.style.display = "none";
	    document.location.reload(true); // refresh
	}

	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	        document.location.reload(true); // refresh
	    }
	}
});