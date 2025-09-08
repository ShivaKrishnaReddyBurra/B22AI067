/**
 * @function getAccessToken
 * @description This function for logining in with the creditials (right now it's hard coded) and return the bearer token generated for 15 mins
 * @returns {object}
 */
async function getAccessToken() {
    const authUrl = 'http://20.244.56.144/evaluation-service/auth';
    const authBody = {
        email: 'b22ai067@kitsw.ac.in',
        name: 'shiva krishna reddy burra',
        rollNo: 'b22ai067',
        accessCode: 'qqQzZk',
        clientID: '28eaba21-3ae1-42dc-80cf-6131974eaef7',
        clientSecret: 'hvMNmsVnGBqUMhdC'
    };

    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.token_type !== 'Bearer' || !data.access_token) {
            throw new Error('Invalid authentication response');
        }
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw error;
    }
}

//The below is function that act as Logger for showing the details such as successfull logged in , error messages etc.
async function Log(stack, level, pkg, message) {
    stack = stack.toLowerCase();
    level = level.toLowerCase();
    pkg = pkg.toLowerCase();

    const allowedStacks = ['backend', 'frontend']; // allowed stacks
    if (!allowedStacks.includes(stack)) {
        throw new Error(`Invalid stack: Must be one of ${allowedStacks.join(', ')}`);
    }

    const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal']; // allowed levels 
    if (!allowedLevels.includes(level)) {
        throw new Error(`Invalid level: Must be one of ${allowedLevels.join(', ')}`);
    }

    //allowed packages 
    const commonPackages = ['auth', 'config', 'middleware', 'utils'];
    const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
    const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];

    let allowedPackages;
    if (stack === 'backend') {
        allowedPackages = [...commonPackages, ...backendPackages];
    } else {
        allowedPackages = [...commonPackages, ...frontendPackages];
    }

    if (!allowedPackages.includes(pkg)) {
        throw new Error(`Invalid package for ${stack}: Must be one of ${allowedPackages.join(', ')}`);
    }

    const body = { stack, level, package: pkg, message };
    const url = 'http://20.244.56.144/evaluation-service/logs';
    const accessToken = await getAccessToken(); // logging in 

    try {
        const response = await fetch(url, { // making the call to the logs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Log created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending log:', error.message);
    }
}

module.exports = { Log };