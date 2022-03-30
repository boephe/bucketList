//-------------------------------------------------
// TODO: Add your own AWS config here
AWS.config.update({
  accessKeyId: '[Your-Access-Key-ID]',
  secretAccessKey: '[Your-Secret-AccessKey]'
});
AWS.config.region = '[AWS-Region]';
const bucketName = '[Your-Bucket-Name]';
const domainName = '[Your-Website-Domain-Name]';
//-------------------------------------------------

//  Get all the files out of the bucket and list them in HTML
function listFiles(s3bucket) {

  //  Create a new bucket object pointing to your bucket
  const bucket = new AWS.S3({
    params: {
      Bucket: s3bucket
    }
  });

  //  Use our bucket object to get all the files in the bucket
  bucket.listObjects(function(err, data) {
    if (err) {
      //  If we failed assume they don't have JavaScript enabled
      document.getElementById('status').innerHTML = 'This site requires Javascript';
    } else {
      //  Start off our HTML for each file listing
      var audiocontrols = '<audio controls><source src="';
      var fileTitle; // Used below to extract title from filename
      var fileNumber = 1; // Used to enumerate files, increment in for loop

      //  These are the file extensions we are looking for
      var audioExtensions = '.mp3 .ogg .wav';
      //  Go through each of the returned items from the bucket
      for (var i = 0; i < data.Contents.length; i++) {
        //  Get the extension of the item
        var thisAudioExtension = data.Contents[i].Key.substring(data.Contents[i].Key.length - 4);
        
        //  If it matches the extensions we want to keep, process it
        if (audioExtensions.indexOf(thisAudioExtension) != -1) {
          fileTitle = data.Contents[i].Key;       // Get the filename
          fileTitle = fileTitle.substring(0,(fileTitle.length-4));  // Strip the extension

          //  Create a file object with all the info that we want to print
          var FileObj = Object.create(Object.prototype, {
            filename: {
              value: data.Contents[i].Key,
              enumerable: true,
              writable: true,
              configurable: true
            },
            ETag: {
              value: data.Contents[i].ETag,
              enumerable: false,
              writable: false,
              configurable: false
            },
            Title: {
              value: false || fileTitle, 
              enumerable: true,
              writable: true,
              configurable: true
            },
            Size: {
              value: (data.Contents[i].Size / 1048576).toFixed(2),
              enumerable: true,
              writable: true,
              configurable: true
            }
          });

	        audiocontrols = "Please click on the link to listen in your web browser.";
          document.getElementById('objects').innerHTML += '<tr><td>' + fileNumber + '</td><td><a href="//'
            + domainName + '/' + FileObj.filename + '" target="_blank">' + FileObj.Title
            + '</a></td><td>' + audiocontrols + '</td></tr>';
          fileNumber++;
        }
      }
    }
  });
}
//  Kick off the script
listFiles(bucketName);
