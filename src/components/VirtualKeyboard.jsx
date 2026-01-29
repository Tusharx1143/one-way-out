import { useState, useCallback } from 'react';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['123', 'space', '.', '⏎'],
];

const KEYBOARD_NUMBERS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['#+=', '.', ',', '?', '!', "'", '⌫'],
  ['ABC', 'space', '.', '⏎'],
];

const KEYBOARD_SYMBOLS = [
  ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
  ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
  ['123', '.', ',', '?', '!', "'", '⌫'],
  ['ABC', 'space', '.', '⏎'],
];

export function VirtualKeyboard({ onKeyPress, nextChar }) {
  const [shifted, setShifted] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState('letters'); // letters, numbers, symbols

  const handleKeyPress = useCallback((key) => {
    if (key === 'shift') {
      setShifted(prev => !prev);
      return;
    }
    if (key === '123') {
      setKeyboardMode('numbers');
      return;
    }
    if (key === 'ABC') {
      setKeyboardMode('letters');
      return;
    }
    if (key === '#+=') {
      setKeyboardMode('symbols');
      return;
    }
    if (key === '⌫') {
      // Backspace - not needed in this game
      return;
    }
    if (key === '⏎') {
      // Enter - not needed
      return;
    }
    
    let char = key;
    if (key === 'space') {
      char = ' ';
    } else if (shifted && keyboardMode === 'letters') {
      char = key.toUpperCase();
      setShifted(false);
    }
    
    onKeyPress(char);
  }, [shifted, keyboardMode, onKeyPress]);

  // Auto-shift for capital letters
  const shouldAutoShift = nextChar && nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase();

  let rows = KEYBOARD_ROWS;
  if (keyboardMode === 'numbers') rows = KEYBOARD_NUMBERS;
  if (keyboardMode === 'symbols') rows = KEYBOARD_SYMBOLS;

  const isShiftActive = shifted || shouldAutoShift;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] p-2 pb-4 border-t border-[var(--color-bone)]/10 md:hidden">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((key) => {
            const isSpecial = ['shift', '⌫', '123', 'ABC', '#+=', '⏎'].includes(key);
            const isSpace = key === 'space';
            const isNextKey = keyboardMode === 'letters' && (
              (isShiftActive && key.toUpperCase() === nextChar) ||
              (!isShiftActive && key === nextChar)
            ) || (keyboardMode !== 'letters' && key === nextChar);
            
            let displayKey = key;
            if (key === 'shift') displayKey = isShiftActive ? '⇧' : '⇪';
            if (keyboardMode === 'letters' && isShiftActive && key.length === 1) {
              displayKey = key.toUpperCase();
            }
            
            return (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`
                  ${isSpace ? 'flex-1 max-w-[200px]' : isSpecial ? 'px-3' : 'w-8 md:w-10'}
                  h-12 rounded-md font-medium text-sm
                  transition-colors duration-100
                  ${isNextKey 
                    ? 'bg-green-600 text-white' 
                    : isSpecial 
                      ? 'bg-[#333] text-[var(--color-bone)]/70' 
                      : 'bg-[#444] text-[var(--color-bone)]'
                  }
                  active:bg-[var(--color-bone)]/30
                  ${key === 'shift' && isShiftActive ? 'bg-[var(--color-bone)]/30' : ''}
                `}
              >
                {displayKey === 'space' ? '␣' : displayKey}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
