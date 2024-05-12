import React from 'react';
import CodeEditor from './components/CodeEditor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCodeExecution } from './Context'; 

import ExecuteButton from './components/ExecuteButton';
import SubmitButton from './components/SubmitButton';
import LanguageSelector from './components/LanguageSelect';
import Output from './components/Output'
import './App.css'

const App = () => {

  return (
    <div className='flex flex-col h-full'>
      <ToastContainer />
      <LanguageSelector />
      <CodeEditor />
      <div className='flex justify-center gap-2 m-2'>
        <ExecuteButton />
        <SubmitButton />
      </div>
      <Output />

    </div>
  );
};

export default App;
