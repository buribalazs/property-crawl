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

function state(obj) {
    if (obj) {
        return new Promise((resolve,reject) => {
            fs.writeFile('./state/state.state', JSON.stringify(obj), (err,res) => {
                if (err){
                    reject(err.message);
                }else{
                    resolve(res);
                }
            });
        });
    } else {
        return new Promise((resolve) => {
            fs.readFile('./state/state.state', (err, res) => {
                if (err) {
                    let schema = {currentPage: 1};
                    mkdir('state');
                    fs.writeFile('./state/state.state', JSON.stringify(schema));
                    resolve(schema);
                } else {
                    resolve(JSON.parse(res));
                }
            });
        });
    }
}

module.exports = {
    mkdir,
    state
};