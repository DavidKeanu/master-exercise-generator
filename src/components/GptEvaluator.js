import {toast} from "react-toastify";
import {HiSparkles} from "react-icons/hi2";
import React from "react";

/**
 * Displays the evaluation from gpt
 */
const GptEvaluator = ({output}) => {

  let jsonText;
  try {
    jsonText = JSON.parse(output);
  } catch (error) {
    toast.error('Fehler beim Evaluieren');
    console.warn('output nicht im json format:', output);
    jsonText = [];
  }

  return (
    <div className='ai-evaluator-window w-full h-full px-1 py-1 flex flex-col'>
      <h2 className='w-full bg-[#2e293b] rounded-t-md text-white border-b-2 flex justify-center'>
        <HiSparkles size={25} />
        Evaluierer
      </h2>
      <div className={`w-full flex-1 bg-[#2e293b] rounded-b-md text-white font-normal text-m text-left overflow-y-auto`}>
        {jsonText.length > 0 && jsonText.map((item, index) =>
          <div key={index} className='ml-2 mr-2'>
            <p> <span className='font-bold'>Fehlerklasse:</span> {item.fehlerklasse}</p>
            <p> <span className='font-bold'>Detail:</span> {item.detail}</p>
            <p> <span className='font-bold'>Hilfe:</span> {item.hilfe}</p>
            <hr className="border-t border-gray-400 my-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default GptEvaluator;