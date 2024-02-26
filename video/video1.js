const jimp = require('jimp');
const fs = require('fs-extra');
const util = require('util');
const Jimp = require('jimp');

const exec = util.promisify(require('child_process').exec);

const debug = false;
const videoEncoder = "h264";
const input = "input.mp4";
const output = "output.mp4";

async function init() {
    try {
        console.log("Initializing temporary files");
        await fs.mkdir("temp");
        await fs.mkdir("temp/raw-frames");
        await fs.mkdir("temp/edited-frames");

        console.log("Decoding");
        await exec(`ffmpeg -i ${input} temp/raw-frames/%d.png`);

        console.log("Rendering");
        const frames = fs.readdirSync("temp/raw-frames");

        for (let count = 1; count < frames.length; count++) {
            let frame = await jimp.read(`temp/raw-frames/${count}.png`);
            frame = await onFrame(frame, count);
            await frame.writeAsync(`temp/edited-frames/${count}.png`);
        }

        console.log("Encoding");
        await exec(`ffmpeg -start_number 1 -i temp/edited-frames/%d.png -vcodec ${videoEncoder} -filter:v "setpts=0.5*PTS" temp/no-audio.mp4`);

        console.log("Adding audio");
        await exec(`ffmpeg -i temp/no-audio.mp4 -i input.pm4 -c copy 0:v:0 -map 1:a:0 ${output}`)
    } catch (error) {
        console.log("An error occured:", error);
        if (!debug) await fs.remove("temp");
    }
}

init();

async function onFrame(frame, frameCount) {
    if (frameCount < 5) {
        frame = new Jimp(frame.bitmap.width, frame.bitmap.height, 0xff0000ff, (err, image) => {

        })
    } else {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        frame.print(font, 0, 0,`Frame Count: ${frameCount}`);

        frame.scan(0, 0, frame.bitmap.width, frame.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idsx + 0];
            const green = this.bitmap.data[idsx + 1];
            const blue = this.bitmap.data[idsx + 2];
            const alpha = this.bitmap.data[idsx + 3];

            if (x < y) {
                this.bitmap.data[idx + 2] = 255;
            }
        })
    }

    return frame;
}