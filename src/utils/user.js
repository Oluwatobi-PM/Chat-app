const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data

    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        if(user.room === room && user.username === username || id === user.id){
            return true
        }
    })

    if(existingUser){
        return{
            error: 'User is in use!'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

addUser({
    id: 32,
    username: 'oibi',
    room: "Philly"
})

addUser({
    id: 37,
    username: 'oibi',
    room: "Philly"
})

addUser({
    id: 36,
    username: 'oiybi',
    room: "Philly"
})

addUser({
    id: 56,
    username: 'oiygbi',
    room: "Philly"
})


addUser({
    id: 35,
    username: 'hoiygbi',
    room: "Philly"
})
// console.log(users)


 const removedUser = removeUser(22)

// console.log(removedUser)

// const getUser = (id) => {
//     const index = users.findIndex((user) => {
//         return user.id === id
//     })
//     if(index !== -1){
//         return users[index]
//     }
// }

const getUser = (id) => {
    return users.find((user) => user.id === id)
}
 const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const foundUser = getUser(35)
console.log(foundUser)

const usersInRoom = getUsersInRoom("Philly")
console.log(usersInRoom)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}