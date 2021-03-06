function Poker() {}

Poker.prototype.getHighestCard = function(hand, skipCards) {
	skipCards = skipCards || 0;
	Poker.sortHand(hand);

	return hand[0+skipCards];
};

Poker.sortHand = function(hand) {
	hand.sort(function(array1, array2) {

		if(array1[0] > array2[0]) {
			return -1;
		} else if(array1[0] < array2[0]) {
			return 1;
		}
		return 0;
	});
};

Poker.prototype.checkForPair = function(hand, skipPairs) {
	skipPairs = skipPairs || 0;

	Poker.sortHand(hand);

	for(var i = 0; i < hand.length; i++) {
		if(typeof(hand[i+1]) !== 'undefined' && hand[i][0] === hand[i+1][0]) {
			if (skipPairs > 0) {
				skipPairs--;
				i++;
				continue;
			}

			return hand[i][0] * 2;
		}
	}
	return 0;
};

Poker.prototype.checkForTwoPair = function(hand) {
	firstPair  = this.checkForPair(hand);
	secondPair = this.checkForPair(hand, 1);

	return [firstPair, secondPair];
};

Poker.prototype.checkForTriple = function(hand) {
	Poker.sortHand(hand);

	for(var i = 0; i < hand.length; i++) {
		if(hand[i][0] === hand[i+1][0] && hand[i][0] === hand[i+2][0] ) {
			return hand[i][0] * 3;
		}
	}

	return 0;
};

Poker.prototype.checkForStraight = function(hand){
	Poker.sortHand(hand);
	var score = 0;
	for(var i = 0; i < hand.length; i++){
		if('undefined' !== typeof(hand[i+1]) && (hand[i][0] - hand[i+1][0]) !== 1){
			return 0;
		}

		score += hand[i][0];
	}
	return score;
};

Poker.prototype.checkForFlush = function(hand) {
	var color = hand[0][1];
	for(var i = 0; i < hand.length; i++){
		if (hand[i][1] !== color) {
			return 0;
		}
	}

	return this.getHighestCard(hand)[0];
};

Poker.prototype.checkForFullHouse = function(hand) {
	var twoPairScore = this.checkForTwoPair(hand);
	var tripleScore = this.checkForTriple(hand);
	var fourOfAKindScore = this.checkForFourOfAKind(hand);

	if(twoPairScore[0] > 0 && twoPairScore[1] > 0 && tripleScore > 0 && fourOfAKindScore === 0) {
		return this.getHighestCard(hand)[0];
	}

	return 0;
};

Poker.prototype.checkForFourOfAKind = function(hand) {
	var firstPair  = this.checkForPair(hand);
	var secondPair = this.checkForPair(hand, 1);

	if(firstPair === secondPair)
	{
		return firstPair * 2;
	}
	return 0;
};

Poker.prototype.checkForStraightFlush = function(hand) {
	var flush = this.checkForFlush(hand);
	var straight = this.checkForStraight(hand);

	if(flush > 0 && straight > 0) {
		return this.getHighestCard(hand)[0];
	}

	return 0;
};

Poker.prototype.compareHighestCards = function(hand1, hand2){
	var highestCardFirstHand = [];
	var highestCardSecondHand = [];

	for(var i = 0; i < hand1.length; i++){
		highestCardFirstHand = this.getHighestCard(hand1, i);
		highestCardSecondHand = this.getHighestCard(hand2, i);
		if(highestCardFirstHand[0] > highestCardSecondHand[0])
		{
			return {'hand': hand1, 'card': highestCardFirstHand};
		}
		else if(highestCardFirstHand[0] < highestCardSecondHand[0]){
			return {'hand': hand2, 'card': highestCardSecondHand};
		}
	}
	return {};
};

Poker.prototype.compareHighestPair = function(hand1, hand2) {
	var hand1Pair = this.checkForPair(hand1);
	var hand2Pair = this.checkForPair(hand2);

	if (hand1Pair > hand2Pair) {
		return {'hand': hand1, 'score': hand1Pair / 2};
	} else if(hand1Pair < hand2Pair) {
		return {'hand': hand2, 'score': hand2Pair / 2};
	}

	return {};
};