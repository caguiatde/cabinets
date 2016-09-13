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


module.exports.Packer = Packer;