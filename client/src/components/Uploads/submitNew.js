const onSubmit = (e, state, callback) => {
  e.preventDefault();

  const {
    description,
    name,
    grade,
    subject,
    files,
    unit,
    fullUnit,
    type,
    link,
  } = state;

  let formData = new FormData();

  formData.append("description", description);
  for (const key of Object.keys(state.files)) {
    formData.append("files", state.files[key]);
  }
  formData.append("files", files);
  formData.append("name", name);
  formData.append("grade", grade);
  formData.append("subject", subject);
  formData.append("unit", unit);
  formData.append("fullUnit", fullUnit);
  formData.append("type", type);
  formData.append("link", link);
  let values = [];
  for (var value of formData.values()) {
    values.push(value);
  }
  values.splice(1, 1);

  if (values.includes("") === true) {
    return alert(`                Please complete all fields. 

                  (File upload is optional)`);
  } else {
    callback(null, formData);
  }
};

export default onSubmit;
