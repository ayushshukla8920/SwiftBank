## Available API's 

### GET - /api/users/:customerID
Returns the Details of the User




### POST - /api/users/
body : {firstName,lastName,dateOfBirth,mobNo,email,password,gender,address,pinCode,panNo,aadharNo,accType}

Creates a New Account in the Bank




### GET - /api/userBalance/:customerId
Returns the Balance of the User




### GET - /api/transaction/:customerId
Returns the Transaction History of the User




### POST - /api/transaction/
body : {account,accNo,transactionMode,transactionAmount}

To initiate a Money Transfer in any Account
