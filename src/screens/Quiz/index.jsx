import React from "react";
import { Lottie } from "@crello/react-lottie";
import { motion } from "framer-motion";

import Widget from "../../components/Widget";
import CenteredContainer from "../../components/CenteredContainer";
import QuizLogo from "./Components/QuizLogo";
import Result from "./Components/Result";
import QuizBackground from "./Components/QuizBackground";
import QuizContainer from "./Components/QuizContainer";
import AlternativesForm from "./Components/AlternativesForm";
import Button from "../../components/Button";
import BackLinkArrow from "../../components/BackLinkArrow";

import loadingAnimation from "../../animations/loading.json";

function ResultWidget({ results, scorePoints }) {
  let qtdPerguntasCertas = results.filter((acertou) => acertou).length;
  let scoreAtual = null;
  if (scorePoints) {
    scorePoints.forEach((score) => {
      if (
        qtdPerguntasCertas >= score.minPoints &&
        qtdPerguntasCertas <= score.maxPoints
      ) {
        scoreAtual = score;
      }
    });
  }

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        Tela de Resultado
      </Widget.Header>

      <Widget.Content>
        <p style={{ textAlign: "center" }}>
          Você acertou
          <b> {qtdPerguntasCertas} </b>
          pergunta(s)
        </p>

        {scoreAtual && (
          <CenteredContainer>
            <img
              style={{ width: "100%", padding: 10 }}
              src={scoreAtual.image}
              alt="Score Atual"
            />
            <b style={{ textAlign: "center" }}>{scoreAtual.message}</b>
          </CenteredContainer>
        )}

        {!scoreAtual && (
          <ul>
            {results.map((result, index) => (
              <li key={`result__${result}`}>
                <Widget.Topic>
                  {index + 1}º Pergunta{" - "}
                  {result === true ? "Acertou" : "Errou"}
                </Widget.Topic>
              </li>
            ))}
          </ul>
        )}
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <CenteredContainer fullViewPort={true}>
      <Lottie
        width="200px"
        height="200px"
        className="lottie-container basic"
        config={{
          animationData: loadingAnimation,
          loop: true,
          autoplay: true,
        }}
      />
    </CenteredContainer>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(
    undefined
  );
  const [isQuestionSubmitted, setIsQuestionSubmitted] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmitted(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmitted(false);
              setSelectedAlternative(undefined);
            }, 1500);
          }}
        >
          {isQuestionSubmitted && isCorrect && (
            <Result isSuccess={true}>Você acertou!</Result>
          )}

          {isQuestionSubmitted && !isCorrect && (
            <Result isSuccess={false}>Você errou!</Result>
          )}

          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? "SUCCESS" : "ERROR";
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmitted && alternativeStatus}
              >
                <input
                  style={{ display: "none" }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};
export default function QuizPage({
  externalQuestions,
  externalBg,
  scorePoints,
}) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  function addResult(result) {
    setResults([...results, result]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 2000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  if (screenState === screenStates.LOADING) {
    return (
      <QuizBackground backgroundImage={bg}>
        <LoadingWidget />
      </QuizBackground>
    );
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.RESULT && (
          <ResultWidget results={results} scorePoints={scorePoints} />
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
