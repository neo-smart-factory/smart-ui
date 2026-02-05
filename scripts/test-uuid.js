/**
 * TEST UUID Specifically
 */
async function test() {
    const envId = '1bac94c5-7647-49b5-b8aa-59138a4cdb4a';
    const domain = 'app.dynamicauth.com';
    const url = `https://${domain}/api/v0/sdk/${envId}/config`;
    const response = await fetch(url, { headers: { 'Origin': 'http://localhost:3000' } });
    console.log(`Status for ${envId}: ${response.status}`);
}
test();
