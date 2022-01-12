import React, { useReducer, useState, useContext, useEffect } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InputAttribute from "./InputAttribute";
import { ImportContext } from "../services/importContext";

const axios = require("axios");

const formReducer = (currentstate, event) => {
  console.log(event.name);
  return {
    ...currentstate,
    [event.name]: event.value,
  };
};

const getData = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const GetCertificate = () => {
  const [formData, setFormData] = useReducer(formReducer, {
    cn: "",
    o: "",
    ou: "",
    l: "",
    st: "",
    c: "",
  });
  //const [currentFile, setCurrentFile] = useState();

  const { state, setState } = useContext(ImportContext);

  const handleChange = (event) => {
    console.log("Handlechange hit: " + event.target.name);
    console.log("Handelchange hit: " + event.target.value);
    setFormData({ name: event.target.name, value: event.target.value });
  };

  async function getCert() {
    console.log("cn : " + formData.cn);
    console.log("cerfilename : " + state);
    let res = await getData("http://localhost:3001/api/cert", {
      filename: state,
    });
    res.CN && setFormData({ name: "cn", value: res.CN });
    res.O && setFormData({ name: "o", value: res.O });
    res.OU && setFormData({ name: "ou", value: res.OU });
    res.L && setFormData({ name: "l", value: res.L });
    res.ST && setFormData({ name: "st", value: res.ST });
    res.C && setFormData({ name: "c", value: res.C });

    // console.log(res);
  }

  useEffect(() => {
    console.log(`useEffect getcert: ${state}`);
  }, []);

  return (
    <div className="container">
      <InputAttribute
        label="Common Name"
        name="cn"
        value={formData.cn}
        onChange={handleChange}
      />
      <InputAttribute
        label="SAN"
        name="san"
        value="san"
        onChange={handleChange}
      />
      <InputAttribute
        label="Organization"
        name="o"
        value={formData.o}
        onChange={handleChange}
      />
      <InputAttribute
        label="Department"
        name="ou"
        value={formData.ou}
        onChange={handleChange}
      />
      <InputAttribute
        label="City"
        name="l"
        value={formData.l}
        onChange={handleChange}
      />
      <InputAttribute
        label="State"
        name="st"
        value={formData.st}
        onChange={handleChange}
      />
      <InputAttribute
        label="Country"
        name="c"
        value={formData.c}
        onChange={handleChange}
      />
      <InputAttribute
        label="keysize"
        name="keysize"
        value="keysize"
        onChange={handleChange}
      />
      <InputAttribute
        label="hash"
        name="hash"
        value="hash"
        onChange={handleChange}
      />
      <button onClick={getCert}>GetCert</button>
      <div>Uploadedfile is {JSON.stringify(state, null, 2)}</div>
    </div>
  );
};

GetCertificate.defaultProps = {
  //certFilename: '/work/certnewb64.cer'
};

export default GetCertificate;
