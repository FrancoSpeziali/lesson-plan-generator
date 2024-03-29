const { addDays, differenceInDays, format, getISOWeek } = require("date-fns");
const config = require("./config");
const {
  createFolder,
  readFile,
  writeFile,
  parseEuropeanDate,
  processTemplate,
} = require("./helpers");

void (async function (userDates) {
  const daysToRun = differenceInDays(userDates.end, userDates.start);

  console.log(
    `Processing between dates ${userDates.start.toDateString()} and ${userDates.end.toDateString()}...`
  );

  try {
    await createFolder(config.writePath);

    const template = await readFile(config.templatePath);

    for (let day = 0; day <= daysToRun; day += 1) {
      const currentDate = addDays(userDates.start, day);
      const weekday = currentDate.getDay();
      const moduleWeek = format(currentDate, "II");

      if (config.ignoreWeekDays.includes(weekday)) {
        continue;
      }

      const year = format(currentDate, "uuuu");
      const filename = `${format(currentDate, "dd MMMM")}.md`;

      await createFolder(`${config.writePath}/${year}`);

      const fullPath = await createFolder(
        `${config.writePath}/${year}/Week ${moduleWeek}`
      );
      const formattedDate = format(currentDate, "EEEE do MMMM");
      const updatedTemplate = processTemplate(template, {
        date: formattedDate,
      });

      await writeFile(`${fullPath}/${filename}`, updatedTemplate);

      console.log(`Written ${fullPath}/${filename}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
})({
  start: new Date(parseEuropeanDate(process.argv[2], "/")),
  end: new Date(parseEuropeanDate(process.argv[3], "/")),
});
