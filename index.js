const express = require("express");
const cors = require("cors");
const unirest = require("unirest");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const Parity = require("./db/Parity");
const Period = require("./db/Period");
const Account = require("./db/Account");
const Bankdetails = require("./db/Bankdetails");
const Address = require("./db/Address");
const Complaints = require("./db/Complaints");
const Balance = require("./db/Balance");
const app = express();
const jwt = require("jsonwebtoken");
const jwtKey = "fullkhello";
let json = {};
app.use(express.json());
app.use(cors());


/* Get Method  10-11-2022 */

//Start Get last period

app.get("/getLastPeriod", async (req, res) => {
    let perioddata = await Period.findOne({}, {}, { sort: { 'createddate': -1 } });
    let period = perioddata.period;
    let response = {
        code: 200,
        message: "Get successfully record...",
        period: period
    };
    res.send(response);
});
//End 

//Start ger balance

app.post("/getBalance", async (req, res) => {
    let mobile = req.body.mobile;
    Balance.aggregate(
        [
            {
                "$match": {
                    "mobile": parseInt(mobile)
                }
            },
            {
                $group: {
                    _id: "$mobile",
                    total: {
                        $sum: "$totalBallance"
                    }
                }
            }
        ],
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                let response = {
                    code: 200,
                    data: result[0],
                    message: "Get record",
                };
                res.send(response);
            }
        }
    );

});

//End


//Get Last Paritie
app.get("/getLastParity", async (req, res) => {
    let paritydata = await Parity.findOne({}, {}, { sort: { 'createddate': -1 } });
    let period = paritydata.period;
    let response = {
        code: 200,
        message: "Get successfully record...",
        period: period
    };
    res.send(response);
});
//End

//Get all parities

app.get("/getParity", async (req, res) => {
    let paritydata = await Parity.find(req.body);
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: paritydata
    };
    res.send(response);
});

//End

//Get all Bank details

app.get("/getBankdetails", async (req, res) => {
    let bankdata = await Bankdetails.find(req.body);
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: bankdata
    };
    res.send(response);
});

//End

/* All Post Methods 10-11-2022 */


//Start Register Api
app.post("/register", async (req, res) => {
    let userdata = await User.findOne(req.body);
    if (userdata) {
        let response = {
            code: 404,
            message: "Record allready match",
        };
        res.send(response);
    } else {
        let user = new User(req.body);
        let result = await user.save();
        let response = {
            code: 201,
            data: result,
            message: "Record has been saved",
        };
        res.send(response);
    }
});
//End Register Api

//Start Login Api

app.post("/login", async (req, res) => {
    let userdata = await User.find({
        mobile: req.body.mobile,
        password: req.body.password,
    });
    if (userdata.length > 0) {
        jwt.sign({ userdata }, jwtKey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                let response = {
                    code: 404,
                    message: "Please enter valid token",
                };
                res.send(response);
            } else {
                let response = {
                    code: 201,
                    token: token,
                    data: userdata,
                    message: "Login successfully",
                };
                res.send(response);
            }
        });
    } else {
        let response = {
            code: 404,
            message: "Please enter valid credentials",
        };
        res.send(response);
    }
});

//End Login Api

//Start Forgotpass Api

app.post("/forgotpass", async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) {
        let response = {
            code: 404,
            message: "password not reset sucessfully.",
        };
        res.send(response);
    } else {
        user.password = req.body.newpassword;
        await user.save();
        let response = {
            code: 200,
            message: "password reset sucessfully.",
        };
        res.send(response);
    }
});

//End Forgotpass Api

//Start SentOtp api

app.post("/sentOpt", (req, res) => {
    let mobileNumber = req.body.mobile;
    sentOtp(mobileNumber, res);

});
//End sentopt Api

//Start mobile check api
app.post("/mobilecheck", async (req, res) => {
    let userdata = await User.findOne(req.body);
    if (userdata) {
        res.send({ is_exists: 1 });
    } else {
        res.send({ is_exists: 0 });
    }
});
//End

//Start Product add api

app.post("/addProduct", async (req, res) => {
    //let productData = await Product.findOne(req.body);
    let product = new Product(req.body);
    let result = await product.save();
    let response = {
        code: 201,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End

//Start Get Bankdetails By id api
app.post("/getBankdetailsById", async (req, res) => {
    let bankdata = await Bankdetails.find({ _id: req.body.id }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: bankdata
    };
    res.send(response);
});
//End
//Start Add Complaints api
app.post("/Addcomplaints", async (req, res) => {
    //let productData = await Product.findOne(req.body);
    let complaint = new Complaints(req.body);
    let result = await complaint.save();
    let response = {
        code: 201,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});

//End

//Start Get components By id

app.post("/getComplaintsById", async (req, res) => {
    let complaintsdata = await Complaints.find({ _id: req.body.id }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: complaintsdata
    };
    res.send(response);
});

//End

//Start Get With components
app.post("/getWaitComplaints", async (req, res) => {
    let complaintsdata = await Complaints.find({ userid: req.body.userid, status: false }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: complaintsdata
    };
    res.send(response);
});

//End
//Start Get All address

app.post("/getAddress", async (req, res) => {
    let  Addressdata = await Address.find({ userid: req.body.userid }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: Addressdata
    };
    res.send(response);
});

//End

//Start Get Bankdetails By id api
app.post("/getAddressById", async (req, res) => {
    let addressdata = await Address.find({ _id: req.body.id }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: addressdata
    };
    res.send(response);
});
//End

//Start Get Completed components api
app.post("/getComplatedComplaints", async (req, res) => {
    let complaintsdata = await Complaints.find({ userid: req.body.userid, status: true }, {}, { sort: { 'createddate': -1 } });
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: complaintsdata
    };
    res.send(response);
});

//End

//Start add Address api
app.post("/addAddress", async (req, res) => {
    //let productData = await Product.findOne(req.body);
    let address = new Address(req.body);
    let result = await address.save();
    let response = {
        code: 201,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End


//Start Add Period Api 

app.post("/addPeriod", async (req, res) => {
    let period = new Period(req.body);
    let result = await period.save();
    let response = {
        code: 201,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});

//End

//Start Add Bankdetails api

app.post("/addBankdetails", async (req, res) => {
    let bankdetails = new Bankdetails(req.body);
    let result = await bankdetails.save();
    let response = {
        code: 201,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End

//Start Add Parity api

app.post("/addParity", async (req, res) => {
    let parity = new Parity(req.body);
    let result = await parity.save();
    let response = {
        code: 200,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End

//Start Get My Parity record api
app.post("/getMyParityRecord", async (req, res) => {
    //let paritydata = await Parity.find(req.body);
    let paritydata = await Parity.find({ usermobile: req.body.usermobile }).exec();
    let response = {
        code: 200,
        message: "Get successfully record...",
        data: paritydata
    };
    res.send(response);

});
//End

//Start add account api
app.post("/addAccount", async (req, res) => {
    let account = new Account(req.body);
    let result = await account.save();
    let response = {
        code: 200,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End

//Start add balance api
app.post("/addbalance", async (req, res) => {
    let balance = new Balance(req.body);
    let result = await balance.save();
    let response = {
        code: 200,
        data: result,
        message: "Record has been saved",
    };
    res.send(response);
});
//End

/* End All Post Method  */


/* Start Put Method  10-11-2022 */

//Start updateParity with amount api
app.put('/updateParityWithAmount', async (req, res) => {
	let period = req.body.period;
    let result = req.body.result;
    let mobile = req.body.mobile;
	let paritydata = await Parity.find({ usermobile: parseInt(mobile),period:parseInt(period) }).exec();
	let price = paritydata[0].price;
	let winamount = Math.floor((price*1.85));
	
	Balance.find({ mobile: parseInt(mobile) }, {}, { sort: { 'createddate': -1 } }, (err, result1) => {
        if (err) {
            res.send('some error')
        }
        if (result1 == [] || result1 == null || result1 == undefined || result1 == {} || result1 == '[]') {
            res.send('blankdata')
        } else {
            Balance.aggregate(
                [
                    {
                        "$match": {
                            "mobile": parseInt(mobile)
                        }
                    },
                    {
                        $group: {
                            _id: "$mobile",
                            total: {
                                $sum: "$totalBallance"
                            }
                        }
                    }
                ],
                function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        const query = { mobile: parseInt(mobile) };
                        balact = parseInt(result[0].total) + parseInt(Math.floor(winamount));
                        Balance.updateMany(query, { "$set": { "totalBallance": balact } }, function (err, ress) {
                            if (err) {
                                let response = {
                                    code: 404,
                                };
                                res.send(response);
                            } else {
                                let response = {
                                    code: 200,
                                    balact: balact
                                };
                                res.send(response);
                            }
                        })

                    }
                }
            );
        }
    });
	
});
app.put('/updateParity', (req, res) => {
    let period = req.body.period;
    let result = req.body.result;
    let mobile = req.body.mobile;
	//let paritydata = await Parity.find({ usermobile: mobile }).exec();
    const query = { period: period };
    var color = '';
    switch (result) {
        case 0:
            color = 'http://localhost:8100/assets/images/redviolet.png';
            break;
        case 1:
            color = 'http://localhost:8100/assets/images/greenimg.png';
            break;
        case 2:
            color = 'http://localhost:8100/assets/images/redimg.png';
            break;
        case 3:
            color = 'http://localhost:8100/assets/images/greenimg.png';
            break;
        case 4:
            color = 'http://localhost:8100/assets/images/redimg.png';
            break;
        case 5:
            color = 'http://localhost:8100/assets/images/greenviolite.png';
            break;
        case 6:
            color = 'http://localhost:8100/assets/images/redimg.png';
            break;
        case 7:
            color = 'http://localhost:8100/assets/images/greenimg.png';
            break;
        case 8:
            color = 'http://localhost:8100/assets/images/redimg.png';
            break;
        case 9:
            color = 'http://localhost:8100/assets/images/greenimg.png';
            break;
        case 10:
            color = 'http://localhost:8100/assets/images/greenimg.png';
            break;
        case 11:
            color = 'http://localhost:8100/assets/images/violiteimg.png';
            break;
        case 12:
            color = 'http://localhost:8100/assets/images/redimg.png';
            break;
        default:
    }
    Parity.updateMany(query, { "$set": { "result": result, color: color } }, function (err, ress) {
        if (err) {
            let response = {
                code: 404,
            };
            res.send(response);
        } else {
            let response = {
                code: 200,
            };
            res.send(response);
        }
    });
});

//End

//Start Update Address
app.put('/updateAddress', (req, res) => {
    let id = req.body.id;
    let userid = req.body.userid;
    let fullname = req.body.fullname;
    let mobilenumber = req.body.mobilenumber;
    let pincode = req.body.pincode;
    let state = req.body.state;
    let city = req.body.city;
    let detailsaddress = req.body.detailsaddress;
    let updateddate = (new Date()).toLocaleDateString()
    const query = { _id: id };
    Address.updateMany(query, { "$set": { "userid": userid, "fullname": fullname, "mobilenumber": mobilenumber, "pincode": pincode, "state": state, "city": city, "detailsaddress": detailsaddress, "updateddate": updateddate } }, function (err, ress) {
        if (err) {
            let response = {
                code: 404,
            };
            res.send(response);
        } else {
            let response = {
                code: 200,
            };
            res.send(response);
        }
    });
})

//End

//Start Update Bankdata
app.put('/updateBankdetails', (req, res) => {
    let id = req.body.id;
    let actualname = req.body.actualname;
    let ifsccode = req.body.ifsccode;
    let bankname = req.body.bankname;
    let bankaccount = req.body.bankaccount;
    let state = req.body.state;
    let city = req.body.city;
    let address = req.body.address;
    let mobilenumber = req.body.mobilenumber;
    let email = req.body.email;
    let accountmobilenumber = req.body.accountmobilenumber;
    let verificationcode = req.body.verificationcode;
    let updateddate = (new Date()).toLocaleDateString()
    const query = { _id: id };
    Bankdetails.updateMany(query, { "$set": { "actualname": actualname, "ifsccode": ifsccode, "bankname": bankname, "bankaccount": bankaccount, "state": state, "city": city, "address": address, "mobilenumber": mobilenumber, "email": email, "accountmobilenumber": accountmobilenumber, "verificationcode": verificationcode, "updateddate": updateddate } }, function (err, ress) {
        if (err) {
            let response = {
                code: 404,
            };
            res.send(response);
        } else {
            let response = {
                code: 200,
            };
            res.send(response);
        }
    });
})

//End

//Start Update Balance

app.put('/updateBalance', (req, res) => {
    let mobile = req.body.mobile;
    let balance = req.body.balance;
    let operation = req.body.operation;

    Balance.find({ mobile: parseInt(mobile) }, {}, { sort: { 'createddate': -1 } }, (err, result1) => {
        if (err) {
            res.send('some error')
        }
        if (result1 == [] || result1 == null || result1 == undefined || result1 == {} || result1 == '[]') {
            res.send('blankdata')
        } else {
            Balance.aggregate(
                [
                    {
                        "$match": {
                            "mobile": parseInt(mobile)
                        }
                    },
                    {
                        $group: {
                            _id: "$mobile",
                            total: {
                                $sum: "$totalBallance"
                            }
                        }
                    }
                ],
                function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        const query = { mobile: parseInt(mobile) };
						 let balact = 0;
                        if (operation == "increment") {
                             balact = parseInt(result[0].total) + parseInt(Math.floor(balance));
                        }
                        if (operation == "decrement") {
                             balact = parseInt(result[0].total) - parseInt(Math.floor(balance));
                        }

                        Balance.updateMany(query, { "$set": { "totalBallance": balact } }, function (err, ress) {
                            if (err) {
                                let response = {
                                    code: 404,
                                };
                                res.send(response);
                            } else {
                                let response = {
                                    code: 200,
                                    balact: balact
                                };
                                res.send(response);
                            }
                        })

                    }
                }
            );
        }
    });

});

//End

/* End Put Method */


/* Global function 10-11-2022 */

//Sent Mobile Otp function
function sentOtp(mobile, ress) {
    let otpValue = Math.floor(100000 + Math.random() * 900000);
    const fastreq = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    json.chk = [];
    fastreq.headers({
        "authorization": "35QVEvamzjWIxHpgkD4Yy7sFOLTZnPht1ow8AfNbrCeXJKM6iSSN3BbCghAZwHtFizeaX5WTJ2IsfLrO"
    });
    fastreq.form({
        "variables_values": otpValue,
        "route": "otp",
        "numbers": mobile,
    });
    fastreq.end(function (res) {
        if (res.error) {
            ress.send(res.error);
        } else {
            res.body.otpCode = otpValue;
            res.body.status = 200;
            ress.send(res.body);
        }

    });
    return json;
}
function checkToken(req, res, next) {
    let token = req.header("Authorization");
    if (token) {
        token = token.split(" ")[1];
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                let response = {
                    code: 404,
                    message: "Please enter valid token",
                };
                res.send(response);
            } else {
                next();
            }
        });
    } else {
        let response = {
            code: 404,
            message: "Please add token in headers parameter",
        };
        res.send(response);
    }
}

app.listen(5000);
