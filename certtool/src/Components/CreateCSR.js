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

const axios = require("axios");

const CreateCSR = () => {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [submitting, setSubmitting] = useState(false);

  const handleCSRSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  async function postNewCSR() {
    let payload = {
      cn: formData.cn,
      san: formData.san,
      o: formData.o,
      ou: formData.ou,
      l: formData.l,
      st: formData.st,
      c: formData.c,
    };

    let res = await axios.post("http://localhost:3001/api/certs", payload);

    let data = res.data;
    console.log(data);
  }

  return (
    <div>
      <h2>Create CSR</h2>
      {submitting && (
        <div>
          You are submitting the following:
          <ul>
            {Object.entries(formData).map(([name, value]) => (
              <li key={name}>
                <strong>{name}</strong>:{value.toString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleCSRSubmit}>
        <fieldset className="container">
          <InputAttribute
            label="Common Name"
            name="cn"
            onChange={handleChange}
          />
          <InputAttribute label="SAN" name="san" onChange={handleChange} />
          <InputAttribute
            label="Organization"
            name="o"
            onChange={handleChange}
          />
          <InputAttribute
            label="Department"
            name="ou"
            onChange={handleChange}
          />
          <InputAttribute label="City" name="l" onChange={handleChange} />
          <InputAttribute label="State" name="st" onChange={handleChange} />
          <InputAttribute label="Country" name="c" onChange={handleChange} />
          <label>Key size</label>
          <select name="keysize" onChange={handleChange}>
            <option value="2048">2048</option>
            <option value="4096">4096</option>
            <option value="8192">8192</option>
          </select>
          <label>Hash algorithm</label>
          <select name="hash" onChange={handleChange}>
            <option value="">--Please choose an option--</option>
            <option value="sha256">sha256</option>
            <option value="sha384">sha384</option>
            <option value="sha512">sha512</option>
          </select>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      <button onClick={postNewCSR}>CreateCSR</button>
    </div>
  );
};

export default CreateCSR;
