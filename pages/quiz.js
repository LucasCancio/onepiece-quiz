import { useRouter } from "next/router";
import React from "react";
import Widget from "../src/components/Widget";

export default function QuizPage() {
  const router = useRouter();
  const { name } = router.query;

  return (
    <Widget>
      <Widget.Header>
        <h1>Olá {name}</h1>
      </Widget.Header>
      <Widget.Content>
        <form
          onSubmit={function (e) {
            e.preventDefault();
            console.log("Fazendo uma submissão");
          }}
        >
          <button type="submit">Enviar</button>
        </form>
      </Widget.Content>
    </Widget>
  );
}
