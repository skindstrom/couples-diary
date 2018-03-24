// @flow

import React, { PureComponent } from 'react';
import DayName from './DayName';
import Day from './Day';

import './styles.css';

type Props = {};
type State = {};

const NAMES_OF_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const NAME_OF_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class Calendar extends PureComponent<Props, State> {
  render() {
    const year = 2018;
    const month = 2;
    return (
      <section>
        <div className="calendar">
          <div className="month">{getMonthName(month)}</div>
          <div className="grid">
            {getDayNames()}
            {getDays(year, month)}
          </div>
        </div>
      </section>);
  }
}

function getMonthName(month: number) {
  return NAME_OF_MONTHS[month];
}

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}

function getDays(year: number, month: number) {
  const date = new Date(year, month);
  const dateToday = date.getDate();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);

  const daysInMonth = date.getDate();

  date.setDate(1);

  let days = [];
  days = days.concat(
    getDaysFromPreviousMonth(date.getFullYear(), date.getMonth()),
  );

  for (let i = 0; i < daysInMonth; i += 1) {
    const day = (
      <Day
        key={`M${date.getMonth()}-D${i}`}
        day={i + 1}
        currentMonth
        currentDay={i === dateToday}
        entryHer
      />
    );
    days.push(day);
  }

  days = days.concat(getDaysFromNextMonth(date.getFullYear(), date.getMonth()));

  return days;
}

function getDaysFromPreviousMonth(year: number, month: number) {
  const date = new Date(year, month);
  const daysFromPreviousMonth = (7 - date.getDay()) % 7;

  const daysInPrevMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0,
  ).getDate();

  const prevMonth = date.getMonth() - 1;

  const days = [];
  for (
    let i = daysInPrevMonth - daysFromPreviousMonth;
    i < daysInPrevMonth;
    i += 1
  ) {
    const day = (
      <Day
        key={`M${prevMonth}-D${i}`}
        day={i + 1}
        currentMonth={false}
        currentDay={false}
        entryHim
        entryHer
      />
    );

    days.push(day);
  }

  return days;
}

function getDaysFromNextMonth(year: number, month: number) {
  const date = new Date(year, month + 1);
  date.setDate(0);

  const daysFromNextMonth = (7 - date.getDay()) % 7;
  const nextMonth = date.getMonth() + 1;

  const days = [];
  for (let i = 0; i < daysFromNextMonth; i += 1) {
    const day = (
      <Day
        key={`M${nextMonth}-D${i}`}
        day={i + 1}
        currentMonth={false}
        currentDay={false}
      />
    );

    days.push(day);
  }

  return days;
}
