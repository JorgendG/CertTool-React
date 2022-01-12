const uploadFile = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const certtoolDb = require("../middleware/certtooldb");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
const { stdout } = require("process");
const { default: axios } = require("axios");
//const uploadFileMiddleware = require("../middleware/upload");
const req = require("express/lib/request");
const certtooldb = require("../middleware/certtooldb");
const mongoose = require("mongoose");

async function saveFile(md5, csrfile, keyfile, crtfile) {
  try {
    mongoose.connect("mongodb://localhost/certtool");
    const certrow = await certtooldb.create({
      md5: md5,
      csrfile: csrfile,
      keyfile: keyfile,
      crtfile: crtfile,
    });
  } catch (e) {
    console.log(e.message);
  }
}

const baseUrl = "http://localhost:3001/files/";

var findFiles = function (folder, pattern = /.*/, callback) {
  var flist = [];

  fs.readdirSync(folder).map(function (e) {
    var fname = path.join(folder, e);
    var fstat = fs.lstatSync(fname);
    if (fstat.isDirectory()) {
      // don't want to produce a new array with concat
      Array.prototype.push.apply(flist, findFiles(fname, pattern, callback));
    } else {
      if (pattern.test(fname)) {
        flist.push(fname);
        if (callback) {
          callback(fname);
        }
      }
    }
  });
  return flist;
};

function filterItems(arr, query) {
  return arr.filter(function (el) {
    return el.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
}

function splitcertsubject(certsubject) {
  splitsub = certsubject.trimEnd().split(",");

  // console.log(splitsub);

  let newsub = [];
  let eersteq = true;
  splitsub.forEach((element, index) => {
    if (element.includes('"')) {
      if (eersteq) {
        eersteq = false;
        newsub.push(element.trimStart() + "," + splitsub[index + 1]);
      } else {
        eersteq = true;
      }
    } else {
      newsub.push(element.trimStart());
    }
  });

  // console.log(newsub);

  kpsub = {};
  newsub.forEach((element) => {
    kname = element.split(" = ")[0];
    kvalue = element.split(" = ")[1];
    // kpsub.push(kname, kvalue);
    kpsub[kname] = kvalue;
  });

  return kpsub;
}

const upload = async (req, res) => {
  console.log("Upload hit");
  try {
    var resExec = "";

    await uploadFile(req, res);

    if (req.file == undefined) {
      console.log("Upload req.file undefined");
      return res.status(400).send({ message: "Please upload a file!" });
    }

    try {
      const cmd1 = `openssl x509 -noout -modulus -inform der -in "${req.file.path}"`;
      const cmd2 = `openssl x509 -noout -modulus -inform der -in "${req.file.path}" | openssl md5`;

      execSync(cmd1).toString();
      resExec = execSync(cmd2).toString();
      //console.log( resExecDer);
    } catch (error) {
      //console.log( error.message );
      try {
        const cmd1 = `openssl x509 -noout -modulus -in "${req.file.path}"`;
        const cmd2 = `openssl x509 -noout -modulus -in "${req.file.path}" | openssl md5`;

        execSync(cmd1).toString();
        resExec = execSync(cmd2).toString();
        //console.log( resExec )
      } catch (error) {
        //console.log( error.message );
      }
    }

    //console.log( 'der: ' + resExecDer );

    if (resExec) {
      // console.log( 'md5: ' + resExec );
      md5 = resExec.replace("(stdin)= ", "").trim();

      csrs = await axios.get("http://localhost:3001/api/csr");
      //console.log('Csrs: ');
      //console.log( csrs );
      csrs.data.forEach((csr) => {
        //console.log( `${md5} : ${csr.md5}`);
        if (md5 === csr.md5) {
          console.log(csr.name);
        }
        //console.log( csr.md5 )
      });

      saveFile(md5, "", "", req.file.path);

      res.status(200).send({
        message: `Uploaded the file successfully: ${req.file.path} : ${md5} `,
        filepath: req.file.path,
        md5: md5,
      });
    } else {
      console.log("Uploaded file not a valid certificate");
      res.status(500).send({
        message: `Uploaded file not a valid certificate: ${req.file.path}`,
      });
    }
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getRoot = (req, res) => {
  res.status(200).send("CertTool");
};

const getCerts = (req, res) => {
  const directoryPath = "/work/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const getCSRs = (req, res) => {
  const directoryPath = "/work/";

  let fileInfos = [];
  var csr_files = findFiles(directoryPath, /\.csr/, function (o) {
    //console.log('look what we have found : ' + o)
    try {
      var resExec = execSync(
        `openssl req -noout -modulus -in "${o}"`.toString()
      );
      var resExec = execSync(
        `openssl req -noout -modulus -in "${o}" | openssl md5`.toString()
      );

      fileInfos.push({
        name: o,
        md5: resExec.toString().replace("(stdin)= ", "").trim(),
        path: path.dirname(o),
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  // console.log(`fileInfos timeout: ${fileInfos}`);
  res.status(200).send(fileInfos);
};

const getListFiles = (req, res) => {
  const directoryPath = "/work/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = "/work/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const getFile = (req, res) => {
  let data = "";
  certdir = fs.readdir(`/${req.params.dirname}`, (err, data) => {
    if (err) {
      res.status(404).send("Dir not found");
    } else {
      fs.readFile(
        `/${req.params.dirname}/${req.params.filename}`,
        (err, data) => {
          if (err) {
            res.status(404).send("File not found");
          } else {
            console.log(data.toString());
            res.send({ data: `${data}` });
          }
        }
      );
    }
  });
};

const getCertificate = (req, res) => {
  try {
    console.log("params1 is :" + req.query.filename);
    const cmd_pem = `openssl x509 -in "${req.query.filename}" -text -noout`;
    const cmd_der = `openssl x509 -inform der -in "${req.query.filename}" -text -noout`;

    try {
      resExec = execSync(cmd_pem).toString();
    } catch (error) {
      resExec = execSync(cmd_der).toString();
    }

    rows = resExec.toString().split("\n");
    rowssubject = filterItems(rows, "Subject: ")[0].split("Subject: ");

    certsubject = splitcertsubject(rowssubject[1]);
    console.log(certsubject);

    res.send(JSON.stringify(certsubject));
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Certificate could not be read");
  }
};

const newCSR = (req, res) => {
  console.log(req.body);
  //res.send('Toegevoegd') ;
  console.log(`Body.cn is: ${req.body.cn}`);

  const folderName = `/work/${req.body.cn}`;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      res.send("toegevoegd");
    } else {
      res.send("bestaat al");
    }
  } catch (err) {
    console.error(err);
    res.status(404).send("Dir not created");
  }
  //fs.appendFileSync()
  exec("openssl version", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  try {
    fd = fs.openSync(`${folderName}/${req.body.cn}.inf`, "w");
    fs.appendFileSync(fd, "[ req ]\n", "utf8");
    fs.appendFileSync(fd, "prompt = no\n", "utf8");
    fs.appendFileSync(fd, "default_bits = 4096\n", "utf8");
    fs.appendFileSync(fd, `distinguished_name = ${req.body.cn}\n`, "utf8");
    fs.appendFileSync(fd, "req_extensions = req_ext\n", "utf8");
    fs.appendFileSync(fd, "\n", "utf8");
    fs.appendFileSync(fd, `[ ${req.body.cn} ]\n`, "utf8");
    fs.appendFileSync(fd, `CN = ${req.body.cn}\n`, "utf8");
    req.body.c ? fs.appendFileSync(fd, `C = ${req.body.c}\n`, "utf8") : "";
    req.body.st ? fs.appendFileSync(fd, `ST = ${req.body.st}\n`, "utf8") : "";
    req.body.l ? fs.appendFileSync(fd, `L = ${req.body.l}\n`, "utf8") : "";
    req.body.o ? fs.appendFileSync(fd, `O = ${req.body.o}\n`, "utf8") : "";
    req.body.ou ? fs.appendFileSync(fd, `OU = ${req.body.ou}\n`, "utf8") : "";
    fs.appendFileSync(fd, "\n", "utf8");
    fs.appendFileSync(fd, "[ req_ext ]\n", "utf8");
    fs.appendFileSync(fd, "subjectAltName = @alt_names\n", "utf8");
    fs.appendFileSync(fd, "\n", "utf8");
    fs.appendFileSync(fd, "[alt_names]\n", "utf8");
    fs.appendFileSync(fd, `DNS.1 = ${req.body.cn}\n`, "utf8");
  } catch (err) {
    // Handle the error
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }

  exec(
    `openssl req -nodes -newkey rsa:2048 -keyout ${folderName}/${req.body.cn}.key -out ${folderName}/${req.body.cn}.csr  -config ${folderName}/${req.body.cn}.inf `,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      ("openssl x509 -inform DER -in certtool.homelabdc22.local.crt -out certtool.homelabdc22.local.pem");
      ("openssl pkcs12 -export -out local.pfx -inkey local.key -in local.pem");
      ("Enter Export Password:");
      ("Verifying - Enter Export Password:");
      console.log(`stdout: ${stdout}`);
    }
  );
  var resExec = execSync(
    `openssl req -noout -modulus -in "${folderName}/${req.body.cn}.csr" | openssl md5`.toString()
  );
  md5 = resExec.toString().replace("(stdin)= ", "").trim();
  saveFile(
    md5,
    `${folderName}/${req.body.cn}.csr`,
    `${folderName}/${req.body.cn}.key`
  );
};

module.exports = {
  upload,
  getListFiles,
  download,
  getRoot,
  getCertificate,
  getCerts,
  getFile,
  getCSRs,
  newCSR,
};
