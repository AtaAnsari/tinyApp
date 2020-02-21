const emailExists = function(email, users) {
  for (Id in users) {
    if (users[Id]["email"] === email) {
      return true
    }
  }
  return false
};

const getUserByEmail = function(email, users) {
  for (id in users) {
    if (users[id]["email"] === email) {
      return users[id].id
    } else {
      return undefined
    }
  }
};


module.exports = {
  emailExists,
  getUserByEmail
}