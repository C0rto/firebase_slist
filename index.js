// firebase base import
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

// basic settings
const appSettings = {
  databaseURL:
    'https://todolist-c8780-default-rtdb.europe-west1.firebasedatabase.app/',
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, 'shoppingList')

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArr = Object.entries(snapshot.val())
    clearShoppingList()
    for (let i = 0; i < itemsArr.length; i++) {
      let currentItem = itemsArr[i]
      appendShoppingList(currentItem)
    }
  } else {
    shoppingEl.innerHTML = '<h3>Ancora nulla da comprare...</h3>'
  }
})

// elements
const inputEl = document.getElementById('input-field')
const buttonEl = document.getElementById('add-button')
const buttonNo = document.getElementById('nts-button')
const shoppingEl = document.getElementById('shopping-list')

// listener
buttonEl.addEventListener('click', () => {
  let inputValue = inputEl.value
  if (inputValue === '') {
    return
  } else {
    let capitalized = capitalizeItem(inputValue)
    console.log(inputValue)
    push(shoppingListInDB, capitalized)
    clearField(inputEl)
    return
  }
})

buttonNo.addEventListener('click', () => {
  Notification.requestPermission().then((perm) => {
    if (perm === 'granted') {
      new Notification('Notifica', {
        body: 'Lista Aggiornata!',
        image: './assets/logo_app.png',
        tag: 'Aggiornamento',
      })
    }
  })
})

const capitalizeItem = (itemStr) => {
  const lower = itemStr.toLowerCase()
  return itemStr.charAt(0).toUpperCase() + lower.slice(1)
}

const clearField = (elem) => {
  elem.value = ''
  return
}

const appendShoppingList = (item) => {
  let itemID = item[0]
  let itemValue = item[1]
  let newEl = document.createElement('li')
  newEl.textContent = itemValue
  shoppingEl.append(newEl)
  newEl.addEventListener('dblclick', () => {
    let itemToRemove = ref(database, `shoppingList/${itemID}`)
    remove(itemToRemove)
  })
}
const clearShoppingList = () => {
  shoppingEl.innerHTML = ''
  return
}
