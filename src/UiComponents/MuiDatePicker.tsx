import * as React from 'react';
import style from './index.module.css'
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import DateIcon from '../assets/icons/dateIcon.svg'
import Image from 'next/image';
import ErrorMessage from '../components/ui-components/ErrorMessage';
import { Box } from '@chakra-ui/react';

type PropType = {
  value?: Date | null | undefined,
  onChange: (arg: any) => void,
  minDate?: Date | null | undefined,
  maxDate?: Date | null | undefined,
  placeholder?: string
  errorMessage?: string | undefined,
  disabled?: boolean
}

export default function MuiDatePicker({
  value = null,
  onChange,
  minDate = dayjs().subtract(1, 'year').toDate(),
  maxDate = null,
  placeholder = 'DD/MM/YYYY',
  errorMessage = "",
  disabled = false
}: PropType) {

  const dateIcon = <Image style={{ cursor: 'pointer' }} src={DateIcon.src} width={24} height={24} alt='icon' />

  return (
    <Box
      position={'relative'}
    >
      <DatePicker
        value={value ? dayjs(value) : null}
        // @ts-ignore
        getPopupContainer={(triggerNode) => {
          return triggerNode?.parentNode;
        }}
        format="DD/MM/YYYY"
        onChange={(date) => {
          if (dayjs(date).isValid()) {
            onChange(dayjs(date).format("YYYY-MM-DD"))
          } else {
            onChange(null)
          }
        }}
        className={style.datePicker}
        status={errorMessage?.length > 0 ? "error" : ""}
        placeholder={placeholder}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        suffixIcon={dateIcon}
        disabled={disabled}
      />
      <ErrorMessage text={errorMessage} />
    </Box>
  );
}