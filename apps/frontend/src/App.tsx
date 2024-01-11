import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { hc } from "hono/client";
import "./App.css";
import { AppType } from "@repo/backend";
import { useQuery } from "@tanstack/react-query";

function App() {
  const client = hc<AppType>("http://localhost:3000/");
  const [count, setCount] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await client.hello.$get({
        query: {
          name: "world",
        },
      });
      return res.json();
    },
  });

  console.log(isLoading, data);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
