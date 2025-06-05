import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

class Timer {
  constructor() {
    this.targetDate = null;
    this.refs = {
      input: document.querySelector("#datetime-picker"),
      startButton: document.querySelector("[data-start]"),
      days: document.querySelector("[data-days]"),
      hours: document.querySelector("[data-hours]"),
      minutes: document.querySelector("[data-minutes]"),
      seconds: document.querySelector("[data-seconds]"),
    };
    this.timerInterval = null;
    this.init();
  }

  init() {
    this.refs.startButton.disabled = true;
    this.flatpickrInstance = flatpickr(this.refs.input, this.getFlatpickrOptions());
    this.refs.startButton.addEventListener("click", this.start.bind(this));
  }

  getFlatpickrOptions() {
    return {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: this.onDateSelected.bind(this),
    };
  }

  onDateSelected(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future.",
        position: "topRight",
      });
      this.refs.startButton.disabled = true;
      this.targetDate = null;
    } else {
      this.targetDate = selectedDate;
      this.refs.startButton.disabled = false;
    }
  }

  start() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.refs.startButton.disabled = true;
    this.refs.input.disabled = true;

    this.timerInterval = setInterval(() => {
      const timeDifference = this.targetDate - new Date();

      if (timeDifference <= 0) {
        this.stop();
        return;
      }

      this.updateDisplay(this.convertMs(timeDifference));
    }, 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    this.refs.input.disabled = false;
    iziToast.info({
      title: "Info",
      message: "Countdown complete",
      position: "topRight",
    });
  }

  convertMs(ms) {
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

  addLeadingZero(value) {
    return String(value).padStart(2, "0");
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    this.refs.days.textContent = this.addLeadingZero(days);
    this.refs.hours.textContent = this.addLeadingZero(hours);
    this.refs.minutes.textContent = this.addLeadingZero(minutes);
    this.refs.seconds.textContent = this.addLeadingZero(seconds);
  }
}

const timer = new Timer();
