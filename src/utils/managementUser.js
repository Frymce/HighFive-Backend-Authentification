const users = require('../db/users')

const searchUser = (email) =>{
    const user = users.find( u => u.email === email)
    return user
}

module.exports = {
    searchUser
}