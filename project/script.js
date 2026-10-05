# Код файла `script.js`

```javascript
const $ = s => document.querySelector(s);


// ==========================
// ЧАСЫ И ДАТА
// ==========================

function updateClock() {

  const now = new Date();

  $('#clock').textContent =
    now.toLocaleTimeString('ru-RU');

  $('#date').textContent =
    now.toLocaleDateString(
      'ru-RU',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
    );
}

setInterval(updateClock, 1000);

updateClock();


// ==========================
// ПЛАНИРОВЩИК ЗАДАЧ
// ==========================

let tasks =
  JSON.parse(
    localStorage.getItem('timeflowTasks') || '[]'
  );


function saveTasks() {

  localStorage.setItem(
    'timeflowTasks',
    JSON.stringify(tasks)
  );

}


function renderTasks() {

  const list = $('#taskList');

  list.innerHTML = '';

  if (!tasks.length) {

    list.innerHTML =
      '<p>Пока нет задач. Добавь первую!</p>';

    return;
  }


  tasks.forEach((t, i) => {

    const el =
      document.createElement('div');

    el.className =
      'task ' + (t.done ? 'done' : '');


    el.innerHTML = `
      <input
        type="checkbox"
        ${t.done ? 'checked' : ''}
        aria-label="Готово"
      >

      <div class="task-name">
        <b>${escapeHtml(t.name)}</b>
      </div>

      <span class="tag">
        ${escapeHtml(t.category)}
      </span>

      <span class="tag">
        ${escapeHtml(t.priority)}
      </span>

      <button
        class="delete"
        title="Удалить">
        ✕
      </button>
    `;


    el.querySelector('input')
      .addEventListener('change', () => {

        tasks[i].done =
          !tasks[i].done;

        saveTasks();

        renderTasks();

      });


    el.querySelector('.delete')
      .addEventListener('click', () => {

        tasks.splice(i, 1);

        saveTasks();

        renderTasks();

      });


    list.appendChild(el);

  });

}


function escapeHtml(s) {

  return s.replace(
    /[&<>"']/g,

    m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m])
  );

}


$('#addTask')
  .addEventListener('click', () => {

    const name =
      $('#taskInput').value.trim();

    if (!name) {

      alert('Введите название задачи');

      return;
    }


    tasks.push({

      name: name,

      category:
        $('#category').value,

      priority:
        $('#priority').value,

      done: false

    });


    saveTasks();

    renderTasks();

    $('#taskInput').value = '';

  });


renderTasks();


// ==========================
// КАЛЬКУЛЯТОР ПРОДУКТИВНОСТИ
// ==========================

$('#calc')
  .addEventListener('click', () => {

    const study =
      +$('#study').value || 0;

    const work =
      +$('#work').value || 0;

    const rest =
      +$('#rest').value || 0;

    const fun =
      +$('#fun').value || 0;


    const total =
      study + work + rest + fun;


    if (!total) {

      $('#result').textContent =
        'Введите хотя бы одно значение.';

      return;
    }


    const productive =
      Math.round(
        (study + work) / total * 100
      );


    $('#result').innerHTML =
      `Продуктивное время:
      <b>${productive}%</b>
      · Отдых и развлечения:
      <b>${100 - productive}%</b>`;


    $('#progressBar').style.width =
      productive + '%';

  });


// ==========================
// POMODORO
// ==========================

let mode = 'work';

let seconds = 25 * 60;

let interval = null;


function setTimeFromInputs() {

  seconds =
    (
      mode === 'work'
        ? +$('#workMin').value
        : +$('#breakMin').value
    ) * 60;

  showTimer();

}


function showTimer() {

  const m =
    Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');

  const s =
    (seconds % 60)
      .toString()
      .padStart(2, '0');


  $('#timer').textContent =
    `${m}:${s}`;

}


function switchMode() {

  mode =
    mode === 'work'
      ? 'break'
      : 'work';


  $('#timerMode').textContent =
    mode === 'work'
      ? 'Работа'
      : 'Перерыв';


  setTimeFromInputs();


  document.body.style.background =
    mode === 'break'
      ? '#edf9f2'
      : '#f5f7fb';

}


function finish() {

  clearInterval(interval);

  interval = null;


  try {

    new Audio(
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='
    ).play();

  } catch (e) {}


  alert(
    mode === 'work'
      ? 'Время работы закончилось! Перерыв.'
      : 'Перерыв закончился! Время работать.'
  );


  switchMode();

  startTimer();

}


function startTimer() {

  if (interval) return;


  interval =
    setInterval(() => {

      seconds--;

      showTimer();


      if (seconds <= 0) {

        finish();

      }

    }, 1000);

}


$('#start')
  .addEventListener(
    'click',
    startTimer
  );


$('#pause')
  .addEventListener(
    'click',
    () => {

      clearInterval(interval);

      interval = null;

    }
  );


$('#reset')
  .addEventListener(
    'click',
    () => {

      clearInterval(interval);

      interval = null;

      mode = 'work';

      $('#timerMode').textContent =
        'Работа';

      setTimeFromInputs();

    }
  );


$('#workMin')
  .addEventListener(
    'change',
    () => {

      if (!interval && mode === 'work') {

        setTimeFromInputs();

      }

    }
  );


$('#breakMin')
  .addEventListener(
    'change',
    () => {

      if (!interval && mode === 'break') {

        setTimeFromInputs();

      }

    }
  );


showTimer();


// ==========================
// ФОРМА ОБРАТНОЙ СВЯЗИ
// ==========================

$('#contactForm')
  .addEventListener(
    'submit',
    e => {

      e.preventDefault();


      const email =
        $('#email').value;


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(email)
      ) {

        return;

      }


      $('#formMessage').textContent =
        'Сообщение принято! Спасибо за обратную связь.';


      e.target.reset();

    }
  );


// ==========================
// АНИМАЦИЯ ПОЯВЛЕНИЯ
// ==========================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(e => {

        if (e.isIntersecting) {

          e.target.classList.add('visible');

        }

      });

    },

    {
      threshold: 0.1
    }
  );


document
  .querySelectorAll('section')
  .forEach(x => {

    x.classList.add('fade');

    observer.observe(x);

  });
```
