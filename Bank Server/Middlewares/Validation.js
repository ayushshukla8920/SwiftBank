async function handleValidationChecks(body){
    if (!body.email.includes('@')) {
        return "Email must contain '@'";
    }
    const parts = body.email.split('@');
    if (parts.length !== 2 || parts[0].trim() === "" || parts[1].trim() === "") {
        return "Email format is incorrect";
    }
    if (!parts[1].includes('.')) {
        return "Email domain must contain a '.'";
    }
    if (body.mobNo.length!=10){
        return "Invalid Mobile Number";
    }
    if (body.gender.toLowerCase()!='male' && body.gender.toLowerCase()!='female' && body.gender.toLowerCase()!='other'){
        console.log(body.gender.toLowerCase())
        return "Please specify correct Gender";
    }
    return 1;
}

module.exports = {
    handleValidationChecks,
}
