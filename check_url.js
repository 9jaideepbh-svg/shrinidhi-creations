import https from 'https';

const url = 'https://vazxmixizkinqihweocy.supabase.co/storage/v1/object/public/models/t-shirt/model.gltf';

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode === 200) {
    console.log('Valid URL!');
  }
});
