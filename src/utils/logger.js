const chalk = require("chalk");

module.exports = {
  info: (context, message) => {
    console.log(`${chalk.bgGreen(" INFO ")} ${chalk.green(`[${context}]`)} ${message}`);
  },
  warn: (context, message) => {
    console.warn(`${chalk.bgYellow(" WARN ")} ${chalk.yellow(`[${context}]`)} ${message}`);
  },
  error: (context, error, userId = null, reqBody = null) => {
    console.error(`${chalk.bgRed(" ERROR ")} ${chalk.red(`[${context}]`)} \n${error.message}`);
    if(userId) console.error(chalk.red(` - UserId: ${userId}`));
    if(reqBody) console.error(chalk.red(` - Request Body:\n${JSON.stringify(reqBody, null, 2)}`));
    console.error(chalk.gray(error.stack));
  },
  success: (context, message) => {
    console.log(`${chalk.bgBlue(" DONE ")} ${chalk.blue(`[${context}]`)} \n${chalk.blue(message)}`);
  }
};