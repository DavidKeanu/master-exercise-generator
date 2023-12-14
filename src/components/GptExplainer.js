import React, {useMemo} from "react";
import {GiTeacher} from "react-icons/gi";

/**
 * Displays gpt code explanation
 */
const GptExplainer = ({output}) => {

  const outputAsLines = useMemo(() => output
    .split('\n')
    .map((line, i) =>
      <div className='ml-2 mr-2' key={i}>
        {line.trim().length > 0 ? line.trim() : <br />}
      </div>
    ), [output]);

  return (
    <div className='ai-explain-window w-full h-full px-1 py-1 flex flex-col'>
      <h2 className='w-full bg-[#2e293b] rounded-t-md text-white border-b-2 flex justify-center'>
        <GiTeacher size={25} />
        Code-Kommentator
      </h2>
      <div className='w-full flex-1 bg-[#2e293b] rounded-b-md text-white text-left font-normal text-m overflow-y-auto'>
        <div className='ml-2 mr-2'>{outputAsLines}</div>
      </div>
    </div>
  );
}

export default GptExplainer;