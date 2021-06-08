const onSubmit = (e, state, callback) => {
  e.preventDefault();

  const {
    description,
    name,
    grade,
    subject,
    files,
    googleFiles,
    unit,
    fullUnit,
    type,
    link,
    free,
    googleFileDownloads
  } = state;
  

  let formData = new FormData();

  formData.append("description", description);
  for (const key of Object.keys(state.files)) {
    formData.append("files", state.files[key]);
  }
  formData.append("files", files);
  formData.append("googleFiles", JSON.stringify(googleFiles));
   formData.append("googleFileDownloads", JSON.stringify(googleFileDownloads));
  formData.append("free", free.toString());
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
  console.log(values);
  values.splice(1, 1);
  console.log(values);

  if (values.includes("") === true) {
    return alert(`                Please complete all fields. 

                  (File upload is optional)`);
  } else {
    return callback(null, formData);
  }
};

export default onSubmit;
