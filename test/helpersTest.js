const { assert } = require('chai');

const { emailExists, getUserByEmail} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
  it('should return undefined when an invalid email is passed', function() {
    const user = getUserByEmail("fake@example.com", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput);
  });
});


describe('emailExists', function() {
  it('Should return true if email exists in user database', function() {
    const emailExistsInDatabase = emailExists("user@example.com", testUsers)
    const expectedOutput = true;
    // Write your assert statement here
      assert.equal(emailExistsInDatabase, expectedOutput);
  });
  it('Should return false if email does not exist in user database', function() {
    const emailExistsInDatabase = emailExists("fakeuser@example.com", testUsers)
    const expectedOutput = false;
    // Write your assert statement here
      assert.equal(emailExistsInDatabase, expectedOutput);
  });

});

