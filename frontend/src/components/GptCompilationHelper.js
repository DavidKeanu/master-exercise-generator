import React from "react";
import {AiOutlineQuestionCircle} from "react-icons/ai";

/**
 * Displays the compilation help from gpt
 */
const GptCompilationHelper = ({output}) => {

  return (
    <div className='ai-helper-window w-full h-full px-1 py-1 flex flex-col'>
      <h2 className='w-full bg-[#2e293b] rounded-t-md text-white border-b-2 flex justify-center'>
        <AiOutlineQuestionCircle size={25} />
        Fehlerinspektor
      </h2>
      <div className='w-full flex-1 bg-[#2e293b] rounded-b-md text-white text-left font-normal text-m overflow-y-auto'>
        <div className='ml-2 mr-2'>{output}</div>
      </div>
    </div>
  );

}

export default GptCompilationHelper;