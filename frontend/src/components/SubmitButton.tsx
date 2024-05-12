import React, { useContext } from 'react';
import { useCodeExecution } from '../Context';
import { toast } from 'react-toastify';

const SubmitButton: React.FC = () => {
    const { code, setCode, result, setResult, language } = useCodeExecution();
    const user_id = 1;

    const handleSubmitCode = async () => {
        try { 
            const response = await fetch('http://localhost:3000/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language, user_id }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            toast.success(data.message);
            setResult(data.output);
            console.log(data);
        } catch (e) {
            const errorMessage = e instanceof Error ? 'Error Occured: ' + e.message : 'An unexpected error occurred';
            toast.error(errorMessage);
            setResult(e instanceof Error ? e.message : 'An unexpected error occurred');
            console.error(e);
        }
    };

    return (
        <button 
            onClick={handleSubmitCode} 
            className={`p-2 text-black rounded-3xl font-bold ${code !== '' ? 'bg-green-400' : 'bg-green-800 cursor-not-allowed'}`}
            disabled={code === ''}
        >
            Submit
        </button>
    );
};

export default SubmitButton;
