import fs from 'fs';
import path from 'path';
// import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import pusher from '../services/pusher';

const takeMapImage = handler => async (req, res) => {
  try {
    const { lines } = req.body;

    pusher.trigger('save-route', 'status-update', {
      message: 'Creating map image. This may take a few seconds',
      progress: 75,
    });

    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });

    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });

    pusher.trigger('save-route', 'status-update', {
      progress: 65,
    });

    // console.log('awaiting page');
    // open new browser
    const page = await browser.newPage();
    // reduce to 2D array of [lat, lon] coords
    const flattenedCoords = lines.reduce((acc, val) => acc.concat(val), []);

    // Stringify coords before using them as query string
    const coordsStr = JSON.stringify(flattenedCoords);

    // console.log('navigating to url');
    // goto page with map sending coordintaes along
    pusher.trigger('save-route', 'status-update', {
      progress: 55,
    });

    const url = 'https://rtnt-client.now.sh';

    await page.goto(
      `${url}/?coords=${coordsStr}`,
      {
        waitUntil: 'networkidle0',
      }
    );

    // wait for map to load, call onLoad callback, and set state to make the h1 visible
    // await page.waitForSelector('h1');
    // wait one more second to make sure all tiles for the map are loaded. Longer routes can require significantly more tiles
    await page.waitFor(1000);

    const imageBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: 0,
        y: 0,
        width: 640,
        height: 360,
      },
      omitBackground: true,
    });

    await browser.close();
    pusher.trigger('save-route', 'status-update', {
      progress: 45,
    });
    // convert buffer to base64 string
    // const base64Image = await image.toString('base64');
    // attach to request object to be used in the next middleware
    req.buffer = imageBuffer;
    // writeFileToDesktop(image, res);
    // res.send({ data: base64Image });
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .send({ message: 'there was an error taking picture' });
  }

  console.log('returning image handler');
  return handler(req, res);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeFileToDesktop = (image, res) => {
  try {
    const homedir = require('os').homedir();

    const outFile = `Map-Image.jpeg`;
    const outPath = path.join(`${homedir}/Desktop`, outFile);
    const file = fs.createWriteStream(outPath);

    file.on('finish', () => {
      console.log('finished');
      res.send({ message: 'completed writing image' });
    });

    file.on('error', err => {
      console.log('error writing file');
      console.log(err);
    });

    file.write(image);
    file.end();
  } catch (err) {
    console.log(err);
    res.send({ message: 'failed writing image' });
  }
};

export default takeMapImage;
