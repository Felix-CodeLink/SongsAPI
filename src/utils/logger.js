const chalk = require("chalk");

module.exports = {
  info: (context, message) => {
    console.log(`${chalk.bgGreen(" INFO ")} ${chalk.green(`[${context}]`)} ${message}`);
  },
  warn: (context, message) => {
    console.warn(`${chalk.bgYellow(" WARN ")} ${chalk.yellow(`[${context}]`)} ${message}`);
  },
  error: (context, error) => {
    console.error(`${chalk.bgRed(" ERROR ")} ${chalk.red(`[${context}]`)} ${error.message}`);
    console.error(chalk.gray(error.stack));
  },
  success: (context, message) => {
    console.log(`${chalk.bgBlue(" DONE ")} ${chalk.blue(`[${context}]`)} ${message}`);
  }
};