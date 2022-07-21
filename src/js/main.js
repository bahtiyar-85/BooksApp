
import { API } from "./api"
import { loaderToggle } from "./auth"
import { isFormValid } from "./auth"
import { renderFormError } from "./auth"
import { addFocusListener } from "./auth"

const getRequest = async (id="") => {
    let api
    id ? api = `${API}/books/${id}` : api = `${API}/books`
    return await fetch( api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth': getToken()
        }})
            .then(response => response.json()) 
}

const requestDelete = async (id) => {
   loaderToggle()
    try {
        const response = await fetch(`${API}/books/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            }
        })
        const data = await response.json();
        loaderToggle()
        if(response.ok) {
            requestGetBooks()
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    }    
}

const requestPut = async (id, obj) => {
    try {
        await fetch(`${API}/books/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            },
            body: JSON.stringify(obj)
        })
    } catch (error) {
        alert("Error: ", error)
    }    
}

const requestGetBooks = async () => {
        loaderToggle()
        getRequest()
            .then(data => {
                renderBooks(data)
                addListeners()
            })
            .catch(error => alert("Error", error))
            .finally(() => loaderToggle())
}


const handlerDelete = (e) => {
    const id = e.currentTarget.parentNode.parentNode.id
    e.stopPropagation()
    requestDelete(id)
}

const handlerLikes = (e) => {
    const id = e.currentTarget.parentNode.parentNode.id
    e.stopPropagation()
    const obj = { isFavorite: !e.currentTarget.classList.contains("liked")}
    e.currentTarget.classList.toggle("liked")
    requestPut( id, obj )
}

const getUpdateInputs = () => {
    const name = document.querySelector("#name2")
    const author = document.querySelector("#author2")
    return [name, author] 
}

const renderUpdate = (book) => {
    const [nameElem, authorElem] = getUpdateInputs()
    const isFav = document.querySelector('#favorite1')
    const updateBtn = document.querySelector(".update-book__btn")

    updateBtn.id = book.id
    nameElem.value = book.name
    authorElem.value = book.author
    book.isFavorite ? isFav.classList.add("liked") : isFav.classList.remove("liked")
}


const handlerUpdate = (e) => {
    const id = e.currentTarget.id
    loaderToggle()
    getRequest(id)
        .then(data => renderUpdate(data))
        .catch(error => alert("Error", error))
        .finally(() => loaderToggle())
    toggleModal("update-book") 
}

const handlerUpdateSubmit = (e) => {
    e.preventDefault()
    const [ name, author ] = getUpdateInputs()
    const isFav= document.querySelector('#favorite1')
    const id = document.querySelector(".update-book__btn").id
    const obj = {
        name: name.value,
        author: author.value,
        isFavorite : isFav.classList.contains("liked")
    }
    requestPut(id, obj)
    requestGetBooks() 
    toggleModal('update-book')
}

const addListeners = () => {
    const deleteBtns = document.querySelectorAll(".garbage")
    const favBtns = document.querySelectorAll(".favorite")
    const cards = document.querySelectorAll(".card")

    cards.forEach(item => item.addEventListener("click", (e) => handlerUpdate(e)))
    favBtns?.forEach(item => item.addEventListener("click", (e) => handlerLikes(e)))
    deleteBtns?.forEach(item => item.addEventListener("click", (e) => handlerDelete(e)))
}

const renderBooks = (books) => {
    const elem = document.querySelector(".main__contant")
    elem.innerHTML = ""
    if(books.length === 0) {
        elem.innerHTML = `<h4 class="title">List is empty</h4>`
        return 0
    }
    books.forEach( book => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.id = book.id
        card.innerHTML = `
            <h4 class="card__name">${book.name}</h4>
            <p class="card__author">${book.author}</p>`
        if(book.isFavorite){
            card.innerHTML += `
            <div class="card__items">
                <svg class="favorite liked" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path  fill-rule="evenodd" clip-rule="evenodd" d="M2 8.60555C2 5.50969 4.50969 3 7.60555 3C8.71223 3 9.79414 3.32758 10.715 3.94145L12 4.79815L13.285 3.94145C14.2059 3.32758 15.2878 3 16.3944 3C19.4903 3 22 5.50969 22 8.60555V9.34382C22 11.3098 21.219 13.1952 19.8289 14.5853L14.1213 20.2929C12.9497 21.4645 11.0503 21.4645 9.87868 20.2929L4.1711 14.5853C2.78097 13.1952 2 11.3098 2 9.34382V8.60555Z" fill='grey'/>
                </svg>
                <img class="garbage" src="https://icon-library.com/images/trash-icon/trash-icon-28.jpg" alt="">
            </div>
            ` 
        } else {
            card.innerHTML += `
            <div class="card__items">
                <svg class="favorite" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 8.60555C2 5.50969 4.50969 3 7.60555 3C8.71223 3 9.79414 3.32758 10.715 3.94145L12 4.79815L13.285 3.94145C14.2059 3.32758 15.2878 3 16.3944 3C19.4903 3 22 5.50969 22 8.60555V9.34382C22 11.3098 21.219 13.1952 19.8289 14.5853L14.1213 20.2929C12.9497 21.4645 11.0503 21.4645 9.87868 20.2929L4.1711 14.5853C2.78097 13.1952 2 11.3098 2 9.34382V8.60555Z" fill='grey'/>
                </svg>
                <img class="garbage" src="https://icon-library.com/images/trash-icon/trash-icon-28.jpg" alt="">
            </div>
            ` 
        }
        elem.append(card)
    }) 
} 

const getToken = () => localStorage.getItem("token") || ""

const getAddInputs = () => {
    const name = document.querySelector("#name")
    const author = document.querySelector("#author")
    return [name, author]
}

const getNewBookData = ([name, author]) => {
    return {
        name: name.value,
        author: author.value
    }
} 

const toggleModal = (classname) => {
    const elem = document.querySelector(`.${classname}`)
    elem.classList.toggle(`${classname}--show`)
}

const requestPost = async (obj) => {
    loaderToggle()
    try {
        const response = await fetch(`${API}/books/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        loaderToggle()
        if(response.ok) {
            toggleModal('add-book')
            requestGetBooks()
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    }    
}

const handlerAddBook = (e) => {
    e.preventDefault()
    const addInputs = getAddInputs()
    if( isFormValid(addInputs)) {
        const newBook = getNewBookData(addInputs)
        requestPost(newBook)
    } else {
        renderFormError(addInputs)
    }
}

const renderUsername = (username) => document.querySelector(".header__user").textContent = username

const requestGetME = async () => {
    loaderToggle()
    try {
        const response = await fetch(`${API}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            }
        })
        const data = await response.json();
        loaderToggle()
        if(response.ok) {
            renderUsername(data.username)
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    }    
}


export const mainInit = () => {
    if(getToken()) {
        const addBtn = document.querySelector('.main__add-btn')
        const addBookForm = document.querySelector(".add-book__form")
        const deleteBookBtn = document.querySelector("#garbage1")
        const isFavorite = document.querySelector('#favorite1')
        const updateBookSubmit = document.querySelector(".update-book__form")
        const signoutBtn = document.querySelector(".header__signout")
        const closeAddModal = document.querySelector(".add-book__close") 
        const closeUpdateModal = document.querySelector(".update-book__close") 
        const addInputsElem = getAddInputs()

        requestGetBooks()
        requestGetME()
        addInputsElem?.forEach(input => addFocusListener(input))
        closeUpdateModal?.addEventListener("click", () => toggleModal("update-book"))
        closeAddModal?.addEventListener("click", () => toggleModal("add-book"))
        isFavorite?.addEventListener('click', (e) => e.currentTarget.classList.toggle("liked"))
        addBookForm?.addEventListener("submit", (e) => handlerAddBook(e))
        addBtn?.addEventListener('click', () =>  toggleModal("add-book"))
        updateBookSubmit?.addEventListener("submit", (e) => handlerUpdateSubmit(e))
        deleteBookBtn?.addEventListener("click", () => {
            const id = document.querySelector(".update-book__btn").id
            requestDelete(id)
            toggleModal('update-book')
        })
        signoutBtn?.addEventListener("click", () => {
            window.location.href = "index.html" 
        })
        window.onbeforeunload = () => localStorage.removeItem('token');
    } else {
        window.location.pathname.includes('main.html') ? window.location.href = "index.html" : null 
    }
}