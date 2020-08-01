'use strict';

// Обьявляю массив обьектов.
const generalArray = [{
        country: 'Ukraine',
        city: ['Kiev', 'Lviv', 'Mariupol', 'Odessa']
    },
    {
        country: 'USA',
        city: ['Wyoming', 'Alabama', 'Nevada']
    },
    {
        country: 'France',
        city: ['Paris', 'Bordeaux', 'Nice']
    }
];
const arrayLength = generalArray.length;


// Заполняю select именами из обьекта
generalArray.forEach(function(item, i) {
    $('.countries-select').append(`<option value="${i}">${item.country}</option>`)
})

// Обработчик выбора option
$(document).on('change', '.countries-select', function() {
    createNewSelect($(this).val(), $(this).parent(), $(this));
});
// Добавление нового блока с select без выбраных имен
$(document).on('click', '.add', function() {
    createNewBox($(this).parent());
});
// Кнопка удаления сощданного select
$(document).on('click', '.clear', function() {
    $(this).parent().children('.countries-select').val('null');
    $(this).parent().children('.countries-select').find(`option[isSelect = true]`).attr('isSelect', false);
    $(this).parent().children('.countries-select').find(`option`).attr('disabled', false);
    if (!$(this).parent().hasClass('js__main')) {
        $(this).parent().remove();
    } else {
        return 0;
    }
});

// Функция котрая создает новый select с значениями выбранной страны
function createNewSelect(country, box, thisSelect) {
    // Запрещаю клик по уже выбранной стране
    thisSelect.find(`option[value = ${country}]`).attr('disabled', true);
    // Атрибут для скрытия выбранных option при создании нового блока с select
    thisSelect.find(`option[value = ${country}]`).attr('isSelect', true);

    // Получаю индекс страны и возвращаю обьект со значениями из массива
    let selected = generalArray.filter(function(item, i) {
        return i == country;
    });
    // Перебираю обьект и созданю новый блок и кладу в него select c городами
    for (let key in selected) {
        let name = selected[key].country;
        box.append(`<div class="select-box__new ${name}"></div>`);
        let newBox = box.children(`.select-box__new.${name}`);
        newBox.append(`
            <select class="new-select__${name}" name="${name}"><option value="${name}" disabled>${name}</option></select>
            <button type="button" value="${country}" data-name="${name}" class="delete-btn">Del</button>
        `);
        // Перебираю значения обьекта и наполняю ими новосозданный select
        selected[key].city.forEach(function(item, i) {
            $(`select[name="${name}"]`).append(`<option value="${item}">${item}</option>`);
        });
        // Инициализация select2 для нового select
        $(`select[name="${name}"]`).select2({
            multiple: true
        });
    }
};

// Обработчик нажатия кнопки del у новго select
$(document).on('click', '.delete-btn', function() {
    removeThisSelect($(this), $(this).attr('data-name'));
});

function removeThisSelect(btn, name) {
    btn.parent().parent().find('.countries-select').val('null');
    btn.parent().parent().find('.countries-select').find(`option[value=${btn.val()}]`).attr('disabled', false);
    btn.parent().parent().find('.countries-select').find(`option[value=${btn.val()}]`).attr('isSelect', false);
    $(`.select-box__new.${name}`).remove();
}

function createNewBox(parent) {
    const boxLength = $('.select-box').length + 1;
    const disabledSelect = $('option[isSelect = "true"]').length;
    const howMuchIsLeft = (arrayLength + 1) - disabledSelect;
    if (howMuchIsLeft != 0) {
        console.log(howMuchIsLeft);
        $('.container').append(`<div class="select-box" id="new-box${boxLength}"></div>`);
        let select = parent.children('.countries-select').clone();
        select.appendTo(`#new-box${boxLength}`);
        $(`#new-box${boxLength}`).find('option[isSelect = "true"]').hide();
        $(`<button class="add">Add</button><button class="clear">Del</button>`).appendTo(`#new-box${boxLength}`);
    } else {
        return 0;
    }
}



// TODO
// * Создать массив обьектов
// * Инициировать select и заполнить его именами из массива обьектов
// * При смене, получить порядковый номер обьекта в массиве.
// * Через фильтр найти этот номер в массиве и вернуть значения городов.
// * При выборе option создать новый select с элементами значений данного имени
// * После выбора страны - блокировать ее повторный выбор (пока новый селект с городами существует)
// ! У каждого созданного select должна быть кнопка Del - которая должна удалять этот select