import React, { useReducer, useState } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InputAttribute from "./InputAttribute";

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

const getData = async (url) => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const axios = require("axios");

const GetCertificate = () => {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [certFilename, setCertFilename] = useState();

  const handleChange = (event) => {
    console.log("Handlechange hit: " + event.target.name);
    console.log("Handelchange hit: " + event.target.value);
    setFormData({ name: event.target.name, value: event.target.value });
  };

  async function getCert() {
    console.log("cn : " + formData.cn);
    console.log("cerfilename : " + certFilename);
    let res = await getData("http://localhost:3001/api/cert");
    //cn = res.find( ({name}) => name === 'CN');
    //console.log( cn);
    setFormData({ name: "c", value: res.C });
    setFormData({ name: "st", value: res.ST });
    setFormData({ name: "l", value: res.L });
    setFormData({ name: "o", value: res.O });
    setFormData({ name: "cn", value: res.CN });
    setFormData({ name: "ou", value: res.OU });
    // console.log(res);
  }

  return (
    <div>
      <InputAttribute
        label="Common Name"
        name="cn"
        value={formData.cn}
        onChange={handleChange}
      />
      <InputAttribute label="SAN" name="san" onChange={handleChange} />
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
      <InputAttribute label="keysize" name="keysize" onChange={handleChange} />
      <InputAttribute label="hash" name="hash" onChange={handleChange} />
      <button onClick={getCert}>GetCert</button>
    </div>
  );
};

GetCertificate.defaultProps = {
  //certFilename: '/work/certnewb64.cer'
};

export default GetCertificate;
