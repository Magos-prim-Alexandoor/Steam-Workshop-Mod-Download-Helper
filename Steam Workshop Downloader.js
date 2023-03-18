// ==UserScript==
// @name         Steam Workshop Mod Download Helper
// @namespace    steam_workshop_mod_download_helper
// @version      1
// @description  Adds buttons for downloading mods from the Steam Workshop with one click.
// @author       Магос-прим Alexandoor
// @match        *://steamcommunity.com/workshop/filedetails/?id=*
// @match        *://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

// Получаем Game_ID
let gameID = localStorage.getItem('gameID');
if (!gameID) {
  gameID = prompt('Enter game ID:');
  localStorage.setItem('gameID', gameID);
}

// Создаем кнопки
const downloadBtn = document.createElement('button');
downloadBtn.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
downloadBtn.style.marginTop = '10px';
downloadBtn.style.padding = '10px';
downloadBtn.style.display = 'inline-block';
downloadBtn.style.minWidth = 'auto';
downloadBtn.style.minHeight = 'auto';
downloadBtn.textContent = 'Download';

const addBtn = document.createElement('button');
addBtn.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
addBtn.style.marginTop = '10px';
addBtn.style.padding = '10px';
addBtn.style.display = 'inline-block';
addBtn.style.minWidth = 'auto';
addBtn.style.minHeight = 'auto';
addBtn.textContent = 'Add to file';

const clearBtn = document.createElement('button');
clearBtn.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
clearBtn.style.marginTop = '10px';
clearBtn.style.padding = '10px';
clearBtn.style.display = 'inline-block';
clearBtn.style.minWidth = 'auto';
clearBtn.style.minHeight = 'auto';
clearBtn.textContent = 'Clear file';
clearBtn.style.background = '#f41313';
// Получаем контейнер и добавляем кнопки внутрь
const itemTitle = document.querySelector('.workshopItemTitle');
if (itemTitle) {
  itemTitle.appendChild(downloadBtn);
  itemTitle.appendChild(addBtn);
}

// Создаем кнопку для ввода Game_ID
const gameIDBtn = document.createElement('button');
gameIDBtn.className = 'btn_green_white_innerfade btn_border_2px btn_medium';
gameIDBtn.style.marginTop = '10px';
gameIDBtn.style.padding = '10px';
gameIDBtn.style.display = 'inline-block';
gameIDBtn.style.minWidth = 'auto';
gameIDBtn.style.minHeight = 'auto';
gameIDBtn.textContent = 'Enter game ID';

// Получаем контейнер и добавляем кнопку внутрь
if (itemTitle) {
  itemTitle.appendChild(gameIDBtn);
}

// Обработчик кнопки "Enter game ID"
gameIDBtn.addEventListener('click', () => {
  let gameID = localStorage.getItem('gameID');
  gameID = prompt('Enter game ID:', gameID);
  if (gameID) {
    localStorage.setItem('gameID', gameID);
  }
});

// Обработчик кнопки "Download"
downloadBtn.addEventListener('click', () => {
  const lines = localStorage.getItem('downloadItems');
  if (lines) {
    const file = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameID}_mods.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});

// Обработчик кнопки "Add to file"
addBtn.addEventListener('click', () => {
  const fileID = new URLSearchParams(window.location.search).get('id');
  const line = `workshop_download_item ${gameID} ${fileID}\n`;

  let lines = localStorage.getItem('downloadItems') || '';

  // Проверяем, что строка еще не существует
  if (!lines.includes(line)) {
    lines += line;
    localStorage.setItem('downloadItems', lines);
    alert('Item added successfully');
  } else {
    alert('Item already added');
  }
});
// Получаем контейнер и добавляем кнопку внутрь
if (itemTitle) {
  itemTitle.appendChild(clearBtn);
}

// Обработчик кнопки "Clear file"
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('downloadItems');
});




function getLinkFromDiv(button) {
  // Найти родительский элемент (div) для кнопки
  const div = button.parentNode;

  // Получить ссылку внутри родительского элемента (div)
  const link = div.querySelector('a');

  // Вернуть ссылку
  return link.href;
}

// Создаем чекбокс
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.style.marginRight = '5px';

// Добавляем чекбокс в контейнер с кнопками
if (itemTitle) {
  itemTitle.insertBefore(checkbox, itemTitle.firstChild);
}

// Обработчик изменения состояния чекбокса
checkbox.addEventListener('change', () => {
  // Получаем состояние чекбокса
  const checked = checkbox.checked;

  // Получаем все контейнеры collectionItemDetails
  const collectionItemDetails = document.querySelectorAll('.collectionItemDetails');

  // Для каждого контейнера проверяем, нужно ли добавлять кнопку Add
  collectionItemDetails.forEach(control => {
    // Проверяем, есть ли уже кнопка Add в контейнере
    const addButton = control.querySelector('.add');
    if (checked && !addButton) {
      // Создаем кнопку Add
      const add = document.createElement('button');
      add.className = 'btn_green_white_innerfade btn_border_2px btn_medium add-to-file-btn';
      add.style.marginTop = '10px';
      add.style.padding = '10px';
      add.style.display = 'inline-block';
      add.style.minWidth = 'auto';
      add.style.minHeight = 'auto';
      add.textContent = 'Add';

      // Добавляем обработчик клика на кнопку Add
      add.addEventListener('click', () => {
        var link = getLinkFromDiv(add);
        console.log(link);
        var fileID = link.split("?id=")[1];
        const line = `workshop_download_item ${gameID} ${fileID}\n`;
        let lines = localStorage.getItem('downloadItems') || '';

        // Проверяем, что строка еще не существует
        if (!lines.includes(line)) {
          lines += line;
          localStorage.setItem('downloadItems', lines);
        }
      });

      // Добавляем кнопку Add в контейнер
      control.appendChild(add);
    } else if (!checked && addButton) {
      // Удаляем кнопку Add из контейнера
      addButton.remove();
    }
  });
});
