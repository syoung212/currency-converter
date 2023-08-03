import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";

// extension: profit tracker 
let userName;
let userCmd;
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
    } else {
      typewriterEffect(`This is not a valid input. Please try again. \n`);
    }
  }
}
async function main() {
  //invoke our game functions here
  await startGame();
  await userProfile();
  await commandCenter();
}

main()