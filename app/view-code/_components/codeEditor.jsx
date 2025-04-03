import React from "react";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import Constants from "@/data/Constants";

const CodeEditor = ({ codeRes, isReady }) => {
  return (
    <div>
      {isReady ? (
        <Sandpack
          theme={aquaBlue}
          template="react"
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
            showTabs: true,
            showNavigator: true,
            editorHeight: 830,
          }}
          customSetup={{
            dependencies: {
              ...Constants.DEPENDENCY
            },
          }}
          files={{
            "/App.js": `${codeRes}`,
          }}
        />
      ) : (
        <SandpackProvider template="react"
        theme={aquaBlue}
        files={{
          "/app.js": {
            code: `${codeRes}`,
            active:true
          }
        }}
        customSetup={{
          dependencies: {
            ...Constants.DEPENDENCY
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        >
          <SandpackLayout>
            <SandpackCodeEditor showTabs={true} style={{height:'70vh'}}/>
          </SandpackLayout>
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeEditor;
