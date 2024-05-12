import React from 'react'

import { useCodeExecution } from '../Context';

const Output = () => {
    const { code, setCode, result, setResult, language, setLanguage } = useCodeExecution();
    return (
    <div className="output-container">
        <h1 className='font-bold  p-2'>Output:</h1>
        <pre className="scrollable-pre">{result}</pre>
      </div>
  )
}

export default Output;