'use client';
import React from 'react';
import Select, { SingleValue } from 'react-select';

type OptionType = {
  label: string,
  value: string
}

export type PropsType = {
  onChange: (value: string | number) => void;
  value: string | number | null;
  width?: string;
  options: OptionType[];
  placeholder: string;
  errorMessage?: string;
  paddingY?: string;
  isDisabled?: boolean;
  bgColor?: string;
  borderColor?: string;
  color?: string,
  menuPlacement?: string
};

const SelectTag = ({
  options,
  onChange,
  width = '100%',
  value,
  placeholder,
  errorMessage = '',
  paddingY = '',
  isDisabled = false,
  bgColor = '#fff',
  borderColor = '',
  color = '',
  menuPlacement = 'bottom'
}: PropsType) => {
  return (
    <div>
      <Select
        isDisabled={isDisabled}
        options={options}
        value={value ? { label: value, value: value } : null}
        // value={options?.find((item)=>item.value===value) ?? null}
        placeholder={placeholder}
        // @ts-ignore
        menuPlacement={menuPlacement}
        onChange={(e) => {
          if (e) {
            onChange(e?.value);
          }
        }}
        styles={{
          input: (base) => ({
            ...base,
            'input:focus': {
              boxShadow: 'none',
            },
            width,
          }),
          placeholder: (base) => ({
            ...base,
            fontSize: '12px', // Set the font size of the placeholder
            color: '#858D9D', // Optional: change placeholder color
          }),
          singleValue: (base) => ({
            ...base,
            color: color,  // Set the color of the selected option
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            borderColor: errorMessage ? 'red' : borderColor,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            borderRadius: '8px',
            backgroundColor: isDisabled ? '#fff' : bgColor,
            minHeight: 'initial',
            fontSize: "14px"
          }),

          valueContainer: (base: any) => ({
            ...base,
            height: `${32 - 1 - 1}px`,
            padding: '0 8px',
          }),
          clearIndicator: (base: any) => ({
            ...base,
            padding: `${(32 - 20 - 1 - 1) / 2}px`,
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            padding: `${(32 - 20 - 1 - 1) / 2}px`,
          }),
        }}
      />
      {errorMessage && (
        <p style={{
          fontFamily: "Inter-regular",
          textTransform: "capitalize",
          color: 'red',
          fontSize: '11px',
          textAlign: 'left',
          marginTop: '8px'
        }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SelectTag;
