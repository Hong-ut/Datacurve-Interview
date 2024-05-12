import React, { useContext } from 'react';
import { useCodeExecution } from '../Context';
import { toast } from 'react-toastify';

const ExecuteButton: React.FC = () => {
    const { code, setCode, result, setResult, language } = useCodeExecution();

  const handleExecuteCode = async () => {
    console.log(code)
    console.log(language)
    console.log(JSON.stringify({ code, language }))
    const response = await fetch('http://localhost:3000/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });
    console.log(response)

    const data = await response.json();    
    if (data.error !== '') {
        setResult(data.error)
    } else {
        setResult(data.output);

    }
  };

  return (
    <button onClick={handleExecuteCode} className='p-2 text-black rounded-3xl font-bold  bg-green-400'>
      Test Code
    </button>
  );
};

export default ExecuteButton;
