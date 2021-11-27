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
	return Math.max(...tokens.filter(t => t.class === 'op').map(t => t.precedence))
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

		if (token.precedence === highestPrecedenceDegree)
			return {
				operation_index: i-1,
				operation: [tokens[i-1], token, tokens[i+1]]
			}
	}
}

function countOperations(tokens) {
	return tokens.filter(t => t.class === 'op').length
}

function getOperationByIndex(tokens, operationIndex) {
	return [tokens[operationIndex], tokens[operationIndex+1], tokens[operationIndex+2]]
}

function solveOperation(tokens, operationToSolveIndex) {
	let operationToSolve = getOperationByIndex(tokens, operationToSolveIndex)
	let operator = operationToSolve[1].token // 2º token (sempre)
	let operands = [operationToSolve[0].token, operationToSolve[2].token]
	let result
	switch (operator) {
		case '+':
				result = operands[0] + operands[1]
				break;
		case '-':
			result = operands[0] - operands[1]
			break;
		case '*':
			result = operands[0] * operands[1]
			break;
		case '/':
			result = operands[0] / operands[1]
			break;
	}
	// Substitui a operação pelo seu resultado
	tokens = [
		...tokens.slice(0, operationToSolveIndex), 
		{ token: result, class: 'number'},
		...tokens.slice(operationToSolveIndex+3,)
	]
	return tokens
}

(async () => {

	let expr = true ? '2 * 7 + 55' : '2 + 7 * 55'

	let _tokens = getTokens(expr)
	_tokens = classify(_tokens)

	while (countOperations(_tokens) > 0) {
		defineOperationsPrecedence(_tokens)
		let hpd = getHighestPrecedenceDegree(_tokens)
		let hpo_i = getHighestPrecedenceOperation(_tokens, hpd).operation_index
		_tokens = solveOperation(_tokens, hpo_i)
	}

	console.log(_tokens)

})()



