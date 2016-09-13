var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var app     = express();
var path    = require("path");
var async=require('async');

var mongojs = require('mongojs');
var databaseUrl="tvstanddb";
var collections=["standDims", "plyParts", "hardParts"];
var db = mongojs(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

function sortByWidth(json_object){
//this function takes a block array and sorts it by width for use in the packing algorithm

return json_object.sort(function(obj1, obj2) {
	// Ascending: first age less than the previous
	return obj2.w - obj1.w;
});

}

function draw (plyOutline, arrXpos, arrPos, arrWidth, arrHeight, arrCol, arrDesc, arrDim, callback) {
try{
console.log("definitely running draw from helpers");
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
}
catch(err){
	callback(err, null);
	
}
callback(null,canvas);

};

module.exports.sortByWidth = sortByWidth;
module.exports.draw = draw;