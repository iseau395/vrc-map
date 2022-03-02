const ghpages = require('gh-pages');
const { exec } = require("child_process");

exec("npm run build", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`${stderr}`);
        return;
    }
});

ghpages.publish('public', 
    {
        branch: 'gh-pages',
        repo: 'https://github.com/iseau395/vrc-map.git',
        message: 'Automatically update github pages branch'
    },
    (err) => {
        if (err) console.error(err);
    }
);