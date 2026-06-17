import { useRef, useState } from 'react';

const OTPInput = ({ value = '', onChange, length = 6 }) => {
  const inputRefs = useRef([]);
  const valString = value.toString().slice(0, length);
  const initialDigits = Array(length).fill('');
  for (let i = 0; i < valString.length; i++) {
    initialDigits[i] = valString[i];
  }
  const [digits, setDigits] = useState(initialDigits);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    const newDigits = Array(length).fill('');
    for (let i = 0; i < valString.length; i++) {
      newDigits[i] = valString[i];
    }
    setDigits(newDigits);
  }

  const handleChange = (index, val) => {
    const cleanVal = val.replace(/[^0-9]/g, '').slice(-1); // Only allow single digit
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Bubble value up
    const newOtp = newDigits.join('');
    if (onChange) onChange(newOtp);

    // Auto-focus next input on entry
    if (cleanVal && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: focus previous input on delete
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        
        // Also clear previous value on backspace
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        if (onChange) onChange(newDigits.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return; // Only numeric pastes

    const otpDigits = pastedData.slice(0, length).split('');
    const newDigits = [...digits];
    
    otpDigits.forEach((char, idx) => {
      if (idx < length) {
        newDigits[idx] = char;
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = char;
        }
      }
    });
    
    setDigits(newDigits);
    const newOtp = newDigits.join('');
    if (onChange) onChange(newOtp);

    // Focus last filled box or last input
    const focusIndex = Math.min(otpDigits.length, length - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0' }}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          style={{
            width: '48px',
            height: '48px',
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            border: digits[index] ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            background: digits[index] ? 'var(--color-accent-light)' : 'var(--color-bg-white)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-accent)';
            e.target.style.boxShadow = 'var(--shadow-focus)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = digits[index] ? 'var(--color-accent)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
