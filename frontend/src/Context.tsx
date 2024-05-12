import React, { createContext, useState, ReactNode, useContext } from 'react';

interface CodeExecutionContextType {
  code: string;
  setCode: (code: string) => void;
  result: string;
  setResult: (result: string) => void;
  language: string;
  setLanguage: (result: string) => void;
}

const CodeExecutionContext = createContext<CodeExecutionContextType | undefined>(undefined);

export const useCodeExecution = () => {
  const context = useContext(CodeExecutionContext);
  if (!context) {
    throw new Error('useCodeExecution must be used within a CodeExecutionProvider');
  }
  return context;
};

export const CodeExecutionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');

  
  return (
    <CodeExecutionContext.Provider value={{ code, setCode, result, setResult, language, setLanguage }}>
      {children}
    </CodeExecutionContext.Provider>
  );
};
