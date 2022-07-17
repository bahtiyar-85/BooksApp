import { API } from "./api"

const checkPassword = (password) => {
    if(!password) {
        return {
            valid : false,
            error : "field is required"
        }        
    }
    if(password.length < 6) {
        return {
            valid : false,
            error : "should be more then 5 symbols"
        }        
    }
    return { valid: true }
}

const checkUserName = (logStr) => {
    if(!logStr) {
        return {
            valid : false,
            error : "field is required"
        }        
    }
    if(password.length < 3) {
        return {
            valid : false,
            error : "should be more then 2 symbols"
        }        
    }
    return { valid: true }
}

const getLoginInputs = () => {
    const loginElem = document.querySelector("#username")
    const passElem = document.querySelector("#password")
    return [ loginElem, passElem ]
}
const getSigninInputs = () => {
    const loginElem = document.querySelector("#username2")
    const passElem = document.querySelector("#password2")
    const passRepeatElem = document.querySelector("#password3")
    return [ loginElem, passElem, passRepeatElem ]
}
const isFormValid = (inputsElem) => {
    let isFormValid = true
    inputsElem.forEach( input => {
        if(input.type === "text"){
            const result = checkUserName(input.value)
            !result.valid ? isFormValid = false : null
        }
        if(input.type === "password"){
            const result = checkPassword(input.value)
            !result.valid ? isFormValid = false : null
        }
    })
    return isFormValid
}

const rengerFormError = (inputsElem) => {
    inputsElem.forEach(input => {
        if(input.type === "text"){
            const result = checkUserName(input.value) 
            result.valid ? null : input.classList.add("input--error")
        }
        if(input.type === "password"){
            const result = checkPassword(input.value)
            result.valid ? null : input.classList.add("input--error")
        }
    })
}

const getUserData = ([loginElem, passwordElem]) => {
    return {
        username : loginElem.value,
        password : passwordElem.value
    }
}

const authRequest = async (obj, route) => {
    const loader = document.querySelector(".loader")
    loader.classList.add("loader--show")

    // await fetch(`${API}/login`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(obj)
    // })  
    //     .then((response) => {
    //         document.querySelector(".loader").classList.remove("loader--show")
    //         console.log(response);
    //         if (response.ok) {
    //             console.log("status", response.status);
    //         return response.json();
    //         } else {
    //             throw Error(response.statusText);
    //         }
    //     })
    //     .then((data) => {
    //         console.log("json", data);
    //     })
    //     .catch((error) => {
    //         console.log("error", error);
    //     })
    
    try {
        const response = await fetch(`${API}/${route}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        document.querySelector(".loader").classList.remove("loader--show")
        if(response.ok) {
            localStorage.setItem('token',data.token)
            window.location.href = 'main.html'
        }
        else throw Error(data);  
    } catch (error) {
        alert("Error: ", error)
    } 
    
}

const handlerLoginSubmit = (e) => {
    e.preventDefault()
    const inputsElem = getLoginInputs()
    const isValid = isFormValid(inputsElem)
    if(isValid) {
        authRequest( getUserData(inputsElem), "login")
    } else {
        rengerFormError(inputsElem)
    }
}

const isEquel = (elem1, elem2) => elem1.value === elem2.value ? true : false 

const handleSigninSubmit = (e) => {
    e.preventDefault()
    const inputsElem = getSigninInputs()
    const isValid = isFormValid(inputsElem)
    const passEquel = isEquel( inputsElem[1], inputsElem[2]) 
    if(isValid) {
        if(passEquel) {
            authRequest( getUserData(inputsElem), "signin")
        }
        else alert("Wrong password entered. Please try again")
    } else {
        rengerFormError(inputsElem)
    }
}

const toggleModalsShow = () => {
    document.querySelector(".login").classList.toggle("login--show")
    document.querySelector(".signin").classList.toggle("signin--show")
}

const addFocusListener = (elem) => {
    elem?.addEventListener('focus', (e) => e.target.classList.remove("input--error"))
}

export const authInit = () => {
    const loginFormElem = document.querySelector(".login")
    const signinFormElem = document.querySelector(".signin")
    const toggleElems = document.querySelectorAll(".toggle")
    const loginFormInpElems = getLoginInputs()
    const signinFormInpElem = getSigninInputs()

    signinFormInpElem?.forEach(input => addFocusListener(input))
    loginFormInpElems?.forEach(input => addFocusListener(input))
    toggleElems?.forEach(elem => elem.addEventListener('click', toggleModalsShow))
    loginFormElem?.addEventListener('submit', (e) => handlerLoginSubmit(e))
    signinFormElem?.addEventListener('submit', (e) => handleSigninSubmit(e))
}