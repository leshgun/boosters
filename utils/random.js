import seedrandom from "seedrandom";



/**
 * A class that provides some randomization functionality.
 */
export default class MyRandom {

    /**
     * @returns - a random value from range (0, 1)
     */
    random () {
        return Math.random();
    }

    /**
     * Returns a random float number from the given range.
     * @param {*} min - the minimal value of the new random number
     * @param {*} max - the maximum value of the new random number
     * @returns a random number from range (min, max)
     */
    random_int (min = 0, max = 1) {
        return this.random()*(max - min) + min;
    }

    /**
     * Toss a coin. You can change the chance of getting the side you want.
     * @param {*} probability - the probability of guessing the outcome of 
     *  "a coin toss" (default: 50%)
     * @returns true if guessed, false if not.
     */
    random_coin (probability = .5) {
        const p1 = this.random_int(0 + probability/2, 1 - probability/2);
        const p2 = this.random();
        if (p2 > p1 - probability/2 && p2 < p1 + probability/2)
            return true;
        return false;
    }

    /**
     * The function selects a random element from an array with the 
     * probabilities of those elements. The sum of the probabilities of 
     * dropping elements "*weights*" must be equal to 1, accurate to 
     * "*accuracy*" decimal places.
     * @param {*} weights - an array of probabilities for dropping numbers
     * @param {*} accuracy - the number of decimal places for the weight sum
     * @returns the index of the dropped number
     */
    random_distribution (weights, accuracy = 5) {

        if (weights.some(x => isNaN(x) || !(0 <= x <= 1)))
            throw new Error("Only numbers from 0 to 1 are accepted...");

        let sum = Math.round(weights.reduce((x, y) => x + y) * 10**accuracy) 
            / 10**accuracy;
        if (sum !== 1)
            throw new Error("The sum must be equal to 1...");

        const rand_int = this.random(); 
        sum = 0;
        for (let i = 0; i < weights.length; ++i) {
            sum += weights[i];
            if (rand_int < sum)
                return i
        }

        return weights.length - 1;
    }


}



/**
 * A class with a seed of randomness that provides some randomization 
 * functionality
 */
export class MyRandomSeed extends MyRandom {

    static seed_random;

    /**
     * @param {*} random_seed - a seed of randomness to get the same random 
     *  values for debugging
     */
    constructor (random_seed = '') {
        super();
        this.seed_random = seedrandom(random_seed);
    }

    /**
     * Returns a random number that depends on the seed of randomness.
     * @returns - a random value from range (0, 1)
     */
    random() {
        return this.seed_random();
    }

}
