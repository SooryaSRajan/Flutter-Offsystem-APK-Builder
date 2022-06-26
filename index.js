const express = require("express")
const app = express()
const exec = require('child_process').exec;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const URL = require("url").URL;

function OSFunc() {
    this.execCommand = function (cmd, callback) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                callback(true, stderr);
                return;
            }

            callback(false, stdout);
        });
    }
}

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

const os = new OSFunc();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/cloneGitHub", (req, res) => {
    console.log(req.query.url)

    const url = req.query.url

    if(!url){
        return res.status(400).send("Please attach URL")
    }
    if(!stringIsAValidUrl(url)){
        return res.status(400).send("Invalid URl")
    }

    os.execCommand("rm -rf FlutterCode", function (err, response) {
        if(err) return res.status(200).send(response)
        os.execCommand(`git clone ${url} FlutterCode`, function (err, response){
            if(err){
                return res.send("Could not clone into " + url + " error: " + response)
            }
            //TODO: Run build command here
            res.send(response)
        })
    })
})

app.listen(8080, () => {
    console.log("Running on port 8080")
})
