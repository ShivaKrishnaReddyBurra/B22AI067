async function testShortener() {
    const createResponse = await fetch('http://localhost:3000/shorturls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: 'https://example.com/very-long-url',
            validity: 30,
            shortcode: 'test1' // Optional
        })
    });

    if (createResponse.ok) {
        const data = await createResponse.json();
        console.log('Created:', data);

        // Test redirection (simulate GET)
        const redirectResponse = await fetch(data.shortLink, { redirect: 'manual' });
        console.log('Redirect status:', redirectResponse.status, 'Location:', redirectResponse.headers.get('location'));
    } else {
        console.error('Error creating:', await createResponse.text());
    }
}

testShortener();