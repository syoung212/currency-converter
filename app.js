const chalk = require('chalk');
const inquirer = require("inquirer");
const axios = require("axios");
const yahooStockAPI = require('yahoo-stock-api').default;
const yahooFinance = require('yahoo-finance2').default;

const yahoo = new yahooStockAPI();
// extension: profit tracker 
let userName;
let userCmd;
let defaultCurr;

let portfolio = []; // will be in the currency that you start with

//helper to resolve animations
//ms = 2000 miliseconds, after 2 seconds, the promise will resolve
const resolveAnimations = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function typewriterEffect(text, delay = 20) {
  for (const char of text) {
    await new Promise(resolve => setTimeout(resolve, delay));
    process.stdout.write(char);
  }
}

async function startGame() {
  //welcome msg
  // const welcomeMsg = chalkAnimation.glitch(`Enter your currency amount `);
  // //call helper

  // await resolveAnimations();
  // //stop the animation
  // welcomeMsg.stop();
  const welcomeType = `Welcome. This is a CLI financial profit manager. \n\n`
  await typewriterEffect(chalk.bold(welcomeType));
  const purposeType = `You can exchange foreign currencies, get real-time stock prices of indexes, determine whether you will be at a profit or not, and we can recommend you some stocks.\n\n`
  await typewriterEffect(chalk.bold(purposeType));
  const commands = `If you want to exchange currency, type 'exchange'. \nIf you want to see the current stock prices, type 'stock'.\nIf you want to see profits, type 'profits'.\nIf you want us to recommend stocks, select 'quit'\n\n`
  await typewriterEffect(commands);
  const transition = `To start, please provide us some information about you, so that we can get started\n\n`;
  await typewriterEffect(transition);

};

async function userProfile() {
  let name_answer = await inquirer.prompt({
    name: 'user_name',
    type: 'input',
    message: 'Hello, please enter your name.\n'
  });
  userName = name_answer.user_name;

  let curr_answer = await inquirer.prompt({
    name: 'currency',
    type: 'input',
    message: `Hi ${userName}. Please enter your default currency.\n`
  });
  defaultCurr = curr_answer.currency.toUpperCase();
};

async function commandCenter() {
  // TO DO: CONVERT USER CMD TO LOWERCASE
  let valid = false;
  while (valid == false) {
    let function_answer = await inquirer.prompt({
      name: 'functional_name',
      type: 'input',
      message: `Enter any of the following commands: exchange, stock, profits, quit\n`
    });
    userCmd = function_answer.functional_name.toLowerCase();
    if (userCmd == 'exchange' || userCmd == 'stock' || userCmd == 'profits' || userCmd == 'quit') {
      valid = true;
      if (userCmd == 'exchange') {
        await exchange();
      }
      if (userCmd == 'stock') {
        await stock();
      }
      if (userCmd == 'profits') {
        await profit();
      }
    } else {
      await typewriterEffect(`This is not a valid input. Please try again. \n`);
    }
  }
}

async function exchange() {
  // TO DO: CONVERT ALL INPUTS INTO UPPER CASE
  let starting;
  let ending;
  let value;

  let start_curr = await inquirer.prompt({
    name: 'starting',
    type: 'input',
    message: `What currency are you starting with?\n`
  });
  starting = start_curr.starting.toUpperCase();

  let end_curr = await inquirer.prompt({
    name: 'ending',
    type: 'input',
    message: `What currency do you want the result to be in?\n`
  });
  ending = end_curr.ending.toUpperCase();

  let currency_amount = await inquirer.prompt({
    name: 'amount',
    type: 'input',
    message: `What is the value you are exchanging?\n`
  });
  value = currency_amount.amount;
  newValue = await convertForeignCurr(starting, ending, value);
  if (newValue != null) {
    await typewriterEffect(`${value} ${starting} will give you ${newValue[0]} ${newValue[1]} \n`);
    await commandCenter();
  } else {
    await exchange();
  }
}

async function convertForeignCurr(start, end, value) {
  try {
    const response = await axios.get(`https://api.frankfurter.app/latest?amount=${value}&from=${start}&to=${end}`);
    // await typewriterEffect(`${value} ${start} will give you ${response.data.rates[end]} ${end} \n`);

    // returns the final value, and the currency 
    return [response.data.rates[end], end]
  } catch (error) {
    await typewriterEffect(chalk.red(`There is an error with one of your inputs. Please try again.\n`));
    return null;
  }

}

async function stock() {
  let index;
  let index_curr = await inquirer.prompt({
    name: 'index',
    type: 'input',
    message: `Which stock do you want to trade? Please enter the stock market symbol.\n`
  });
  index = index_curr.index.toUpperCase();
  let value = await stock_exchange(index)
  if (value != null) {
    await typewriterEffect(`The value of ${value[0]}'s stock today is ${value[1]} ${value[2]}.\n`);
  }
  await commandCenter();

}

async function stock_exchange(index) {
  try {
    const api_response = await yahoo.getSymbol({ symbol: index })
    // Based on previous close
    // returns [the name of the stock exchange, previous close value, currency]
    // console.log(`Stock Exchange Response: ${[api_response.name, api_response.response.previousClose, api_response.currency]}`)
    return [api_response.name, api_response.response.previousClose, api_response.currency];
  } catch (error) {
    await typewriterEffect(chalk.red(`There may be a typo in the symbol. Please try again.\n`));
    return null;
  }
}

async function profit() {
  let index;
  let prev_stock = await inquirer.prompt({
    name: 'index',
    type: 'input',
    message: `Which stock would you like to compare the price of? Please enter the stock symbol.\n`
  });
  index = prev_stock.index.toUpperCase();

  let buy_price;
  let buy_query = await inquirer.prompt({
    name: 'bought',
    type: 'input',
    message: `What did you buy EACH of these shares for? Please note that we are using the default currency as the price you bought it for.\n`
  });
  buy_price = buy_query.bought;

  let shares;
  let shares_query = await inquirer.prompt({
    name: 'share',
    type: 'input',
    message: `How many shares would you sell of ${index}\n`
  });
  shares = shares_query.share;

  let current_output = await stock_exchange(index);
  if (current_output == null) {
    await commandCenter();
  }
  console.log(`Stock Exchange Response: ${current_output}`);

  let current_value;
  if (current_output[2] != defaultCurr) {
    let conversion = await convertForeignCurr(defaultCurr, current_output[2], current_output[1]);
    current_value = parseInt(conversion[0]);
  } else {
    current_value = parseInt(current_output[1]);
  }


  let profit = (current_value * shares) - (buy_price * shares);
  let percentChange = Math.abs((profit / (buy_price * shares)) * 100).toFixed(1);
  if (profit < 0) {
    await typewriterEffect(chalk.bold(chalk.red(`You would be at a loss, since the current value for each share is ${current_value} ${defaultCurr}. This is a ${percentChange}% loss.\n\n`)));
  } else if (profit > 0) {
    await typewriterEffect(chalk.bold(chalk.green(`You would be at a gain, since the current value for each share is ${current_value} ${defaultCurr}. This is a ${percentChange}% gain.\n\n`)));
  } else {
    await typewriterEffect(`The value is the same.\n\n`)
  }

  // let question = await inquirer.prompt({
  //   name: 'answer',
  //   type: 'input',
  //   message: `Would you like us to save this symbol to your portfolio? Please say yes or no.`
  // });

  // if (question.answer == 'yes') {
  //   portfolio.push();
  // }

  await commandCenter()

}

async function main() {
  //invoke our game functions here
  await startGame();
  await userProfile();
  await commandCenter();
}

main()