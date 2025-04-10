'use client';
import React from 'react';
import Select, { SingleValue } from 'react-select';
import profileDummy from '../../assets/images/profile_image.png'
import { useRouter } from 'next/router';

export type OptionType = {
  label: string;
  value: string;
};

export type PropsType = {
  onChange: (value: string) => void;
  value: string;
  width?: string;
  options?: OptionType[];
  placeholder: string;
  errorMessage?: string;
  paddingY?: string;
  isDisabled?: boolean;
  logo: string;
};

// import CourseProvider from '~/images/courseProvider.png';

const UserSelect = ({
  options,
  onChange,
  placeholder,
  value,
  logo,
}: PropsType) => {
  const router = useRouter()

  const handleLogout = (value: string) => {
    if (value === 'logout') {
      localStorage.clear();
      router.push('/login')
    }
  }

  return (

    <div
      style={{ padding: "4px", display: "flex", border: '1px solid #E3E7EF', borderRadius: "25px", backgroundColor: "#FFFFFF" }}>
      <div
        style={{
          display: 'flex', justifyContent: "center", alignItems: "center", overflow: "hidden", borderRadius: "50%",
          border: "1px solid #ccc",
        }}
      >

        <img src={logo ? logo : profileDummy.src} alt='profile' width={35} height={22} />
      </div>
      <div style={{ width: "85%" }}>
        <Select
          options={options}
          value={value ? { label: value, value: value } : null}
          placeholder={placeholder}
          isSearchable={false}
          onChange={(e: SingleValue<OptionType>) => {
            if (e) {
              handleLogout(e?.value);
            }
          }}
          styles={{
            input: (base) => ({
              ...base,
              'input:focus': {
                boxShadow: 'none',

              },
              width: '500px',
              cursor: 'pointer',
              fontSize: "8px"
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: '12px', // Set font size for selected value
              fontWeight: 600, // Set font weight for selected value
              color: '#0F1828'
            }),
            option: (provided) => ({
              ...provided,
              '&:hover': {
                background: 'lightgray',
                cursor: 'pointer',
              },
            }),
          }}
        />
      </div>
    </div>
  );
};

export default UserSelect;
