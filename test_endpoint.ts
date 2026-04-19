import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message'
    })
  });
  const data = await res.text();
  console.log('Response Status:', res.status);
  console.log('Response Body:', data);
}

test();
