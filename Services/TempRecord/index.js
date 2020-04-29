const UserModel = require('../../DB/Models').UserModel
const moment = require('moment')
async function createUser(data) {
    // const {id, first_name } = data
    console.log(data)
    const User = new UserModel(data);
    return User.save();
}

async function getUser(ID) {
    console.log('looking for User in DB')
    return UserModel.findOne({ UserID: ID});
}

async function addUserTemp(id, temp) {

    // const User = await getUser(ID)
    // User.tempMeasurement.push([new Date(), temp])
    const User = await getUser(id);
    // User.update( {$push: {tempMeasurement: [new Date(), temp]}});
    console.log(User)
    console.log(moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]'))
    User.tempMeasurement.push([moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]'),temp])
    User.lastTempMeasured = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]')
    return User.save()
    // UserModel.save()
}

async function getUserTemp() {

}

async function sendUserTemp() {

}



module.exports = {
   addUserTemp,
    getUserTemp,
    sendUserTemp,
    createUser
};