const emailExists = function(email, users) {
  for (Id in users) {
    if (users[Id]["email"] === email) {
      return true
    }
  }
  return false
};



module.exports = {
  emailExists
}