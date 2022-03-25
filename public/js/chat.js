const socket = io() 
// const{addUser, removeUser, getUser, getUsersInRoom} = require('../../src/utils/user')

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')
const $url = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix: true})
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight =$newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight = $messages.offsetHeight


    //Height of messages container
    const containerHeight =$messages.scrollHeight

    //How far have I scrolled?
    const scrollOffset =$messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset +1) {
        $messages.scrollTop = $messages.scrollHeight
    } 


    // console.log(newMessageStyles)
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        name: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(urlTemplate, {
        name: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
        })
        $url.insertAdjacentHTML('beforeend', html)
        autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', "disabled")
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error) {
            return console.log(error)
        }
        console.log('The message was delivered')
    } )
})

$sendLocation.addEventListener('click', () => {
    $sendLocation.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (acknowledge) => {
            console.log("Location Shared!")
            $sendLocation.removeAttribute('disabled')
        }) 

    })
})

socket.on('roomData', ({room,users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', {username,room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

// socket.on("message", (message) => {
//     console.log(message)
// })