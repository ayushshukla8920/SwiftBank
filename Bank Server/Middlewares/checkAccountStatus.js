const user = require('../Models/user');
async function handleAccountStatus(cID){
    const result = await user.find({customerId: cID});
    if (result[0].accStatus == 'ACTIVE'){
        return 1;
    }
    return 0;
}

module.exports = {
    handleAccountStatus,
};