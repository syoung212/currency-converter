import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";

// extension: profit tracker 
let userName;
//helper to resolve animations
//ms = 2000 miliseconds, after 2 seconds, the promise will resolve
const resolveAnimations = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function startGame() {
  //welcome msg
  const welcomeMsg = chalkAnimation.glitch(`Enter your currency amount `);
  //call helper


  await resolveAnimations();
  //stop the animation
  welcomeMsg.stop();

  //about the game
  // console.log(`
  // ${chalk.bgGreenBright('we shall begin')}
  // this adventure lives in your terminal
  // if you choose any of the wrong choices, I will ${chalk.bgRed('terminate')}
  // if you make it to the end, you will be rewarded
  // `);
};

async function main() {
  //invoke our game functions here
  await startGame();
  //await playerInfo();
}

main()