//Position parameters used for drawing the rectangle


var canvas = document.createElement('canvas'); //Create a canvas element
//Set canvas width/height
canvas.style.width='100%';
canvas.style.height='100%';
//Set canvas drawing area width/height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Position canvas
canvas.style.position='absolute';
canvas.style.left=0;
canvas.style.top=0;
canvas.style.zIndex=100000;
div = document.getElementById('mycont')
canvas.style.pointerEvents='none'; //Make sure you can click 'through' the canvas
document.body.appendChild(canvas); //Append canvas to body element

var ctx = canvas.getContext('2d');
//Draw rectangle

var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;

var csv_ar = [["Gender","Age","File Start","Start time","End time","Channel names","Comment"]];
var csv_rows = 1;
var csv_cols =3;
var com = "No comment";
var chArr = [];
var myStart = "";
function getMousePos(div, evt) {
    var rect = div.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
//Mousedown
var tstart;
var tend;
var tsec;
var rect_start;
var rect_end;
var dur;
var chName;
var width = height = 0;
$(div).on('mousedown', function(e) {
  var pos = getMousePos(div, e);
    last_mousex = pos.x;
	last_mousey = pos.y;
  lm_x = e.clientX;
  lm_y = e.clientY;
    mousedown = true;
    tstart = (document.getElementById('startWindowtime').innerHTML);
    tend = (document.getElementById('endWindowtime').innerHTML);
    dur = parseInt(document.getElementById('wd').innerHTML);
    tsec = parseFloat(tstart.charAt(6)+tstart.charAt(7));
    tstart = tstart.substring(0,6);
});

//Mouseup
$(div).on('mouseup', function(e) {
    mousedown = false;
    var a = dur*(last_mousex/div.offsetWidth);
    if (tsec+a<10){
      rect_start = tstart +'0'+(tsec+ (a));
    }
    else {
      rect_start = tstart +(tsec+ (a));
    }

    var b = dur*(mousex/div.offsetWidth);
    if (tsec+b<10){
      rect_end = tstart + '0'+(tsec+(b));
    }
    else {
      rect_end = tstart + (tsec+(b));
    }
    rect_start = rect_start.substring(0,8) + ':' + rect_start.substring(9);
    rect_end = rect_end.substring(0,8) + ':' + rect_end.substring(9);
    rect_start = rect_start.substring(0,12);
    rect_end = rect_end.substring(0,12);

    if ((parseFloat(rect_start.charAt(6)+rect_start.charAt(7)) < tsec) || ( (parseFloat(rect_start.charAt(6)+rect_start.charAt(7)) == tsec)&&(rect_start.length < 10) ) ){
      rect_start = rect_start.substring(0,6) + tsec + ":000";
    }


    $( "div.ChDiv" ).each(function() {
        rect = (this).getBoundingClientRect();
        if ((rect.top>= lm_y && rect.bottom <= lm_y+height) || (rect.top <= lm_y && rect.bottom >= lm_y+height) || ((lm_y>=rect.top && lm_y <=rect.bottom) && (Math.abs(lm_y-rect.top) < Math.abs(lm_y-rect.bottom))) || ((lm_y>=rect.top && lm_y <=rect.bottom) && (Math.abs(lm_y+height-rect.top) > Math.abs(lm_y+height-rect.bottom)))){
          chName = $(this).find('span').text();
          chArr.push(chName);
        }
    });
    if (rect_start!=rect_end && chArr.length!=0){
      if(window.confirm("Save selected region?\r\nNumber of channels = "+chArr.length+"\r\nStart: "+rect_start +"\r\nEnd: "+rect_end)){
        com = window.prompt("Comment about abnormality","No Comment");
        var s = chArr[0]
        for (i=1; i < chArr.length ; i++){
          s = s.concat(' ',chArr[i])
        }
        new_row = ['','','',rect_start,rect_end,s,com];
        csv_ar.push(new_row);
      }
    }
    else {
      alert("No region was selected. Please click ONCE outside the drawing area and try again")
    }


    ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
    chArr = [];
});

//Mousemove
$(div).on('mousemove', function(e) {
  var pos = getMousePos(div, e);
    mousex = pos.x;
	mousey = pos.y;
    if(mousedown) {
        ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
        ctx.beginPath();
        width = e.clientX-lm_x;
        height = e.clientY-lm_y;
        ctx.rect(lm_x,lm_y,width,height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(150, 0, 0, 0.3)";
        ctx.fill()
        ctx.stroke();

    }
    //Output

});
var modal = document.getElementById("writeModal");
var button = document.getElementById("acceptWrite");
document.getElementById("write").onclick = function() {modalWrite()};
document.getElementById("erase").onclick = function() {erase()};
function modalWrite(){
    modal.style.display = "block";
}
button.onclick = function() {
  var us_age = $('input[name="getAge"]').val();
  var us_gen
  if (document.getElementById('gen1').checked) {
    us_gen = document.getElementById('gen1').value;
  }
  if (document.getElementById('gen1').checked) {
    us_gen = document.getElementById('gen1').value;
  }
  if (document.getElementById('gen1').checked) {
    us_gen = document.getElementById('gen1').value;
  }
  modal.style.display = "none";
  csv_ar[1][0] = us_gen;
  csv_ar[1][1] = us_age;
  writeToCSV(csv_ar)
}

function writeToCSV(ar){
    ar[1][2] = myStart;
    let csvContent = "data:text/csv;charset=utf-8," + ar.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    erase();
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

function erase(){
  if(window.confirm("Erase current labels?")){
    csv_ar = [["Gender","Age","File Start","Start time","End time","Channel names","Comment"]];
  }
}
