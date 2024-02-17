'use strict';

const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main__title');

// функция в которой хранится база,1-ая вызовется
const getData = () => {
  const dataBase = [
    {
      id: '01',
      theme: 'Тема01',
      result: [
        [40, 'Есть задатки,нужно развиваться'],
        [80, 'Очень хорошо,но есть пробелы'],
        [100, 'Отличный результат']
      ],
      list: [
        {
          type: 'checkbox',
          question: 'Вопрос1?',
          answers: ['правильный1', 'правильный2', 'неправильный', 'неправильный'],
          correct: 2
        },
        {
          type: 'radio',
          question: 'Вопрос2?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос3?',
          answers: ['правильный1', 'правильный2', 'правильный3', 'неправильный'],
          correct: 3
        },
        {
          type: 'checkbox',
          question: 'Вопрос4?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
          correct: 1
        },
        {
          type: 'radio',
          question: 'Вопрос5?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос6?',
          answers: ['правильный1', 'правильный2', 'неправильный', 'неправильный'],
          correct: 2
        },
        {
          type: 'radio',
          question: 'Вопрос7?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос8?',
          answers: ['правильный1', 'правильный2', 'неправильный', 'правильный3'],
          correct: 3
        },
      ]
    },
    {
      id: '02',
      theme: 'Тема02',
      result: [
        [30, 'Есть задатки,нужно развиваться'],
        [60, 'Очень хорошо,но есть пробелы'],
        [100, 'Отличный результат']
      ],
      list: [
        {
          type: 'radio',
          question: 'Вопрос00?',
          answers: ['правильный', 'неправильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'radio',
          question: 'Вопрос02?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос03?',
          answers: ['правильный1', 'правильный2', 'правильный3', 'неправильный'],
          correct: 3
        },
        {
          type: 'checkbox',
          question: 'Вопрос04?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
          correct: 1
        },
        {
          type: 'radio',
          question: 'Вопрос05?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос06?',
          answers: ['правильный1', 'правильный2', 'неправильный', 'неправильный'],
          correct: 2
        },
        {
          type: 'checkbox',
          question: 'Вопрос07?',
          answers: ['неправильный', 'правильный1', 'правильный2', 'правильный3'],
          correct: 3
        },
        {
          type: 'radio',
          question: 'Вопрос99?',
          answers: ['неправильный', 'правильный', 'неправильный', 'неправильный'],
        },
        {
          type: 'checkbox',
          question: 'Вопрос10?',
          answers: ['правильный1', 'правильный2', 'неправильный', 'правильный3'],
          correct: 3
        },
      ]
    },
  ];

  return dataBase;
};

// функция в которой хранится база,2-ая вызовется
const renderTheme = (themes) => {
  // console.log('data: ', themes);
  const list = document.querySelector('.selection__list');
  list.textContent = '';

  // пустой массив в котором будут кнопки с темами и data-id
  const buttons = [];

  for (let i = 0; i < themes.length; i += 1) {
    const li = document.createElement('li');
    li.className = 'selection__elem';
    const button = document.createElement('button');
    button.className = 'selection__theme';
    // записываю в атрибут data- свойством dataset,data-id='themes[i].id;' со значением из базы
    button.dataset.id = themes[i].id;
    button.textContent = themes[i].theme;

    // вставляю кнопки в li а li в list
    li.append(button);
    list.append(li);

    // заполняю пустой массив кнопками
    buttons.push(button);
  }
  // отдаю кнопки в константу
  return buttons;
}

// в функцию передаются элементы которые нужно плавно скрыть
const hideElem = (elem) => {
  // getComputedStyle выводит все стили элемента
  //getPropertyValue выводит из всех конкретный стиль
  let opacity = getComputedStyle(elem).getPropertyValue('opacity');
  console.log('opacity: ', opacity);

  const animation = () => {
    opacity -= 0.05;
    elem.style.opacity = opacity;

    // если прозрачность ноль анимация работает
    if (opacity > 0) {
      requestAnimationFrame(animation);
    } else {
      elem.style.display = 'none';
    }
  }

  requestAnimationFrame(animation);
}

// функция создает список ответов с label и input,возращает массив label
const createAnswer = data => {
  // указывает тип чекбокса из базы data == quiz.list[questionCount]
  const type = data.type;

  // создаю массив с label,инпутами и span,вешаю нужные классы и атрибуты
  return data.answers.map(item => {
    const label = document.createElement('label');
    label.className = 'answer';

    const input = document.createElement('input');
    input.type = type;
    input.name = 'answer';
    input.className = `answer__${type}`;

    const text = document.createElement('span');
    text.className = 'answer__text';
    text.textContent = item;
    label.append(input, text);

    return label;
  })
}

// функция создает страницу с вопросами
const renderQuiz = quiz => {
  console.log('quiz from render: ', quiz);
  hideElem(title);
  hideElem(selection);

  // создаю блок где будут вопросы
  const questionBox = document.createElement('div')
  questionBox.classList.add('main__box', 'main__box_question')
  main.append(questionBox)

  let questionCount = 0;

  // показывает вопросы
  const showQuestion = () => {
    const data = quiz.list[questionCount];
    questionCount += 1;
    // console.log('data from showQuestion', data);

    questionBox.textContent = '';
    const form = document.createElement('form');
    form.className = 'main__form-question';
    // добавляю форме data-count = 1/10 
    form.dataset.count = `${questionCount}/${quiz.list.length}`;

    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.className = 'main__subtitle';
    legend.textContent = data.question;

    // создаю список ответов
    const answers = createAnswer(data)
    // console.log('answer000: ', answers);

    const button = document.createElement('button');
    button.classList.add('main__btn', 'question__next');
    button.type = 'submit';
    button.textContent = 'Подтвердить';

    fieldset.append(legend, ...answers);
    form.append(fieldset, button);
    // вставляю форму в блок
    questionBox.append(form);

    // создать массив
    // form.answer просто коллекция без методов
    // console.log('llllll', [...form.answer]);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let ok = false;
      const answer = [...form.answer].map(input => {
        if (input.checked) ok = true;
        return input.checked ? input.value : false;
      });

      if (ok) {
        console.log('ответ', answer);
      } else {
        alert('Вы не выбрали ни одного ответа');
        // console.error('Вы не выбрали ни одного ответа');
      };
    });
  }

  showQuestion();
}

// функция срабатывает при клике на тему,и навешивает клики на кнопки
const addClick = (buttons, data) => {
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // развернутая запись
      // data.find(item => {
      //   console.log('item: ', item);
      //   console.log('item: ', item.id);
      //   console.log('btn.id', btn.dataset.id);
      //   console.log(item.id === btn.dataset.id);
      //   return item.id === btn.dataset.id
      // })
      // короткая запись
      const quiz = data.find(item => item.id === btn.dataset.id);
      renderQuiz(quiz);
    })
  });
}

// запуск приложения
const initQuiz = () => {

  // получаю данные из базы
  const data = getData();
  // получаю все кнопки
  const buttons = renderTheme(data);

  // навешиваю клики на темы
  addClick(buttons, data);

};

initQuiz();

