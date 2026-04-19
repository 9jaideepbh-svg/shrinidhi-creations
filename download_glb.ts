import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/public/shirt_baked_collapsed.glb';

https.get(url, (res) => {
  if (res.statusCode === 404) {
    console.error('File not found');
    process.exit(1);
  }
  const fileStream = fs.createWriteStream('./public/shirt.glb');
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Download complete.');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
