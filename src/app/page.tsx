"use client";

import { useEffect, useState } from "react";
import { sample as testData } from "./constant";

console.log(12311231231231);
function shuffle(array: Question[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const sample = shuffle(testData.questions).map((e, i) => {
  return { ...e, question_id: i + 1 };
});

type Choice = {
  choice_id: string;
  choice_text: string;
};

type Question = {
  question_id: number;
  question_text: string;
  choices: Choice[];
  correct_answer: string;
};

export type QuestionsData = {
  questions: Question[];
};

type Answers = {
  question_id: number;
  choice_text: string;
  choice_id: string;
  correct_answer: string;
};
const ResultsComp = ({ answers }: { answers: Answers[] }) => {
  const score = answers
    .map((e) => {
      if (e.correct_answer === e.choice_id) {
        return true;
      } else {
        return null;
      }
    })
    .filter((e) => e).length;

  let displayText = "PASSED";
  if (score < 50) {
    displayText = "FAILED";
  }
  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl text-black text-center">{displayText}</h1>
      <h1 className="text-xl text-black text-center">
        Score: {JSON.stringify(score)}
      </h1>
    </div>
  );
};
export default function Home() {
  const [results, setresults] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [question, setquestion] = useState<Question | null>(null);

  const [localAnswer, setlocalAnswer] = useState<Choice | null>(null);
  const [answers, setAnswers] = useState<
    {
      question_id: number;
      choice_text: string;
      choice_id: string;
      correct_answer: string;
    }[]
  >([]);

  useEffect(() => {
    const q =
      sample.find((e) => {
        return e.question_id === currentNumber;
      }) || null;
    setquestion(q);
  }, [currentNumber]);

  useEffect(() => {
    if (answers.length !== 0 && !question) {
      setresults(true);
    }
  }, [answers, question]);

  if (results) {
    return <ResultsComp answers={answers} />;
  }
  return (
    <main className="min-h-screen bg-white text-black">
      <h1 className="text-black text-4xl text-center">Quiz App</h1>
      {question && (
        <div>
          <h2 className="text-2xl text-center text-gray-700 my-4">
            {question?.question_id} {question?.question_text}
          </h2>
          <div className="flex flex-col gap-3 w-full px-4 my-8">
            {question?.choices.map((e) => {
              return (
                <div key={e.choice_id} className="w-full">
                  <p>
                    <button
                      onClick={() => {
                        setlocalAnswer(e);
                      }}
                      className={
                        localAnswer?.choice_id === e.choice_id
                          ? "btn btn-accent w-full text-start"
                          : "btn btn-outline w-full text-start"
                      }
                    >
                      {e.choice_text}
                    </button>
                  </p>
                </div>
              );
            })}
          </div>

          <div>
            <button
              disabled={localAnswer?.choice_id ? false : true}
              className="btn btn-secondary w-full"
              onClick={() => {
                setCurrentNumber(currentNumber + 1);

                setlocalAnswer(null);
                if (question) {
                  setAnswers([
                    ...answers,
                    {
                      question_id: question?.question_id || 0,
                      choice_text: localAnswer?.choice_text || "",
                      choice_id: localAnswer?.choice_id || "",
                      correct_answer: question.correct_answer || "",
                    },
                  ]);
                } else {
                  setresults(true);
                }
              }}
            >
              Next Question
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
