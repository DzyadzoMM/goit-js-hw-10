import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки при сабміті форми

  const delayInput = this.elements.delay; // Доступ до поля delay
  const stateInput = this.elements.state; // Доступ до радіокнопок state

  const delay = Number(delayInput.value); // Отримуємо значення затримки і перетворюємо його на число
  const selectedState = stateInput.value; // Отримуємо вибраний стан (fulfilled або rejected)

  createPromise(delay, selectedState)
    .then(delayValue => {
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: "topRight",
      });
    })
    .catch(delayValue => {
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: "topRight",
      });
    });

  // Очищення форми після сабміту (за бажанням)
  this.reset();
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
