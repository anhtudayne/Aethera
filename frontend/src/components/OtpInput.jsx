import { useRef, useState } from 'react';

export default function OtpInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val && !/^\d$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete when all filled
    const otp = newValues.join('');
    if (otp.length === length && !newValues.includes('')) {
      onComplete?.(otp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const newValues = [...values];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setValues(newValues);

    const nextIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl border-2
            outline-none transition-all duration-200
            ${val
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-300 bg-white text-gray-800'
            }
            focus:border-primary focus:ring-2 focus:ring-primary/20 focus:animate-pulse-border
          `}
        />
      ))}
    </div>
  );
}
