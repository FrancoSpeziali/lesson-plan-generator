const { addDays, differenceInDays, format, getMonth } = require("date-fns");
const fs = require("fs").promises;
const config = require("./config");

function parseEuropeanDate(string, delimiter = ".") {
  const [day, month, year] = string.split(delimiter);

  return new Date(`${month}/${day}/${year}`);
}

async function readTemplate() {
  return await fs.readFile(config.templatePath, {
    encoding: "utf8",
  });
}

async function createFolder(folder) {
  try {
    await fs.mkdir(folder);
  } catch (_) {}

  return folder;
}

function processTemplate(string, props) {
  let template = string;

  const data = {
    date: null,
    ...props,
  };

  if (data.date) {
    template = template.replace("{{DATE}}", data.date);
  }

  return template;
}

void (async function () {
  const userDates = {
    start: new Date(parseEuropeanDate(process.argv[2], "/")),
    end: new Date(parseEuropeanDate(process.argv[3], "/")),
  };

  const daysToRun = differenceInDays(userDates.end, userDates.start);

  console.log(
    `Processing between dates ${userDates.start.toDateString()} and ${userDates.end.toDateString()}...`
  );

  try {
    await createFolder(config.writePath);

    const template = await readTemplate();

    for (let day = 0; day <= daysToRun; day += 1) {
      const currentDate = addDays(userDates.start, day);
      const weekday = currentDate.getDay();

      if (config.ignoreWeekDays.includes(weekday)) {
        continue;
      }

      const month = format(currentDate, "MM MMMM");
      const year = format(currentDate, "uuuu");
      const filename = `${format(currentDate, "dd MMMM")}.md`;
      const yearPath = await createFolder(`${config.writePath}/${year}`);
      const fullPath = await createFolder(`${yearPath}/${month}`);
      const formattedDate = format(currentDate, "EEEE do MMMM");
      const updatedTemplate = processTemplate(template, {
        date: formattedDate,
      });

      await fs.writeFile(`${fullPath}/${filename}`, updatedTemplate, {
        encoding: "utf8",
      });

      console.log(`Written ${fullPath}/${filename}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
})();
