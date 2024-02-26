(function () {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    
    function baseName(str) {
        var base = new String(str).substring(str.lastIndexOf('/') + 1); 
        if (base.lastIndexOf(".") != -1) {
            base = base.substring(0, base.lastIndexOf("."));
        }     
        return base;
    }

    var args = process.argv.slice(2);
    args.forEach(function (val, index, array) {
        var filename = val;
        var basename = baseName(filename);
        console.log(index + ': Input File ... ' + filename);
        
        ffmpeg(filename)
            // Generate 720P video in WebM format
            .output(basename + '-1280x720.webm')
            .videoCodec('libvpx')
            .audioCodec('libopus')  
            .addOptions(['-crf 30', '-b:v 1M'])
            .size('1280x720')
		  
		    // Generate 1080P video in WebM format
		    .output(basename + '-426x240.webm')
		    .videoCodec('libvpx')
            .audioCodec('libopus')
		    .addOptions(['-crf 42', '-b:v 0.2M'])
		    .size('426x240')
            .audioBitrate('64k')

            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })  
            .on('progress', function(progress) { 
                console.log('... frames: ' + progress.frames);
            })
            .on('end', function() { 
                console.log('Finished processing'); 
            })
            .run();
        
    });  
    
})();