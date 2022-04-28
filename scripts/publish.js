import ghpages from'gh-pages';

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