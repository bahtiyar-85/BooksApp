import { API } from "./api"

const checkPassword = (password) => {
    if(password.length < 4) {
        return {
            valid : false,
            error : "should be more then 3 symbols"
        }        
    }
    return { valid: true }
}

const checkUserName = (str) => {
    if(str.length < 2) {
        return {
            valid : false,
            error : "should be more then 1 symbols"
        }        
    }
    return { valid: true }
}

const checkNumber = (num) => {
    if(num >= 0){
        return { valid: true}
    } else return {
        valid: false,
        error: "should be positive number"
    }
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
    const firstName = document.querySelector("#firstname")
    const age = document.querySelector("#age")
    return [ loginElem, passElem, passRepeatElem, firstName, age ]
}

export const isFormValid = (inputsElem) => {
    let isFormValid = true
    inputsElem.forEach( input => {
        console.log(input);
        let result
        input.type === "text" && input.required ? result = checkUserName(input.value) : null
        input.type === "password" ? result = checkPassword(input.value) : null
        input.type === "number" ? result = checkNumber(input.value) : null
        input.type === "text" ? result = {valid : true} : null
        result.valid ? null : isFormValid = false
    })
    return isFormValid
}

const getExtendedData = ([,,, firstNameEl, ageEl], obj) => {
    firstNameEl.value ? obj = {...obj, firstName: firstNameEl.value} : null
    ageEl.value ? obj = {...obj, age: ageEl.value} : null
    return obj
}

const cleanInputs = (inputs) => {
    inputs.forEach( input => input.value = "")
}

export const renderFormError = (inputsElem) => {
    inputsElem.forEach(input => {
        let result
        input.type === "text" && input.required ? result = checkUserName(input.value) : null
        input.type === "password" ? result = checkPassword(input.value) : null
        input.type === "number" ? result = checkNumber(input.value) : null
        input.type === "text" ? result = {valid : true} : null
        if(!result.valid){ 
            input.classList.add("input--error")
            alert(result.error)
        }
    })
}

const getUserData = ([loginElem, passwordElem]) => {
    return {
        username : loginElem.value,
        password : passwordElem.value
    }  
}

export const loaderToggle = () => {
    const loader = document.querySelector(".loader")
    loader.classList.toggle("loader--show")
}

const authRequest = async (obj, route) => {
    loaderToggle()
    try {
        const response = await fetch(`${API}/${route}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        if(response.ok) {
            localStorage.setItem('token', data.token)
            window.location.href = 'main.html'
        } else alert(data);  
    } catch (error) {
        alert("Error: ", error)
    } finally { 
        loaderToggle()
    }
     
}

const handlerLoginSubmit = (e) => {
    e.preventDefault()
    const inputsElem = getLoginInputs()
    const isValid = isFormValid(inputsElem)
    if(isValid) {
        authRequest( getUserData(inputsElem), "login")
    } else {
        renderFormError(inputsElem)
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
            const data = getUserData(inputsElem)
            const data2 = getExtendedData(inputsElem, data)
            authRequest( data2 , "signin")
        }
        else alert("Wrong password entered. Please try again")
    } else {
        renderFormError(inputsElem)
    }
}

const toggleModalsShow = () => {
    document.querySelector(".login").classList.toggle("login--show")
    document.querySelector(".signin").classList.toggle("signin--show")
}

export const addFocusListener = (elem) => {
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