import { search, SafeSearchType } from "duck-duck-scrape";

import { SerpAPI, Tool } from "langchain/tools";

import { Calculator } from "langchain/tools/calculator";

import {
  createAiFunctionInstance,
  WebBrowserTool,
} from "ai-function-helper-langchain";

import * as dotenv from "dotenv";

dotenv.config();

const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);

class DDG extends Tool {
  name = "search";
  async _call(input) {
    try {
      let googleResult = await search(input, {
        safeSearch: SafeSearchType.STRICT,
      });

      googleResult = googleResult.results.slice(0, 5);
      googleResult = googleResult.map(({ title, description, url }) => ({
        title,
        body: description.replace(/<.*?>/g, ""),
        href: url,
      }));
      return JSON.stringify(googleResult);
    } catch (error) {
      return "No good search result found";
    }
  }
  description = `a search engine. useful for when you need to answer questions about current events. input should be a search query.`;
}

(async () => {
  // Today date format: DD month YYYY
  // Example: 12 December 2020
  const todayDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const options = {
    args: {},
    description: "Return a dictionnary with all data got from the 'agentData'",
    temperature: 0,
    funcReturn: "dict[presidentName: str, currentAge: float, ageRaised: float]",
    functionName: "make_dict",
    showDebug: true,
    agentArgs: {
      // agentType: 'plan-and-execute', // https://js.langchain.com/docs/modules/agents/agents/plan_execute/
      agentTask: `Today we are the ${todayDate}. Who is the current president of the United States? Find his birthday and answer what his current age ? And what his current age raised to the second power?`,
      agentTools: [new DDG(), WebBrowserTool(), new Calculator()],
      agentReturnKey: "agentData",
      callbackStartAgent: () => {
        console.log("Agent started");
      },
      callbackEndAgent: () => {
        console.log("Agent finished");
      },
    },
    langchainVerbose: true,
  };
  const optionsStream = {
    ...options,
    useInternalStream: true,
  };

  await aiFunction(optionsStream)
    .then((response) => {
      console.log("AI response:", response);
    })
    .catch((err) => {
      console.error("An error occurred:", err);
    });
})();
