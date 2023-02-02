const brain = require('brain.js')
const { Select } = require('enquirer');

const pattern = []
const patternLength = 10
let gameCount = 0
let playerWins = 0
let aiWins = 0

const handValues = {
  'rock': 1,
  'paper': 2,
  'scissors': 3
}
const counters = {
  'rock': 'paper',
  'paper': 'scissors',
  'scissors': 'rock'
}

const getHandFromValue = val => Object.keys(handValues).find(k => handValues[k] === val)

const prepareData = () => {
  if (pattern.length < 1) {
    for (let index = 1; index <= patternLength; index++) {
      pattern.push(Math.floor(Math.random() * 3) + 1)
    }
  }
}

const updatePattern = (hand) => {
  if (gameCount !== 0) {
    pattern.shift()
    pattern.push(hand)
  }
}

const predict = (hand) => {
	prepareData()
  const net = new brain.recurrent.LSTMTimeStep()
  net.train([pattern], { iterations: 100, log: false })
  const humanWillChoose = net.run(pattern)
  updatePattern(hand)
  
  const roundedHumanWillChoose = Math.round(humanWillChoose)
  const chosenByAI = 1 <= roundedHumanWillChoose && roundedHumanWillChoose <= 3 ? (roundedHumanWillChoose % 3) + 1 : 1
  
  return [roundedHumanWillChoose, chosenByAI]
}

const go = (hand) => {
 	gameCount++
  return predict(hand)
}

// test code
// const hands = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,3,3,3,3,3]
// hands.forEach(n => console.log('input', n, 'output', go(n)))

const updateStats = (playerHand, aiHand) => {
  gameCount++
  if (playerHand === aiHand) {
    return
  }
  if (counters[aiHand] === playerHand) {
    playerWins++
  } else {
    aiWins++
  }
}

const play = async () => {
  const prompt = new Select({
    name: 'hand',
    message: 'Rock Paper Scissors Shoot',
    choices: Object.keys(handValues)
  });

  try {
    const answer = await prompt.run()
    console.log('you played: ', answer)
    const playerHandValue = handValues[answer]
    const [_, aiHandValue] = predict(playerHandValue)
    const aiHand = getHandFromValue(aiHandValue)
    console.log('ai played: ', aiHand)
    updateStats(answer, aiHand)
    console.log(`You ${playerWins} : ${aiWins} AI --- out of ${gameCount} rounds`)
  } catch (e) {
    console.error(e)
  }
  console.log('\n')
}

const start = async() => {
  while (true) {
    await play()
  }
}

start()