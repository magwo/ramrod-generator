import { combinedLongWords } from "./combinedwords.js";
import { nouns, adverbs, adjectives, verbs, mixedWords } from "./words.js";

function areAllLettersDistinct(str) {
    for (var j = 0; j < str.length; j++) {
        const char = str[j];
        let count = 0;
        for (var i = 0; i < str.length; i++) {
            if (char === str[i]) {
                count++;
            }
        }
        if (count != 1) {
            return false;
        }
    }
    return true;
}

function isValidRamrodWord(str, requiredString) {
    if (requiredString && !str.includes(requiredString)) {
        return false;
    }
    return areAllLettersDistinct(str);
}

function getRandomArrayIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}

function getRandomArrayItem(arr) {
    return arr[getRandomArrayIndex(arr)];
}

function getRandomWordOfLength(arr, wordLength) {
    const startIndex = getRandomArrayIndex(arr);
    for (let i=startIndex; i<startIndex + arr.length; i++) {
        const actualIndex = i % arr.length;
        if (arr[actualIndex].length === wordLength) {
            return arr[actualIndex];
        }
    }
    // Fallback if not found
    return arr[startIndex];
}

function getNewRamrod(allWords, longCombinationWords, desiredLength, requiredString) {
    let attemptCount = 0;

    while (attemptCount < 10E9) {
        attemptCount++;
        let str = "";
        while(str.length < desiredLength) {
            if (longCombinationWords && desiredLength > 17 && Math.random() > 0.2 && str.length < desiredLength / 2) {
                str += getRandomArrayItem(longCombinationWords);
            } else {
                str += getRandomArrayItem(allWords);
            }

            if (!areAllLettersDistinct(str)) {
                break;
            } else if (str.length === desiredLength && isValidRamrodWord(str, requiredString)) {
                console.log(`Generated ${str} using ${attemptCount} attempts`);
                return str;
            }
        }
    }
    return "<FAILED TO FIND>";
}

function getLongCombinationWords(words, desiredLength, count) {
    return [...Array(count).keys()]
        .map(() => getNewRamrod(words, null, desiredLength, null));
}

export async function runRamrodGenerator() {
    // const allFilteredWords = [...nouns, ...adverbs, ...adjectives, ...verbs].filter(areAllLettersDistinct);
    let allFilteredWords = mixedWords.filter(areAllLettersDistinct);
    console.log("allFilteredWords", allFilteredWords);

    // let attemptCount = 0;
    // function getRamrodCombination(desiredLength, requiredString) {
    //     let resultingWord;
    //     if (requiredString) {
    //         nouns.push(requiredString);
    //         adjectives.push(requiredString);
    //     }

    //     while (true) {
    //         attemptCount++;

    //         const firstWordList = Math.random() > 0.3 ? adjectives : nouns;
    //         const secondWordList = Math.random() > 0.3 ? nouns : adjectives;

    //         let firstWord = firstWordList[getRandomArrayIndex(firstWordList)];
    //         if (
    //             firstWord.length === desiredLength &&
    //             isValidRamrodWord(firstWord, requiredString)
    //         ) {
    //             resultingWord = firstWord;
    //             break;
    //         }

    //         resultingWord =
    //             firstWord + secondWordList[getRandomArrayIndex(secondWordList)];
    //         if (
    //             resultingWord.length === desiredLength &&
    //             isValidRamrodWord(resultingWord, requiredString)
    //         ) {
    //             break;
    //         }
    //     }
    //     return resultingWord;
    // }

    let desiredLength = 10;
    let requiredString = null;
    let hashString = document.location.hash.replace("#", "");
    if (hashString.length > 0) {
        const matches = hashString.match(/^([a-z]*)([0-9]*)$/);
        if (matches[1] && matches[1].length > 0) {
            requiredString = matches[1];
            if (areAllLettersDistinct(requiredString)) {
                allFilteredWords = [...allFilteredWords, ...[...Array(100).keys()].map(() => requiredString)];
            } else {
                document.getElementById("list").innerHTML += `Invalid input - required word is not a ramrod substring`;
                return;
            }
        }
        if (matches[2] && matches[2].length > 0) {
            desiredLength = parseInt(matches[2]);
        }
        console.log("matches", matches);
    }

    // Create long non-repeating combination words to speed up process of finding _veeery_ long combinations
    // const longCombinationWords = desiredLength <= 10 ? null : [
    //     // ...getLongCombinationWords(allFilteredWords, 11, 200),
    //     // ...getLongCombinationWords(allFilteredWords, 12, 200),
    //     ...getLongCombinationWords(allFilteredWords, 13, 100),
    //     ...getLongCombinationWords(allFilteredWords, 14, 100),
    //     ...getLongCombinationWords(allFilteredWords, 15, 100),
    //     ...getLongCombinationWords(allFilteredWords, 16, 100),
    //     ...getLongCombinationWords(allFilteredWords, 17, 100),
    //     ...getLongCombinationWords(allFilteredWords, 18, 100),
    //     ...getLongCombinationWords(allFilteredWords, 19, 100),
    // ];

    const longCombinationWords = combinedLongWords

    console.log("Long combinations", longCombinationWords);

    const wordCount = 60;

    const getNewRamrodAsync = async () => {
        await new Promise(resolve => setTimeout(resolve, 1));
        const ramrod = getNewRamrod(allFilteredWords, longCombinationWords, desiredLength, requiredString);
        document.getElementById("list").innerHTML += `<div>${ramrod}</div>`;
    };

    for (let i=0; i<wordCount; i++) {
        // Use async to produce and present words as they are computed
        await getNewRamrodAsync();
    }
    // document.getElementById("list").innerHTML = [...Array(wordCount).keys()]
    //     .map(() => getNewRamrod(allFilteredWords, longCombinationWords, desiredLength, requiredString))
    //     .join(" ");
}
