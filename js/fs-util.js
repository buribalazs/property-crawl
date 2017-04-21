const fs = require('fs');

function mkdir(path) {
    let root = './';
    path = path.split('/');
    path.forEach(dir => {
        root += dir + '/';
        if (!fs.existsSync(root)) {
            fs.mkdirSync(root);
        }
    });
}

module.exports = {
    mkdir,
};