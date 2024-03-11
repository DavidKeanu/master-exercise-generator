import React from "react";

/**
 * Displays the compilation output
 */
const CompileOutput = (props) => {

  const {output, compileStatus} = props;

  const normalColorTailwindCss = 'text-white';
  const errorColorTailwindCss = 'text-red-600';

  const colorTailwindCss = compileStatus === 3 ? normalColorTailwindCss : errorColorTailwindCss;

  const outputLines = output.split('\n').map((line, i) => <div className={'ml-2'} key={i}>{line}</div>);

  return (
    <div className="compile-output-window w-full h-full px-1 py-1 flex flex-col">
      <h2 className={'w-full bg-[#1e293b] rounded-t-md text-white border-b-2'}>Kompilierungsausgabe</h2>
      <div className={`w-full flex-1 bg-[#1e293b] rounded-b-md ${colorTailwindCss} text-left font-normal text-m overflow-y-auto`}>
        {outputLines}
      </div>
    </div>
  );
}

export default CompileOutput;
