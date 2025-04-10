import React, { useState, ChangeEvent, FC, CSSProperties, useEffect } from 'react';

interface CustomCheckboxProps {
  id: Number
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (id: Number, checked: boolean) => void;
  checkboxStyle?: CSSProperties;
  labelStyle?: CSSProperties;
//   onChangeFn?: any
}

const CustomCheckbox: FC<CustomCheckboxProps> = ({
  id,
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  checkboxStyle,
  labelStyle,
//   onChangeFn,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Ensure the checkbox state syncs with defaultChecked when it changes
  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    // onChangeFn(id, checked);
    if (onChange) onChange(id, checked);
  };

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        pointerEvents: disabled ? 'none' : 'auto',
        fontSize: '14px',
        fontFamily: 'Inter-regular',
        color: "#131313",
        // opacity: disabled ? 0.6 : 1, // Visual indication for disabled state
        ...labelStyle,
      }}
    >
    {/* <div> */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        style={{ width: '15px', height: '15px', marginRight: '8px', ...checkboxStyle }}
      />
      {/* </div> */}
      {label}
    </label>
  );
};

export default CustomCheckbox;
