import fetch from 'node-fetch';

async function testWeb3() {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://example.com',
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({
      access_key: "f4834dcb-dffa-44c7-b967-447076b36277",
      name: "test",
      email: "test@example.com",
      message: "test message"
    })
  });
  const data = await res.text();
  console.log('Web3Forms Status:', res.status);
  console.log('Web3Forms Body substring:', data.substring(0, 100)); // don't print full HTML
}

testWeb3();
