import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { GraphAI, TransactionLog } from "graphai";
import * as vanilla_agents from "@graphai/vanilla";
import * as llm_agents from "@graphai/llm_agents";

import * as fs from "fs";
import { parse } from "csv-parse/sync";

const csvAgent = () => {
  // const data = fs.readFileSync(__dirname + '/test-00000-of-00001.json');
  const data = fs.readFileSync(__dirname + "/test.json");
  const records = JSON.parse(data.toString());
  console.log(Object.keys(records));
  // 'question', 'choices'
  const queries = [];
  for (const key of Object.keys(records.question)) {
    const choises = Object.keys(records.choices[key].label)
      .map((k) => {
        return [records.choices[key].label[k], records.choices[key].text[k]].join(" ");
      })
      .join("\n");
    queries.push({
      prompt: [records.question[key], choises].join("\n"),
      // system: 'Please choose the answer. Please return only the symbol of the choice. No explanation and description needed. you have to return just one charactor'
      system: "choose one and answar just A, B, C D",
    });
    console.log([records.question[key], choises].join("\n"));
  }
  // console.log(hoge)
  return queries;
};

const graph_data = {
  version: 0.5,
  nodes: {
    csvAgent: {
      agent: csvAgent,
    },
    map: {
      agent: "mapAgent",
      inputs: { rows: ":csvAgent" },
      graph: {
        nodes: {
          agent: {
            agent: "openAIAgent",
            inputs: { prompt: ":row.prompt" },
          },
          bypass: {
            agent: "bypassAgent",
            inputs: [":agent.choices.$0.message.content"],
            isResult: true,
          },
        },
      },
      isResult: true,
    },
  },
};

export const main = async () => {
  const graph = new GraphAI(graph_data, { ...vanilla_agents, ...llm_agents });
  graph.onLogCallback = (log: TransactionLog) => {
    // console.log(log);
  };
  const result = await graph.run();
  console.log(JSON.stringify(result));
};

main();
