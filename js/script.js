'use strict';

const main = document.querySelector('.main');
const selection = document.querySelector('.selection');
const title = document.querySelector('.main__title');
//  1 ая
// функция в которой хранится база,1-ая вызовется
const getData = () => {
  return fetch('db/quiz_db.json').then(response => response.json())
};

// 11ая
// загрузит прошлые результаты из localstorage
const loadResult = (id) => {
  return localStorage.getItem(id)
}

// 10ая
// сохраняет результат
const saveResult = (result, id) => {
  console.log('result from saveResult: ', result);
  localStorage.setItem(id, result)
}

const showElem = (elem) => {
  let opacity = 0;
  elem.opacity = opacity;
  elem.style.display = '';

  const animation = () => {
    opacity += 0.05;
    elem.style.opacity = opacity;

    // если прозрачность ноль анимация работает
    if (opacity < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// 5ая
// в функцию передаются элементы которые нужно плавно скрыть
const hideElem = (elem, cb) => {
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
      if (cb) cb();
    }
  }

  requestAnimationFrame(animation);
}
// 8ая
// перемешать массив
const shuffle = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }

  return newArray
}



// 2-ая
// функция в которой хранится база,2-ая вызовется
const renderTheme = (themes) => {
  console.log('data: ', themes);
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
    // загружаю прошлые результаты
    const result = loadResult(themes[i].id);

    if (result) {
      const p = document.createElement('p');
      p.className = 'selection__result';
      p.innerHTML = `
<span class="selection__result-ratio">${result}/${themes[i].list.length}</span>
<span class="selection__result-text">Последний результат</span>
`;

      li.append(p);
    }



    // вставляю li в list
    list.append(li);

    // заполняю пустой массив кнопками
    buttons.push(button);
  }
  // отдаю кнопки в константу
  return buttons;
}


// 7ая
// функция создает ключи ответов
const createKeyAnswers = data => {
  const keys = [];

  for (let i = 0; i < data.answers.length; i++) {
    if (data.type === 'radio') {
      keys.push([data.answers[i], !i])
    } else {
      keys.push([data.answers[i], i < data.correct])
    }
  }
  return shuffle(keys);

}

// 8ая
// функция создает список ответов с label и input,возращает массив label
const createAnswer = data => {
  // указывает тип чекбокса из базы data == quiz.list[questionCount]
  const type = data.type;
  // создать список ключей и правильных ответов
  const answers = createKeyAnswers(data);


  // создаю массив с label,инпутами и span,вешаю нужные классы и атрибуты
  const labels = answers.map((item, i) => {
    const label = document.createElement('label');
    label.className = 'answer';

    const input = document.createElement('input');
    input.type = type;
    input.name = 'answer';
    input.className = `answer__${type}`;
    input.value = i;

    const text = document.createElement('span');
    text.className = 'answer__text';
    text.textContent = item[0];
    label.append(input, text);

    return label;
  })

  const keys = answers.map(answer => answer[1]);
  return {
    labels,
    keys
  }
}

// 9ая
// выводит результат
const showResult = (result, quiz) => {
  const block = document.createElement('div');
  block.className = 'main__box main__box_result result';

  const percent = result / quiz.list.length * 100;


  let ratio = 0;
  for (let i = 0; i < quiz.result.length; i++) {
    if (percent >= quiz.result[i][0]) {
      ratio = i;
    };
  };

  block.innerHTML = `
   <h2 class="main__subtitle main__subtitle_result">Ваш результат</h2>
<div class="result__box">
  <p class="result__ratio result__ratio_${ratio + 1}">${result}/${quiz.list.length}</p>
  <p class="result__text">${quiz.result[ratio][1]}</p>
</div>

 `
  const button = document.createElement('button');
  button.className = 'main__btn result__return';
  button.textContent = 'К списку квизов';

  block.append(button);

  main.append(block);
  showElem(block)

  // вернуться к списку квизов
  button.addEventListener('click', () => {
    // location.reload()
    hideElem(block, () => {
      showElem(title);
      showElem(selection);
      initQuiz();
    });
  })


};


// 4ая
// функция создает страницу с вопросами
const renderQuiz = quiz => {


  // создаю блок где будут вопросы
  const questionBox = document.createElement('div')
  questionBox.classList.add('main__box', 'main__box_question')
  hideElem(title);
  hideElem(selection, () => {
    showElem(questionBox)
    main.append(questionBox)
  });



  // счетчик вопросов
  let questionCount = 0;
  //счетчик правильных ответов
  let result = 0;

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
    const answersData = createAnswer(data)
    // console.log('answer000: ', answers);

    const button = document.createElement('button');
    button.classList.add('main__btn', 'question__next');
    button.type = 'submit';
    button.textContent = 'Подтвердить';

    fieldset.append(legend, ...answersData.labels);
    form.append(fieldset, button);
    // вставляю форму в блок
    questionBox.append(form);
    showElem(form)

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
        // const r = answer.every((result, i) => {
        //   return !!result === answersData.keys[i]
        // })

        if (answer.every((result, i) => !!result === answersData.keys[i])) {
          result += 1;
        }

        // console.log(r);

        // проверяет количество вопросов и запускает следующий
        if (questionCount < quiz.list.length) {
          showQuestion()
        } else {
          // questionBox.innerHTML = '<h1>Вопросы кончились</h1>';
          saveResult(result, quiz.id);
          hideElem(questionBox, () => {
            showResult(result, quiz);
          });
          // showResult(result, quiz);

        }

      } else {
        // alert('Вы не выбрали ни одного ответа');
        form.classList.add('main__form-question_error');
        setTimeout(() => {
          form.classList.remove('main__form-question_error');
        }, 6000);
      };
    });
  }

  showQuestion();
}

// 3ая
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

// 0ая
// запуск приложения
const initQuiz = async () => {

  // получаю данные из базы
  const data = await getData();
  console.log('data: ', data);
  // получаю все кнопки
  const buttons = renderTheme(data);

  // навешиваю клики на темы
  addClick(buttons, data);

};

initQuiz();

