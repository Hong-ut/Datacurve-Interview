import React from 'react';
import { useCodeExecution } from '../Context'; // adjust the path as necessary

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useCodeExecution();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className='p-2'>
      <select id="language-select" value={language} className=' rounded-3xl p-2  bg-green-300 font-bold' onChange={handleLanguageChange}>
        <option value="python">Python</option>
        <option value="go">Go</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
