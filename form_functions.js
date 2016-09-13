
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var displayForm = function(res) {
    fs.readFile('bootform.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
};

var displayTV = function(res) {
    fs.readFile('tv_form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
};

var processTV = function(req, res) {
console.log('Overall Width:', req.body.overall_width);
console.log('Overall Length:', req.body.overall_length);
console.log('Overall Height:', req.body.overall_height);


}


var drawIt = function (canvas){
  var context = canvas.getContext('2d');
  context.fillStyle="#ff00ff";
  context.fillRect(0,0,200,200);

};
var processIndivForm = function(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fs.writeFile('./test.txt', field,value.toString);

        fields[field] = value;
    });

     form.on('end', function () {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
    form.parse(req);
}


var  processFormFields = function(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm({ uploadDir: __dirname + '/uploaded' });
    //Call back when each field in the form is parsed.
    form.on('field', function (field, value) {
        fs.writeFile('./test.txt', field,value.toString);
        console.log(field);
        console.log(value);
        fields[field] = value;
    });

/* this is where the renaming happens */
   form.on('fileBegin', function(name, file){
            //rename the incoming file to the file's name
            file.path = form.uploadDir + "/" + file.name;
    })
    //Call back when each file in the form is parsed.
    form.on('file', function (name, file) {
        console.log(name);
        console.log(file);
        fields[name] = file;
        //Storing the files meta in fields array.
        //Depending on the application you can process it accordingly.
    });

    //Call back for file upload progress.
    form.on('progress', function (bytesReceived, bytesExpected) {
        var progress = {
            type: 'progress',
            bytesReceived: bytesReceived,
            bytesExpected: bytesExpected
        };
        console.log(progress);
        //Logging the progress on console.
        //Depending on your application you can either send the progress to client
 });

    //Call back for file upload progress.
    form.on('progress', function (bytesReceived, bytesExpected) {
        var progress = {
            type: 'progress',
            bytesReceived: bytesReceived,
            bytesExpected: bytesExpected
        };
        console.log(progress);
        //Logging the progress on console.
        //Depending on your application you can either send the progress to client
        //for some visual feedback or perform some other operation.
    });

    //Call back at the end of the form.
    form.on('end', function () {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
    form.parse(req);
}

var processFieldsWithoutImage = function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

module.exports.drawIt =drawIt;
module.exports.displayForm = displayForm;
module.exports.processForm= processFormFields;
module.exports.processNoImage= processFieldsWithoutImage;
module.exports.processIndivForm=processIndivForm;

module.exports.displayTV = displayTV;

module.exports.processTV = processTV;

