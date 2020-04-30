const argsParser = require("./index");

const args = [
  "--flag1",
  "--flag2=",
  "-S",
  "--save",
  "--save-dev",
  "noFlag1",
  "noFlag2=5",
  "--flag3=true",
  "-flag4-postfix=12",
  "--flag5=-123",
  "-flag6=0.123",
  "--flag7=123asd",
  "--flag8=asd123",
  "-flag9=null",
  "-flag10=undefined",
  "--flag11=[1, 2, 3, 4]",
  "--flag12=[true, 'asd', false, ['html', 'css', 'js']]",
  "--flag13={ name: 'alex', age: 22, isMarried: false }",
  "--flag14={ person: { name: 'alex', age: 22, isMarried: false } }",
  "--flag15=5",
  "--FLAG=5",
  "--FLAG=10"
];

const result = argsParser(args);

console.log("TEST:", result);
