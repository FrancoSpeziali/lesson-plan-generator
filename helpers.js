const fs = require("fs").promises;

exports.createFolder = async (folder) => {
  try {
    await fs.mkdir(folder);
  } catch (_) {}

  return folder;
};

exports.readFile = async (path) => {
  return await fs.readFile(path, {
    encoding: "utf8",
  });
};

exports.writeFile = async (path, data) => {
  return await fs.writeFile(path, data, {
    encoding: "utf8",
  });
};

exports.parseEuropeanDate = (string, delimiter = ".") => {
  const [day, month, year] = string.split(delimiter);

  return new Date(`${month}/${day}/${year}`);
};

exports.processTemplate = (string, props) => {
  let template = string;

  const data = {
    date: null,
    ...props,
  };

  if (data.date) {
    template = template.replace("{{DATE}}", data.date);
  }

  return template;
};
