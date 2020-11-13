
const getUserByEmail = function(email, database) {
    //  console.log("finding user by email");
  for (user in database) {
//    console.log(user);
    if (database[user].email === email) {
       return database[user];
    }
  }
  return undefined;
};






/*  still now working yet */
// function generateRandomString(length) {
//     const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++ ) {
//         result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
//     }
//     return result;
// }  

module.exports = { getUserByEmail }