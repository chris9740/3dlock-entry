const inquirer = require("inquirer");

const main = async () => {
    const answer = await inquirer.prompt([{
        type: "input",
        name: "word",
        message: "Enter the secret word",
        validate: function (input) {
            if (input.length < 1 && input.length > 18) {
                return "Secret word must be between 1 and 18 in length!";
            }

            return true;
        }
    }, {
        type: "input",
        name: "max_tries",
        message: "How many tries should the player get? 0 for infinite",
        validate: function (input) {
            if (isNaN(input)) return "The amount of tries must be a number";

            let max_tries = +input;

            if (max_tries < 0) {
                return "The amount of tries must be a positive number";
            }

            return true;
        }
    }]);

    const word = answer.word.toLowerCase();
    const max_tries = +answer.max_tries;

    console.clear();

    const correct = [];
    const incorrect = [];

    let tries = 0;

    let won = false;

    while (true) {
        console.log("Game has started! Each player, take a turn in guessing a letter of the word!");

        if (max_tries === 0) {
            console.log("The length of the word is " + word.length + ". You have infinite tries");
        } else {
            console.log("The length of the word is " + word.length + ". You have " + (max_tries - tries) + " tries left");
        }

        const displayed_word = [];

        for (let i = 0; i < word.length; i++) {
            const letter = word[i];

            if (correct.indexOf(letter) !== -1) {
                displayed_word.push(letter);
            } else {
                displayed_word.push("_");
            }
        }

        console.log();
        console.log("Word: " + displayed_word.join(""));
        console.log("Incorrect guesses: " + (incorrect.length ? incorrect.join(", ") : "(none)"));
        console.log();

        if (won || (tries >= max_tries && max_tries !== 0)) {
            break;
        }

        const prompt = await inquirer.prompt({
            type: "input",
            name: "letter",
            message: "Guess a letter",
            validate: function (input) {
                input = input.toLowerCase();

                if (input.length !== 1) {
                    return "The letter can only be 1 character in length";
                }

                const guesses = correct.concat(incorrect);

                if (guesses.indexOf(input) !== -1) {
                    return "You've already guessed that letter!";
                }

                return true;
            }
        });

        const letter = prompt.letter.toLowerCase();

        if (word.indexOf(letter) !== -1) {
            correct.push(letter);
        } else {
            tries++;
            incorrect.push(letter);
        }

        const word_array = word.split("");

        const uniqueChars = word_array.filter((x, i) => word_array.indexOf(x) === i);

        console.clear();

        if (correct.length === uniqueChars.length) {
            won = true;
            continue;
        }
    }

    if (won === false) {
        console.log("You couldn't guess the word... sorry. The word was: " + word);
    } else {
        console.log("Congrats, you won! The word was: " + word);
    }
}

main();