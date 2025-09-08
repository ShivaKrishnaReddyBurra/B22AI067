const { Log } = require('../src/index');

async function testLog() {
    await Log('backend', 'error', 'db', 'Test error message');
}

testLog();