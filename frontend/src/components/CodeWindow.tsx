import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

import 'prismjs/themes/prism-tomorrow.css';

interface CodeWindowProps {
  code: string;
  language: 'python' | 'java' | 'cpp';
}

const CodeWindow: React.FC<CodeWindowProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className="bg-[#2d2d2d] rounded-lg p-4 overflow-x-auto">
      <pre className="text-xs leading-snug font-mono">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeWindow;
