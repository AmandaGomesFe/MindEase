import React, { useState } from 'react';

interface SliderProps {
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  valueLabels?: string[];
}

export function Slider({ 
  label, 
  description,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  onChange,
  showValue = true,
  valueLabels
}: SliderProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  const getValueLabel = () => {
    if (valueLabels) {
      const index = Math.round(((value - min) / (max - min)) * (valueLabels.length - 1));
      return valueLabels[index];
    }
    return value;
  };

  return (
    <div className="w-full p-4">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label className="text-base font-medium text-foreground">
          {label}
        </label>
        {showValue && (
          <span className="text-lg font-medium text-primary" aria-live="polite">
            {getValueLabel()}
          </span>
        )}
      </div>
      
      {description && (
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="
            w-full h-3 appearance-none cursor-pointer
            bg-muted rounded-full
            focus:outline-none focus:ring-4 focus:ring-ring/30
            slider-thumb
          "
          style={{
            background: `linear-gradient(to right, 
              var(--primary) 0%, 
              var(--primary) ${percentage}%, 
              var(--muted) ${percentage}%, 
              var(--muted) 100%)`
          }}
        />
      </div>
      
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 200ms ease-in-out;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }
        
        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 2rem;
          height: 2rem;
          border: none;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 200ms ease-in-out;
        }
        
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }
        
        .slider-thumb::-moz-range-thumb:active {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
