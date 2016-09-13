var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var app     = express();
var path    = require("path");
var form_functions = require('../form_functions.js');
var async=require('async');

var fractions=[ '', '1/16', '1/8','3/16','1/4', '5/16', '3/8', '7/16','1/2', '9/16', '5/8', '11/16','3/4','13/16', '7/8', '15/16'];
var inches = [ '', '1','2','3','4','5','6','7','8','9','10','11'];
var feet = ['', '1', '2', '3', '4', '5'];

var mongojs = require('mongojs');
var databaseUrl="tvstanddb";
var collections=["standDims", "plyParts", "hardParts"];
var db = mongojs(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

var funcs = require('./TVStandFunctions.js');
var helperFuncs = require('./helperFunctions.js');




router.post('/gendraw', function(req, res){

var idd=req.body.idd;

funcs.calcPlyBlocks(idd,function(err, result){
if(err){
res.send('there is an error');
return;
}
else{
console.log('The result fucking works:',result);
res.render('plyplace', {blocks:result, idd: idd});

//res.send('there is maybe an error');
}

});
});




Packer = function(w, h) {
  this.sheetWidth=w;
  this.sheetHeight=h;
  this.root = { x: 0, y: 0, w: this.sheetWidth, h: this.sheetHeight };
  this.placed=0;
  this.sheets=1;
  this.currentSheet=0;
  this.blockHolder=[0];
  
};



Packer.prototype = {

  fit: function(blocks,callback) {
	  for(var i=0; i<blocks.length; i++){
		  //copy the block array by value
		  this.blockHolder[i]=blocks[i];
		 
		  
	  }
	  //define the current sheet
	  var sheet=1;
	  //as long as blocks are left unplaced
	  while(this.placed<blocks.length){
		 
		  
    var n, node, block;
    for (n = 0; n < this.blockHolder.length; n++) {
		//for every block in the copy array
      block = this.blockHolder[n];
	  //if that block is not yet placed
	  if(block.fit==null){
	  //if we can find a home on this sheet
      if (node = this.findNode(this.root, block.w, block.h)){
        block.fit = this.splitNode(node, block.w, block.h);	
		block.placed=true;
		(function(sheet){block.sheet=sheet;})(sheet);
		this.placed+=1;
		console.log(block.desc+"placed");
	  }
	  console.log(this.placed+" blocks placed on sheet "+ sheet);
	  }
	  else{console.log('block skipped');}
    }
	sheet+=1;
	this.root=[];
	this.root =  { x: 0, y: 0, w: this.sheetWidth, h: this.sheetHeight };
	for(var j=0; j<blocks.length; j++){
	
		  blocks[j]=this.blockHolder[j];
	
	  }
	  }
 callback(null, sheet); },
 setSheet: function(sheetNum, blockNum, blocksArray){
	blocksArray[blockNum].sheet=sheetNum;
},
 
  findNode: function(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if ((w <= root.w) && (h <= root.h))
      return root;
    else
      return null;
  },

  splitNode: function(node, w, h) {
    node.used = true;
    node.down  = { x: node.x,     y: node.y + h+0.25, w: node.w,     h: node.h - h-0.25 };
    node.right = { x: node.x +0.25 + w, y: node.y,     w: node.w - w-0.25, h: h        };
    return node;
  }

}



router.post('/plysheetview',function(req,res){
var sheet=req.body.sheet;
	var idd=req.body.idd;
async.waterfall([
function(callback){
fs.readFile('public/fitted.json', 'utf8', function(err,data){
if (err){
callback(err, null);
return;
}
else{
callback(null, data)
}
	});
},
function(data, callback){
var count=0;
var sheetblocks=[];
	var blocks=JSON.parse(data);
	for(var q=0; q<blocks.length; q++){
	if(blocks[q].sheet==sheet){
	sheetblocks[count]=blocks[q];
	count+=1;
	}
	}
callback(null,sheetblocks);
},
function(sheetblocks, callback){
	var counter=0;
var arrWidth=[];
var arrHeight=[];
var arrXpos=[];	
var arrPos=[];
var arrCol=[];
var arrDesc=[];
var arrDim=[];
var packWidth=96;
var packHeight=48;
var plyOutline=[packWidth*10, packHeight*10];
sheetblocks.forEach(function(b){
if (b.fit) {
		
arrWidth[counter]=10*Math.floor(b.w);
arrHeight[counter]=10*Math.floor(b.h);
arrXpos[counter]=10*Math.ceil(b.fit.x);
arrPos[counter]= 10*Math.ceil(b.fit.y);
arrCol[counter]='#'+Math.floor(Math.random()*16777215).toString(16);
arrDesc[counter]=b.desc;
arrDim[counter]=b.w +'" X ' + b.h + '"';
console.log(b.desc);
console.log('x:' , b.fit.x);
console.log('y:',b.fit.y);
console.log('w:',b.w);
console.log('h:',b.h);
console.log('sheet:',b.sheet);
counter+=1;
}

});
res.setHeader('Content-Type', 'image/png');
draw(plyOutline, arrXpos, arrPos, arrWidth, arrHeight, arrCol, arrDesc, arrDim).pngStream().pipe(res);
var stream=canvas.pngStream();
//stream.pipe(res);
callback(null, "success");
}], function(err,result){
if(err){return err;}
else{
  return result;
}
}
)


});
	
function draw (plyOutline, arrXpos, arrPos, arrWidth, arrHeight, arrCol, arrDesc, arrDim) {
console.log(plyOutline[0]);
console.log(plyOutline[1]);
console.log("definitely running draw");
var Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(plyOutline[0]+50, plyOutline[1]+50),
      ctx = canvas.getContext('2d');

for (var i = 0; i < arrWidth.length; i++) {

ctx.fillstyle="black";
//ctx.fillStyle=arrCol[i];
ctx.strokeRect(arrXpos[i],arrPos[i],arrWidth[i], arrHeight[i]);
ctx.font="16px Georgia";
ctx.fillStyle = "black";
ctx.fillText(arrDesc[i], arrXpos[i]	, arrPos[i]+(arrHeight[i]/3));
ctx.fillText(arrDim[i], arrXpos[i]	, arrPos[i]+(arrHeight[i]*(3/4)));

}
ctx.setLineDash([10]);
ctx.fillStyle = "black";

ctx.strokeRect(0,0,plyOutline[0], plyOutline[1]);

return canvas;

};
router.post('/gencuts',function(req,res){
	
fs.readFile('public/blocks.json', 'utf8', function(err,data){
	var idd= req.body.idd;	
	console.log('idd in gencuts:', idd);
if (err){
console.log(err);
}
else{
var blocks=JSON.parse(data);
var packWidth=96;
var packHeight=48;
packer= new Packer(packWidth, packHeight);
packer.fit(blocks,function(err, val){
	if(err){console.log(err);}
	else{
var sheets=val;
var sheetNums=[];
for(var j=1; j<sheets; j++){
sheetNums[j]={sheet: j, buttonText: "sheet# "+ (j).toString()};
}

res.render('display',{blocks:blocks, sheetNums: sheetNums, idd:idd}); 
fs.writeFile('public/fitted.json', JSON.stringify(blocks), function (err) {
if(err){console.log('fucked')}
console.log('file written');
}); 
	}
});
}
});
});




router.get('/display_parts', function(req, res){
	res.render('display');
});
router.post('/genparts', function(req, res){
var idd=req.body.idd;
async.waterfall([
function(callback){
funcs.calcPlyParts(idd, function(err, resu){
callback(null, resu);
});
},
function(plyID, callback){
console.log('ply passed to me as ',plyID);

//get the single data entry back
db.plyParts.findOne({_id: mongojs.ObjectId(plyID)}, function(err, doc){
if(err){console.log(err);
callback(err, null); }
else{
callback(null, doc);
}
});
},
function(doc, callback){
res.render('plyhard',{idd:doc});
}
]
, function (err, result) {
    if (err){
     console.log(err);
    }
})
});



router.post('/tvstand/add', function(req, res){

var ow=convertToDecimal(req.body.overall_width_foot, req.body.overall_width_inch, req.body.overall_width_fract);
var oh=convertToDecimal(req.body.overall_height_foot, req.body.overall_height_inch, req.body.overall_height_fract);
var od=convertToDecimal(req.body.overall_depth_foot, req.body.overall_depth_inch, req.body.overall_depth_fract);
var ffbw=convertToDecimal(req.body.face_frame_board_width_foot, req.body.face_frame_board_width_inch, req.body.face_frame_board_width_fract);
var ssw=convertToDecimal(req.body.section_side_widths_foot, req.body.section_side_widths_inch, req.body.section_side_widths_fract);
var scw=convertToDecimal(req.body.section_center_width_foot, req.body.section_center_width_inch, req.body.section_center_width_fract);
var dbw=convertToDecimal(req.body.door_board_width_foot, req.body.door_board_width_inch, req.body.door_board_width_fract);

var allDims=funcs.calcStandDims(ow,oh, od, ffbw,ssw, scw, dbw);

//save the data
db.standDims.save(allDims,function(err,saved){
if(err || !saved){console.log("save error");}
else{console.log('data saved OK with id ', allDims._id);

//get the single data entry back
db.standDims.findOne({_id: mongojs.ObjectId(allDims._id)}, function(err, doc){
if(err){console.log(err);   }
else{console.log('Overall Width is',doc.overallWidth.toString());

res.render('show',{idd: doc});
fs.writeFile('public/current.json', JSON.stringify(doc), function (err) {
  if (err) return console.log(err);
  console.log('Doc > current.json');
});
}
});


}
});



});



router.get('/tvstand/dbentries', function(req,res){
// find everything
var idd= 'idd';
db.userDefined.find(function (err, docs) {
if(err){
console.log(err);
}
console.log(docs);
//res.render('indb.ejs',{
//title: 'User Defined TV Stands', dims: docs, idd:idd
res.render('show',{idd:idd
})
});
});



router.get('/tv_submit',function(req, res){

form_functions.displayTV(res);
});


convertToDecimal = function(ft, inch, frac){
var footDec=0;
var inchDec=0;
var fractDec=0;
switch(ft) {
    case '1':
        footDec=12;
        break;
    case '2':
        footDec=24;
        break;
     case '3':
        footDec=36;
        break;
     case '4':
        footDec=48;
        break;
     case '5':
        footDec=60;
        break;

    default:
        break;
}
switch(inch) {
    case '1':
        inchDec=1;
        break;
    case '2':
        inchDec=2;
        break;
     case '3':
        inchDec=3;
        break;
     case '4':
        inchDec=4;
        break;
     case '5':
        inchDec=5;
        break;
      case '6':
        inchDec=6;
        break;
       case' 7':
        inchDec=7;
        break;
       case '8':
         inchDec=8;
        break;
       case '9':
         inchDec=9;
        break;
        case '10':
         inchDec=10;
        break;
	 case '11':
         inchDec=11;
        break;
       default:
        break;
}

switch(frac)
{

  case('1/16'):
    fractDec=0.0625;
    break;
   case('1/8'):
    fractDec=0.125;
    break;
   case('3/16'):
    fractDec=0.1875;
    break;
   case('1/4'):
   fractDec=0.25;
    break;
   case('5/16'):
   fractDec=0.3125;
    break;
   case('3/8'):
   fractDec=0.375;
    break;
   case('7/16'):
   fractDec=0.4375;
    break;
   case('1/2'):
   fractDec=0.5;
    break;
   case('9/16'):
   fractDec=0.5625;
    break;
   case('5/8'):
   fractDec=0.625;
    break;
   case('11/16'):
   fractDec=0.6875;
    break;
   case('3/4'):
   fractDec=0.75;
    break;
   case('13/16'):
   fractDec=0.8125;
    break;
   case('7/8'):
   fractDec=0.875;
    break;
   case('15/16'):
   fractDec=0.9375;
    break;

   default:
    break;
}

var totalDec=footDec+inchDec+fractDec;
 return totalDec;

}
router.get('/',function(req, res, err){
if(err){
console.log(err);
}
res.render('index',{
title: 'TV Stand Form', fractions:fractions, inches:inches, feet:feet
})
});



function processThisBitch(req, res){
//res.writeHead(200);
  //res.end("hello world\n");
//res.send({ status: 'SUCCESS' });
res.write("Width: " +  req.body.overall_width_fract);
res.write("Height: "+ req.body.overall_height_fract);
res.write("Length: "+ req.body.overall_length_fract);

res.end();

};



router.post('/tv_submit',function(req, res){
form_functions.processTV(req, res);
processThisBitch(req, res);;
});














function parseTheJSON(jsonFilePath){

var fs = require('fs');
var jsonArr = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

return jsonArr


};


router.get('/show', function (req, res, next) {
jsonIt=parseTheJSON('./table.json');
arrWidth=[];
arrHeight=[];
arrXpos=[];
arrYpos=[];
arrColors=["#FF0000", "#00FF00", "#0000FF"];

for (var i=0; i<3; i++){
arrWidth[i]=jsonIt[i].width;
arrHeight[i]=jsonIt[i].height;
arrXpos[i]=jsonIt[i].rhc_x;
arrYpos[i]=jsonIt[i].rhc_y;
}
  res.setHeader('Content-Type', 'image/png');
  draw(arrXpos, arrYpos, arrWidth, arrHeight).pngStream().pipe(res);
});

router.get('/testdata', function (req, res, next) {
  getData();
  jsonIt=parseTheJSON('./table.json');
  console.log(jsonIt);
  arrWidth=jsonIt.width;
console.log('in the get, width is ', arrWidth);
});

router.get('/form', function (req, res, next) {
res.send('./views');
});



function draw3() {
  var Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(200, 200),
      ctx = canvas.getContext('2d');

  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);

  return canvas;
}

function draw2() {
console.log("running draw2");
  var Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(200, 200),
      ctx = canvas.getContext('2d');

  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);
};




function getData(){
var con = getCon();


con.query('SELECT * FROM plypart',function(err, rows, fields){

	        if(err){
	         throw err;
               }
        else {

     fs.writeFile('table.json', JSON.stringify(rows), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
}

});


con.end();

};


function getCon(){


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "danny1",
 database: "cabdb"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');

});


//con.end(function(err) {
 //console.log("Connection closed!");
// The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
//});
return con;

  };



//router.get('/',function(req, res){

//res.render('index', {title: 'I Love Kerri Lynn Caguiat!', age: '45', startX: 100, startY: 100, deltaX: 250, deltaY: 150
//})});

 router.get('/test',function(req, res){

form_functions.displayForm(res);
});

router.get('/db',function(req, res){
getRows();
});





router.post('/test',function(req, res){
form_functions.processIndivForm(req, res);
processThisBitch(req, res);;
});


module.exports = router;

