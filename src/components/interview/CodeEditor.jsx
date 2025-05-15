import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CodeEditor() {
  const [code, setCode] = useState(`// Start coding here
function solution() {
  // Your implementation
  
  return result;
}
`);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fontSize, setFontSize] = useState("14px");
  const [theme, setTheme] = useState("light");
  const [autoSave, setAutoSave] = useState(true);
  const navigate = useNavigate();

  // Language options
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "ruby", label: "Ruby" },
    { value: "sql", label: "SQL" },
  ];

  // Font size options
  const fontSizes = [
    { value: "12px", label: "12px" },
    { value: "14px", label: "14px" },
    { value: "16px", label: "16px" },
    { value: "18px", label: "18px" },
    { value: "20px", label: "20px" },
  ];

  // Run code function
  const runCode = () => {
    setOutput("Running...");
    
    // This is a mock execution - in a real app you would send this to a backend
    setTimeout(() => {
      try {
        // For JavaScript we can use Function constructor to evaluate code
        // This is NOT secure for production - just for demonstration
        if (language === "javascript") {
          // Mock console.log implementation to capture output
          let consoleOutput = [];
          const originalConsoleLog = console.log;
          console.log = (...args) => {
            consoleOutput.push(args.join(" "));
            originalConsoleLog(...args);
          };
          
          try {
            // Create a function from the code string and execute it
            const result = new Function(code)();
            if (result !== undefined) {
              consoleOutput.push(`Return value: ${result}`);
            }
            setOutput(consoleOutput.join("\n") || "Executed successfully with no output");
          } catch (err) {
            setOutput(`Error: ${err.message}`);
          } finally {
            // Restore original console.log
            console.log = originalConsoleLog;
          }
        } else {
          // For other languages just show a mock message
          setOutput(`Code execution for ${language} would be handled by a backend service.\n\nMock output for demonstration purposes.`);
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    }, 500);
  };

  // Auto-save code to localStorage
  useEffect(() => {
    if (autoSave) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem("savedCode", code);
        localStorage.setItem("savedLanguage", language);
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [code, language, autoSave]);
  
  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    const savedLanguage = localStorage.getItem("savedLanguage");
    
    if (savedCode) setCode(savedCode);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Handle return to interview
  const returnToInterview = () => {
    window.close(); // Close the current window/tab
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center px-6 py-3 shadow-sm`}>
        <div className="flex items-center gap-2">
          <img src="/assets/logo_RM.png" alt="RecruitMantra" className="h-8" />
          <span className="text-lg font-medium">Code Editor</span>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex gap-4 mb-4">
          {/* Settings Panel */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-md shadow-sm flex items-center justify-between w-full`}>
            <div className="flex gap-4 items-center">
              {/* Language Selector */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-1">Language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`rounded border px-3 py-1.5 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Font Size Selector */}
              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium mb-1">Font Size</label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className={`rounded border px-3 py-1.5 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Theme Toggle */}
              <div>
                <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`rounded border px-3 py-1.5 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              {/* Auto-Save Toggle */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={() => setAutoSave(!autoSave)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Auto-Save</span>
                </label>
              </div>
            </div>
            
            {/* Run Button */}
            <button
              onClick={runCode}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Run Code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-sm overflow-hidden h-[calc(100vh-220px)]`}>
            <div className="p-2 bg-gray-700 text-white text-sm">
              <span>Editor</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-full p-4 font-mono resize-none focus:outline-none ${
                theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
              }`}
              style={{ fontSize }}
              spellCheck="false"
            ></textarea>
          </div>

          {/* Output Console */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-sm overflow-hidden h-[calc(100vh-220px)]`}>
            <div className="p-2 bg-gray-700 text-white text-sm flex justify-between items-center">
              <span>Output</span>
              <button 
                onClick={() => setOutput("")}
                className="text-xs text-gray-300 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div 
              className={`w-full h-full p-4 font-mono whitespace-pre-wrap overflow-auto ${
                theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
              }`}
              style={{ fontSize }}
            >
              {output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;