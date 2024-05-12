import React, { useContext, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useCodeExecution } from '../Context'; // adjust the path as necessary

const CodeEditor: React.FC = () => {
    const { code, setCode, result, setResult, language, setLanguage } = useCodeExecution();
    const [test, setTest] = useState<string>('');

  return (
    <Editor
      height="60vh"
      language={language}
      value={code}
      theme='vs-dark'
      onChange={(value) => {
          setCode(value || '');
      }}
    />
  );
};

export default CodeEditor;
