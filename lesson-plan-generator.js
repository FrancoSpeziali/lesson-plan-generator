const { addDays, differenceInDays, format } = require("date-fns");
const fs = require("fs").promises;

const config = {
  writePath: "./lesson-plans",
  templatePath: "./lesson-plan-template.md",
  ignoreWeekDays: [0, 5, 6], // 0 is Sunday
};

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

void (async function () {
  const userDates = {
    start: new Date(parseEuropeanDate(process.argv[2], "/")),
    end: new Date(parseEuropeanDate(process.argv[3], "/")),
  };

  const daysToRun = differenceInDays(userDates.end, userDates.start);

  console.log(
    `Processing between dates ${userDates.start.toDateString()} and ${userDates.end.toDateString()}...`
  );

  await createFolder(config.writePath);

  try {
    const template = await readTemplate();

    for (let day = 0; day <= daysToRun; day += 1) {
      const currentDate = addDays(userDates.start, day);
      const weekday = currentDate.getDay();

      if (config.ignoreWeekDays.includes(weekday)) {
        continue;
      }

      const filename = `${format(currentDate, "d MMMM")}.md`;
      const month = format(currentDate, "MMMM");
      const writePath = await createFolder(`${config.writePath}/${month}`);
      const formattedDate = format(currentDate, "EEEE do MMMM");
      const updatedTemplate = template.replace("{DATE}", formattedDate);

      await fs.writeFile(`${writePath}/${filename}`, updatedTemplate, {
        encoding: "utf8",
      });

      console.log(`Written ${writePath}/${filename}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
})();
