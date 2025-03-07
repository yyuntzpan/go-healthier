import React, { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import styles from './date-picker.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes, addMonths } from 'date-fns'

export default function GymDatePicker({
  startDate = setHours(setMinutes(new Date(), 30), 17),
  setStartDate = () => {},
  handleDateChange = () => {},
  initializeDate = () => {},
}) {
  const filterPassedTime = (time) => {
    const currentDate = initializeDate()
    const selectedDate = new Date(time)
    return currentDate.getTime() < selectedDate.getTime()
  }
  const maxDate = addMonths(initializeDate(), 2) //2個月後的日期可以選擇
  // const ExampleCustomInput = forwardRef(
  //   ({ value, onClick, className }, ref) => (
  //     <button className={styles.customInput} onClick={onClick} ref={ref}>
  //       {value ? value : '請選擇預約時間'}
  //     </button>
  //   )
  // )
  return (
    <div className={styles.container} style={{ width: '100%' }}>
      <p className={styles.label}>預約時間</p>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date)
          handleDateChange(date)
        }}
        filterTime={filterPassedTime}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={60}
        timeCaption="time"
        maxDate={maxDate}
        minDate={initializeDate()}
        minTime={setHours(setMinutes(new Date(), 0), 9)}
        maxTime={setHours(setMinutes(new Date(), 0), 20)}
        dateFormat="yyyy-MM-dd HH:mm"
        className={styles.customDatePicker}
        placeholderText="請選擇預約時間"
        // customInput={<ExampleCustomInput className="custom-input" />}
      />
    </div>
  )
}
