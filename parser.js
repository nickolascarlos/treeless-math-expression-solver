// 2 + 7 * 55
// 2 * 7 + 55

function getTokens(s) {
	return s.split(' ')
}

function classify(tokens) {
	let r = []
	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i]

		if (!isNaN(token)) r.push({token: parseFloat(token), class: 'number'})
		else if (['+','-','*','/'].includes(token)) r.push({token, class: 'op'})
		else
			throw Error('Unknown token class: ' + token)
	}
	return r
}

function getPrecedence(op) {
	switch(op) {
		case '+': return 0
		case '-': return 0
		case '*': return 1
		case '/': return 1
	}
	return -1
}

function getHighestPrecedenceDegree(tokens) {
	return Math.max(...tokens.filter(t => t.class == 'op').map(t => t.precedence))
}

function defineOperationsPrecedence(tokens) {
	for (let token of tokens) {
		if (token.class != 'op') continue;

		token.precedence = getPrecedence(token.token)
	}
}

function getHighestPrecedenceOperation(tokens, highestPrecedenceDegree) {
	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i]
		if (token.class != 'op') continue;

		if (token.precedence == highestPrecedenceDegree)
			return [tokens[i-1], token, tokens[i+1]]
	}
}

(async () => {

	let expr = false ? '2 * 7 + 55' : '2 + 7 * 55'

	let _tokens = getTokens(expr)
	_tokens = classify(_tokens)
	defineOperationsPrecedence(_tokens)

	console.log(_tokens)
	let hpd = getHighestPrecedenceDegree(_tokens)
	console.log(getHighestPrecedenceOperation(_tokens, hpd))

})()



