const InputAttribute = ({ label, name, value, onChange }) => {
  // const [attribute, setAttribute] = useState();

  return (
    <div>
      <label>{label}</label>
      <input name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default InputAttribute;
