
var http = require('http');
var fs = require('fs');

var path    = require("path");
var async=require('async');

var mongojs = require('mongojs');
var databaseUrl="tvstanddb";
var collections=["standDims", "plyParts", "hardParts"];
var db = mongojs(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;
var helperFuncs = require('./helperFunctions.js');

calcAndArray=function(ow, oh, od, ffbw,ssw,scw,dbw, callback){
//this function takes user input values for the TV Stand, 
//calculates the remaining dimensions associated with the project, 
//and returns an array of all dimensions
var ct=0.75;
var co=1.0;

try{
	
//Face Frame Vars:
   // Face Frame Width:
var ffw=ow-2.0*co;
   // Face Frame Height:
var ffh=oh-ct;
   // Face Frame Stile Length:
var ffsl=ffh;
   //Face Frame Rail Length:
var ffrl=ffw-2.0*ffbw;
   // Face Frame Baseboard Height:
var ffbbh=3.25;
   //Face Frame Vertical Divider Length:
var ffvdl=ffh-2.0*ffbw-ffbbh+0.5;

//Door Dimension Vars:
   //Door Recess:
var drec=0.375;
   //Door Stile Lengths:
var dsl=ffvdl;
  //Door Rail Lengths:
var drl=ssw-2.0*dbw+2.0*drec;
  //Door Center Panel Width:
var dcpw=drl;
  //Door Center Panel Length:
var dcpl=dsl-2.0*dbw-2*drec;

//Box Parts:
 //Box Part Plywood Thickness:
var bppt=0.75;
  //Box Part Side Width:
var bpsw=od-co-0.75;
  //Box Part Side Length:
var bpsl=ffh;
  //Box Part Bottom Width:
var bpbw=bpsw;
  //Box Part Bottom Length:
var bpbl=ow-2.0*co-0.5-0.75;
  //Box Part Divider Width:
var bpdw=bpsw-0.75;
  //Box Part Divider Length:
var bpdl=ffvdl+ffbw+0.125;
  //Box Part Back Brace Length:
var bpbbl=bpbl-0.75;
  //Box Part Back Brace Width:
var bpbbw=4.0;

//Countertop Vars:
  //Counter Width:
var cw=od-0.75;
  //Counter Length:
var cl=ow-2.0*0.75;
  //Hardwood Wrap Width:
var chww=1.0;
  //Hardwood Wrap Thickness:
var chwt=0.75;
  //Hardwood Wrap Length:
var chwl=ow+2.0*od;

//Shelf Vars:
  //Center Shelf Width:
var csfw=scw+0.75-0.125;
  //Side Shelf Width:
var ssfw=ssw+0.5+0.375-0.125;
  //Shelf Length:
var sfl=bpsw-0.5;
  //Hardwood Shelf Wrap Width:
var hsww=1.0;
  //Hardwood Shelf Wrap Thickness:
var hswt=0.75;
  //Hardwood Shelf Wrap Length:
var hswl=csfw*2.0+ssfw*4.0;
//define return array
var allDims=
{
overallWidth: ow,
overallHeight: oh,
overallDepth: od,
faceFrameWidth: ffw,
faceFrameHeight: ffh,
faceFrameBoardWidth: ffbw,
faceFrameStileLength: ffsl,
faceFrameRailLength: ffrl,
faceFrameBaseboardHeight: ffbbh,
faceFrameVerticalDividerLength: ffvdl,
sectionSideWidths: ssw,
sectionCenterWidth: scw,
doorRecess: drec,
doorStileLengths: dsl,
doorBoardWidth: dbw,
doorRailLength: drl,
doorCenterPanelWidth: dcpw,
doorCenterPanelLength: dcpl,
boxPartPlywoodThickness: bppt,
boxPartSideWidth: bpsw,
boxPartSideLength: bpsl,
boxPartBottomWidth: bpbw,
boxPartBottomLength: bpbl,
boxPartDividerWidth: bpdw,
boxPartDividerLength: bpdl,
boxPartBackBraceLength: bpbbl,
boxPartBackBraceWidth: bpbbw,
counterWidth: cw,
counterLength: cl,
counterHardwoodWrapWidth: chww,
counterHardwoodWrapThickness: chwt,
counterHardwoodWrapLength: chwl,
centerShelfWidth: csfw,
sideShelfWidth: ssfw,
shelfLength: sfl,
hardwoodShelfWrapWidth: hsww,
hardwoodShelfWrapThickness: hswt,
hardwoodShelfWrapLength: hswl
}
}
catch(err){
	
	callback(err, null);
	
}
callback(null,allDims);
};


function calcPlyParts(objID, callback2){
async.waterfall([
function(callback){
 //get data from mongo
  db.standDims.findOne({_id: mongojs.ObjectId(objID)}, function(err, doc){
   if(err){
     console.log(err);
     callback(err,null);
     return;
  }
   else
   {
   console.log('function 1 gave', doc);
   callback(null, doc);
   }
   });
},
function(doc, callback){
//save to vars
var projectID= objID;
var sideWidth= doc.boxPartSideWidth;
var sideQty= 2;
var sideLength=doc.boxPartSideLength;
var sideThickness= 0.75;
var bottomWidth = doc.boxPartBottomWidth;
var bottomQty= 1;
var bottomLength= doc.boxPartBottomLength;
var bottomThickness= 0.75;
var dividerWidth= doc.boxPartDividerWidth;
var dividerLength= doc.boxPartDividerLength;
var dividerThickness=0.75;
var dividerQty= 2;
var countertopWidth= doc.counterWidth;
var countertopLength= doc.counterLength;
var countertopThickness= 0.75;
var countertopQty= 1;
var backBraceWidth= doc.boxPartBackBraceWidth;
var backBraceLength= doc.boxPartBackBraceLength;
var backBraceThickness= 0.75;
var backBraceQty= 1;
var centerShelfWidth= doc.centerShelfWidth;
var centerShelfLength= doc.shelfLength;
var centerShelfThickness= 0.75;
var centerShelfQty= 2;
var sideShelfWidth= doc.sideShelfWidth;
var sideShelfLength= doc.shelfLength;
var sideShelfThickness= 0.75;
var sideShelfQty= 4;
var doorPanelWidth= doc.doorCenterPanelWidth;
var doorPanelLength=doc.doorCenterPanelLength;
var doorPanelThickness= 0.75;
var doorPanelQty=2;


var plyDims=
{
projectID: projectID,
sideWidth: sideWidth,
sideQty: sideQty,
sideLength: sideLength,
sideThickness: sideThickness,
bottomWidth: bottomWidth,
bottomQty: bottomQty,
bottomLength: bottomLength,
bottomThickness: bottomThickness,
dividerWidth: dividerWidth,
dividerLength: dividerLength,
dividerThickness: dividerThickness,
dividerQty: dividerQty,
countertopWidth: countertopWidth,
countertopLength: countertopLength,
countertopThickness: countertopThickness,
countertopQty: countertopQty,
backBraceWidth: backBraceWidth,
backBraceLength: backBraceLength,
backBraceThickness: backBraceThickness,
backBraceQty: backBraceQty,
centerShelfWidth: centerShelfWidth,
centerShelfLength: centerShelfLength,
centerShelfThickness:centerShelfThickness,
centerShelfQty: centerShelfQty,
sideShelfWidth: sideShelfWidth,
sideShelfLength: sideShelfLength,
sideShelfThickness: sideShelfThickness,
sideShelfQty: sideShelfQty,
doorPanelWidth: doorPanelWidth,
doorPanelLength: doorPanelLength,
doorPanelThickness: doorPanelThickness,
doorPanelQty: doorPanelQty
};
//save the data
db.plyParts.save(plyDims,function(err,saved){
if(err || !saved){
console.log("save error");
callback(err, null);
return;
}
else{
console.log('data saved OK with id ', plyDims._id);

callback(null, plyDims._id);
}
});
}
], function (err, result) {
    if (err){
     console.log(err);
    callback2(err, null);
    }
   else{
     callback2(null, result);
    }
})
};

function setupPlyArray(plyID, callback2){
console.log('in tv functions');
async.waterfall([
function(callback){
//get the single data entry back
db.plyParts.findOne({_id: mongojs.ObjectId(plyID)}, function(err, doc){
if(err){console.log(err);
callback(err, null);
return;
}
else{
callback(null, doc);
}
});
},
function(doc, callback){
blocks=[
{w:doc.sideLength,h: doc.sideWidth, partNum: 1, desc: "side one"},

{w:doc.sideLength,h: doc.sideWidth, partNum: 2, desc: "side two"},

{w:doc.bottomLength,h:doc.bottomWidth, partNum: 3, desc: "bottom"},

{w:doc.dividerLength,h:doc.dividerWidth, partNum: 4, desc: "divider one"},

{w:doc.dividerLength,h:doc.dividerWidth, partNum: 5, desc: "divider two"},

{w:doc.countertopLength,h:doc.countertopWidth, partNum: 6, desc: "countertop"
},

{w:doc.backBraceLength,h:doc.backBraceWidth, partNum: 7, desc: "back brace"},

{w:doc.centerShelfLength,h:doc.centerShelfWidth, partNum: 8, desc: "center shelf one"},

{w:doc.centerShelfLength,h:doc.centerShelfWidth, partNum: 9, desc: "center shelf two"},

{w:doc.sideShelfLength,h: doc.sideShelfWidth, partNum: 10, desc: "side shelf one"},

{w:doc.sideShelfLength,h: doc.sideShelfWidth, partNum: 11, desc: "side shelf two"},

{w:doc.sideShelfLength,h: doc.sideShelfWidth, partNum: 12, desc: "side shelf three"},


{w:doc.sideShelfLength,h: doc.sideShelfWidth, partNum: 13, desc: "side shelf four"}
];

fs.writeFile('public/blocks.json', JSON.stringify(blocks), function (err) {
  if (err) {
  callback(err, null);
  return;
}
else{
  console.log('blocks> blocks.json');
  callback(null, blocks);
}
});
}],function (err, result) {
    if (err){
     console.log(err);
    callback2(err, null);
    }
   else{
     callback2(null,sortByWidth(result));
    }
})

};

function sortByWidth(json_object){
//this function takes a block array and sorts it by width for use in the packing algorithm
return json_object.sort(function(obj1, obj2) {
	// Ascending: first age less than the previous
	return obj2.w - obj1.w;
});

}

module.exports.calcAndArray = calcAndArray;
module.exports.calcPlyParts = calcPlyParts;
module.exports.setupPlyArray = setupPlyArray;