
import { API } from "./api"

const deleteRequest = async (id) => {
    try {
        const response = await fetch(`${API}/books/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            }
        })
        const data = await response.json();
        if(response.ok) {
            queryBooks()
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    }    
}


const handlerDelete = (e) => {
    const id = e.currentTarget.parentNode.parentNode.id
    e.stopPropagation()
    deleteRequest(id)
}
const handlerLikes = e => {
    const id = e.currentTarget.parentNode.parentNode.id
    e.stopPropagation()
}

const addListeners = () => {
    const deleteBtns = document.querySelectorAll(".garbage")
    const favBtns = document.querySelectorAll(".favorite")
    favBtns?.forEach(item => item.addEventListener("click", (e) => handlerLikes(e)))
    deleteBtns?.forEach(item => item.addEventListener("click", (e) => handlerDelete(e)))
}

const queryBooks = async () => {
    try {
        const response = await fetch(`${API}/books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': getToken()
            }
        })
        const data = await response.json();
        if(response.ok) {
            renderBooks(data)
            addListeners()
        } else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    } 
}

const renderBooks = (books) => {
    const elem = document.querySelector(".main__contant")
    elem.innerHTML = ""
    books.forEach( book => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.id = book.id
        card.innerHTML = `
            <h4 class="card__name">${book.name}</h4>
            <p class="card__author">${book.author}</p>`
        if(book.isFavorite){
            card.innerHTML += `
            <div class=card__items>
                <svg class="favorite" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="favorite__path" fill-rule="evenodd" clip-rule="evenodd" d="M2 8.60555C2 5.50969 4.50969 3 7.60555 3C8.71223 3 9.79414 3.32758 10.715 3.94145L12 4.79815L13.285 3.94145C14.2059 3.32758 15.2878 3 16.3944 3C19.4903 3 22 5.50969 22 8.60555V9.34382C22 11.3098 21.219 13.1952 19.8289 14.5853L14.1213 20.2929C12.9497 21.4645 11.0503 21.4645 9.87868 20.2929L4.1711 14.5853C2.78097 13.1952 2 11.3098 2 9.34382V8.60555Z" fill='grey'/>
                </svg>
                <img class="garbage" src="https://icon-library.com/images/trash-icon/trash-icon-28.jpg" alt="">
            </div>
            ` 
        } else {
            card.innerHTML += `
            <div class=card__items>
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

const hideModal = (classname) => {
    const elem = document.querySelector(`.${classname}`)
    elem.classList.remove(`${classname}--show`)
}


const postRequest = async (obj) => {
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
      
        if(response.ok) {
            hideModal('add-book')
            queryBooks()
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    }    
}

const handlerAddBook = (e) => {
    e.preventDefault()
    const newBook = getNewBookData( getAddInputs())
    postRequest(newBook)
}

export const mainInit = () => {
    const addBtn = document.querySelector('.main__add-btn')
    const addBookForm = document.querySelector(".add-book__form")
   
    addBookForm?.addEventListener("submit", (e) => handlerAddBook(e))
    addBtn.addEventListener('click', () => {
        const modal = document.querySelector(".add-book")
        modal.classList.add("add-book--show")
    })
    queryBooks()
}