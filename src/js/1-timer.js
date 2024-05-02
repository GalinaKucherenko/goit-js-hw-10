import flatpickr from 'flatpickr';
import iziToast from "izitoast";

let getRef = selector => document.querySelector(selector);
const imputDatePickerRef = getRef('#datetime-picker');
const btnStartRef = getRef('[data-start]');
const daysRef = getRef('[data-days]');
const hoursRef = getRef('[data-hours]');
const minutesRef = getRef('[data-minutes]');
const secondsRef = getRef('[data-seconds]');

let userSelectedDate = null;
let timeDifference = 0;
let timerId = null;
let formatDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    currentDifferenceDate(userSelectedDate);
  },
};

btnStartRef.setAttribute('disabled', true);

flatpickr(imputDatePickerRef, options);

btnStartRef.addEventListener('click', onBtnStart);

window.addEventListener('keydown', e => {
  if (e.code === 'Escape' && timerId) {
    clearInterval(timerId);

    imputDatePickerRef.removeAttribute('disabled');
    btnStartRef.setAttribute('disabled', true);

    secondsRef.textContent = '00';
    minutesRef.textContent = '00';
    hoursRef.textContent = '00';
    daysRef.textContent = '00';
  }
});

function onBtnStart() {
  timerId = setInterval(startTimer, 1000);
  btnStartRef.setAttribute('disabled', true);
  imputDatePickerRef.setAttribute('disabled', true);
}

function currentDifferenceDate(selectedDate) {
  const currentDate = Date.now();

  if (selectedDate < currentDate) {
    btnStartRef.setAttribute('disabled', true);
    return iziToast.error({
      message: 'Please choose a date in the future',
    });
  }

  timeDifference = selectedDate - currentDate;
  formatDate = convertMs(timeDifference);

  renderDate(formatDate);
  btnStartRef.removeAttribute('disabled');
}

function startTimer() {
  timeDifference -= 1000;

  if (timeDifference <= 0) {
    clearInterval(timerId);
    imputDatePickerRef.removeAttribute('disabled');
    iziToast.success({
      message: 'Time end',
    });
  } else {
    formatDate = convertMs(timeDifference);
    renderDate(formatDate);
  }
}

function renderDate(formatDate) {
  secondsRef.textContent = addLeadingZero(formatDate.seconds);
  minutesRef.textContent = addLeadingZero(formatDate.minutes);
  hoursRef.textContent = addLeadingZero(formatDate.hours);
  daysRef.textContent = addLeadingZero(formatDate.days);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}