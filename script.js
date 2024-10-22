const inputEl = (document.getElementsByClassName('app__controls-input'))[0]; /*возвращает 1 элемент коллекции*/ /*способ получить доступ к элементам на веб-странице*/
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]; /*возвращает 1 элемент коллекции*/ /*позволяет получить доступ к кнопке на веб-странице и добавить к ней обработчик событий*/
const listEl = (document.getElementsByClassName('app__list'))[0]; /*возвращает 1 элемент коллекции*/ /*позволяет получить доступ к списку на веб-странице и добавлять в него новые элементы*/

let counter = 1;

function loadData() { /*загрузка данных из локального хранилища браузера*/
    const savedData = localStorage.getItem('tasks'); /*метод обращается к локальному хранилищу браузера и пытается получить данные, сохраненные под ключом 'tasks'*/
    return savedData ? JSON.parse(savedData) : []; /*тернарный оператор для проверки, есть ли сохраненные данные*/
}

const data = loadData(); /*возвращает либо массив задач, сохранённых в локальном хранилище, либо пустой массив, если данных нет*/

data.forEach((item) => {  /*перебирает каждый элемент массива data, передавая текущий элемент в качестве аргумента функции*/
    if (item.id >= counter) { /*проверяет, если идентификатор текущего элемента (item.id) больше или равен значению переменной counter*/
        counter = item.id + 1;
    }
});

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(data)); /*Локальное хранилище: localStorage позволяет сохранять данные в браузере без срока действия*/
    /*JSON.stringify(data) преобразует объект JS в строку формата JSON*/
}

function createTask(objectData) { /*'createTask' предназначена для создания элемента задачи в пользовательском интерфейсе*/
    const root = document.createElement('div'); /*Создание корневого элемента*/
    root.classList.add('app__list-item');

    if (objectData.isDone) { /*Если задача выполнена (isDone), добавляется соответствующий класс*/
        root.classList.add('app__list-item_done');
    }

    const input = document.createElement('input'); /*Создание элемента чекбокса; он позволяет отметить задачу как выполненную:*/
    input.classList.add('app__list-checkbox');
    input.type = 'checkbox';

    if (objectData.isDone) {
        input.checked = true;
    }

    const txt = document.createElement('p'); /*Создание текстового элемента*/
    txt.classList.add('app__list-item-text');
    txt.innerText = objectData.text;

    const btn = document.createElement('button'); /*Создание кнопки удаления*/
    btn.classList.add('app__list-btn');

    const img = document.createElement('img')
    img.src = './trash.svg'
    img.alt = 'trash'
    img.width = 30

    btn.appendChild(img); /*позволяет динамически добавлять изображение*/

    btn.addEventListener('click', (event) => { /*Обработка события для удаления задачи; При нажатии на кнопку удаления вызывается функция deleteTask*/
        event.stopPropagation();
        deleteTask(objectData.id);
    });

    root.addEventListener('click', () => toggleTaskState(objectData.id)); /*addEventListener добавляет обработчик события клика на корневой элемент задачи (root)*/
    /*toggleTaskState отвечает за переключение состояния выполнения задачи*/

    root.appendChild(input); /*элементы добавляются в корневой элемент*/
    root.appendChild(txt);
    root.appendChild(btn);

    return root;
}

function deleteTask(id) { /*Функция принимает идентификатор задачи (id) и ищет индекс этой задачи в массиве data с помощью метода findIndex. Если задача найдена, возвращается её индекс, иначе возвращается -1.*/
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) { /*Если индекс не равен -1, это означает, что задача существует в массиве*/
        data.splice(index, 1); /*Если задача найдена, она удаляется из массива с помощью метода splice, который изменяет содержимое массива, удаляя или добавляя элементы.*/
        saveData(); /*сохранение текущего состояния данных*/
        render(); /*обновляет отображение задач на экране*/
    }
}

function toggleTaskState(id) { /*функция обновляет статус задачи и пользовательский интерфейс*/
    const task = data.find(item => item.id === id); /*Функция принимает идентификатор задачи (id) и ищет соответствующий объект в массиве data с помощью метода find.
    Если задача найдена, то возвращается объект задачи, иначе возвращается undefined*/
    if (task) { /*Если задача найдена (то есть переменная task не равна undefined), происходит изменение её состояния*/
        task.isDone = !task.isDone; /*Статус выполнения задачи (isDone) переключается на противоположный с помощью логического оператора "!"*/
        saveData(); /*сохраняет текущее состояние данных */
        render(); /*обновляет отображение задач на экране*/
    }
}

btnEl.addEventListener('click', () => { /*Обработчик события click добавляется на элемент кнопки btnEl*/
    const textValue = inputEl.value; /*Значение, введенное пользователем в текстовое поле (inputEl), сохраняется в переменной textValue*/
    data.push({ /*Новый объект задачи создается с уникальным идентификатором, текстом задачи и состоянием выполнения*/
        id: counter++,
        text: textValue,
        isDone: false
    });
    saveData(); /*сохраняет текущее состояние данных */
    render(); /*обновляет отображение задач на экране*/
    
    inputEl.value = ''; /*После добавления задачи поле ввода очищается*/
});

function render() { /*отвечает за обновление пользовательского интерфейса, отображая текущий список задач*/
    listEl.innerHTML = ''; /*Очистка списка задач*/
    for (let item of data) { /*функция проходит по каждому элементу массива data, представляющему задачи*/
        const tmpEl = createTask(item); /*Для каждого элемента массива вызывается функция createTask, которая создает HTML-элемент для задачи*/
        listEl.appendChild(tmpEl); /*Созданный элемент задачи добавляется в элемент списка (listEl)*/
    } 
}

render(); /*обновляет отображение задач на экране*/