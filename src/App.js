//CSS
import "./App.css";

//React
import { useState, useEffect, useCallback } from "react";

//Data
import { wordsList } from "./data/words";

//Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

//estagios do game
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWorld] = useState("");
  const [pickedCategory, setPicketCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetter, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordsAndCategory = useCallback(() => {
    //Pegando uma categoria aleatoria
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pegando uma palavra aleatoria
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //Inicio do jogo
  const startGame = useCallback(() => {
    clearLetterStates();
    //Pegando as palavras e as categorias
    const { word, category } = pickWordsAndCategory();

    //criando um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //setando os useStates
    setPickedWorld(word);
    setPicketCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordsAndCategory]);

  //processo de input da letra
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetter.includes(normalizedLetter)
    ) {
      return;
    }
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGueddesLetters) => [
        ...actualGueddesLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGueddesLetters) => actualGueddesLetters - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //Monitorando as tentativas do usúario
  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //Checando as condições de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //condições de vitoria
    if (guessedLetters.length === uniqueLetters.length) {
      //adicionando a pontuação
      setScore((actualScore) => (actualScore += 100));

      //reinicio do jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // Fim do jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetter={wrongLetter}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
