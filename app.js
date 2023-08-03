import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import axios from "axios";

// extension: profit tracker 
let userName;
let userCmd;
let wallet = 0; // will be in the currency that you start with

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

  const welcomeType = `Welcome. This is a CLI financial profit manager. \n`
  await typewriterEffect(welcomeType);
  const purposeType = `You can exchange foreign currencies, get real-time stock prices of indexes, and determine whether you will be at a profit or not. \n`
  await typewriterEffect(purposeType);
  const commands = `If you want to exchange currency, type 'exchange'. \nIf you want to see the current stock prices, type 'stock'.\nIf you want to see profits, type 'profit'.\nIf you want to exit, select 'quit'\n`
  await typewriterEffect(commands);
  const transition = `To start, please provide us some information about you, so that we can get started\n`;
  await typewriterEffect(transition);

};

async function userProfile() {
  let name_answer = await inquirer.prompt({
    name: 'user_name',
    type: 'input',
    message: 'Hello, please enter your name.\n'
  });
  userName = name_answer.user_name;
};

async function commandCenter() {
  // TO DO: CONVERT USER CMD TO LOWERCASE
  let valid = false;
  while (valid == false) {
    let function_answer = await inquirer.prompt({
      name: 'functional_name',
      type: 'input',
      message: `Enter any of the following commands: 'exchange', 'stock', 'profits', 'quit'\n`
    });
    userCmd = function_answer.functional_name;
    if (userCmd == 'exchange' || userCmd == 'stock' || userCmd == 'profits' || userCmd == 'quit') {
      valid = true;
      if (userCmd == 'exchange') {
        exchange();
      }
    } else {
      typewriterEffect(`This is not a valid input. Please try again. \n`);
    }
  }
}

async function exchange() {
  // TO DO: CONVERT ALL INPUTS INTO UPPER CASE
  let starting;
  let ending;
  let value;

  let valid = false;
  let start_curr = await inquirer.prompt({
    name: 'starting',
    type: 'input',
    message: `What currency are you starting with?\n`
  });
  starting = start_curr.starting;

  let end_curr = await inquirer.prompt({
    name: 'ending',
    type: 'input',
    message: `What currency do you want the result to be in?\n`
  });
  ending = end_curr.ending;

  let currency_amount = await inquirer.prompt({
    name: 'amount',
    type: 'input',
    message: `What is the value you are exchanging?\n`
  });
  value = currency_amount.amount;
  await convertForeignCurr(starting, ending, value);
}

async function convertForeignCurr(start, end, value) {
  try {
    const response = await axios.get(`https://api.frankfurter.app/latest?amount=${value}&from=${start}&to=${end}`);
    await typewriterEffect(`${value} ${start} will give you ${response.data.rates[end]} ${end} \n`);
    commandCenter();
  } catch (error) {
    await typewriterEffect(`There is an error with one of your inputs. Please try again.\n`);
    exchange();
  }

}
async function main() {
  //invoke our game functions here
  await startGame();
  await userProfile();
  await commandCenter();
}

main()