# Lesson Plan Generator

Generates lesson plans in `.md` format, for each day

## Configuring

- Modify `lesson-plan-template.md` as necessary

- You can set the script to ignore certain weekdays with the `config.js` file

## Usage

1. `npm i`
2. `node lesson-plan-generator {Date 1} {Date 2}`

Use date in European format and separate with `/`

> Example:
> 
> `node lesson-plan-generator 20/10/2021 6/1/2022`
