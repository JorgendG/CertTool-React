const fs=require('fs');
const axios = require("axios");

fs.readdir('/work', (err, data) => {
    if (err) throw err;
    console.log(data);
    console.log('Na readdir');
});

fs.readFile('/work/testdata.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
    console.log(data.toString());
});


const url = 'http://localhost:3001/';
axios.get(url).then(resp => {

    console.log(resp.data);
});


const config = {
    url : 'http://localhost:3001/',
    method : 'get'
}

async function makeRequest() {
    
    let res = await axios(config)

    console.log(res.data);
}

makeRequest();

console.log('Einde');