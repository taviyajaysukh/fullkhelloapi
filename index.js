const express = require("express");
const cors = require("cors");
const unirest = require("unirest");
const cron = require("node-cron");
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
const Transaction = require("./db/Transaction");
const Promotion = require("./db/Promotion");
const Managesession = require("./db/Managesession");
const Manageperiod = require("./db/Manageperiod");
const Redenvelope = require("./db/Redenvelope");
const Withdrawal = require("./db/Withdrawal");
const Referral = require("./db/Referral");
const Interest = require("./db/Interest");
const Razorpay = require('razorpay');
const Image = require('./db/Image');
const fs = require('fs');
const path = require('path');

var multer = require('multer');
const sdk = require('api')('@cashfreedocs-new/v3#4xc3n730larv4wbt');
const app = express();
const jwt = require("jsonwebtoken");
const jwtKey = "fullkhello";
let json = {};
app.use(express.json());
app.use('/images',express.static('uploads'));
app.use(cors());
const port = process.env.PORT || 5000;
let timv = 180;

//image upload code
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
 
var upload = multer({ storage: storage });
//end

app.post('/imageupload', upload.single('image'), (req, res, next) => {
	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		image:'http://localhost:5000/images/'+req.file.filename
	}
	Image.create(obj, (err, item) => {
		if (err) {
			let response = {
			  code: 404,
			  message: "Not upload",
			};
			res.send(response);
		}
		else {
			// item.save();
			let response = {
			  code: 200,
			  message: "Image upload successfully...",
			};
			res.send(response);
		}
	});
});


app.put('/imageuploadedit', upload.single('image'), (req, res, next) => {
	let siteid = req.body.siteid;
	let name = req.body.name;
	let desc = req.body.desc;
	let image = 'http://localhost:5000/images/'+req.file.filename;
	
	const query = { _id: siteid };
	  Image.updateMany(
		query,
		{
		  $set: {
			name: name,
			desc: desc,
			image: image
		  },
		},
		function (err, ress) {
		  if (err) {
			let response = {
			  code: 404,
			};
			res.send(response);
		  } else {
			let response = {
			  code: 200,
			  message:'Update successfully....'
			};
			res.send(response);
		  }
		}
	  );
	
});
app.put('/imageedit',async (req, res) => {
	let siteid = req.body.siteid;
	let name = req.body.name;
	let desc = req.body.desc;
	let image = req.body.image;
	console.log(name);
	const query = { _id: siteid };
	  Image.updateOne(
		query,
		{
		  $set: {
			name: name,
			desc: desc,
			image: image
		  },
		},
		function (err, ress) {
		  if (err) {
			let response = {
			  code: 404,
			};
			res.send(response);
		  } else {
			let response = {
			  code: 200,
			  message:'Update successfully....'
			};
			res.send(response);
		  }
		}
	  );
	
});

app.get('/checkcron',(req,res)=>{
    cron.schedule("*/1 * * * * *", async function (val) {
            timv--;
    });
    res.send(timv);
});

cron.schedule("*/1 * * * * *", async function (val) {
  timv--;
  let resultparity = Math.floor(Math.random() * 12);
  if (timv == 30) {
    let mnperiondt = await Manageperiod.find(
      {},
      {},
      { sort: { createddate: -1 } }
    );
    let period = mnperiondt[0].period;
    Parity.find(
      { period: period },
      {},
      { sort: { createddate: -1 } },
      (err, resultpt1) => {
        if (err) {
        }
        if (resultpt1.length > 0 && resultpt1[0].status == false) {
          var color = "";
          switch (resultparity) {
            case 0:
              color = "http://localhost:8100/assets/images/redviolet.png";
              break;
            case 1:
              color = "http://localhost:8100/assets/images/greenimg.png";
              break;
            case 2:
              color = "http://localhost:8100/assets/images/redimg.png";
              break;
            case 3:
              color = "http://localhost:8100/assets/images/greenimg.png";
              break;
            case 4:
              color = "http://localhost:8100/assets/images/redimg.png";
              break;
            case 5:
              color = "http://localhost:8100/assets/images/greenviolite.png";
              break;
            case 6:
              color = "http://localhost:8100/assets/images/redimg.png";
              break;
            case 7:
              color = "http://localhost:8100/assets/images/greenimg.png";
              break;
            case 8:
              color = "http://localhost:8100/assets/images/redimg.png";
              break;
            case 9:
              color = "http://localhost:8100/assets/images/greenimg.png";
              break;
            case 10:
              color = "http://localhost:8100/assets/images/greenimg.png";
              break;
            case 11:
              color = "http://localhost:8100/assets/images/violiteimg.png";
              break;
            case 12:
              color = "http://localhost:8100/assets/images/redimg.png";
              break;
            default:
          }
          const query1 = { period: period };
          Parity.updateMany(
            query1,
            {
              $set: {
                result: resultparity,
                color: color,
              },
            },
            function (err, ress) {
              if (err) {
              } else {
              }
            }
          );
        }
      }
    );
  }
  if (timv == 2) {
    paritybydata = await Parity.find({
      status: false,
    }).exec();
    if (paritybydata.length > 0) {
      let resultPeriod = Math.floor(Math.random() * 12);
      paritybydata.map((ind, val) => {
        let prmobile = paritybydata[val].usermobile;
        let prperiod = paritybydata[val].period;
        let prprice = paritybydata[val].price;
        let prresult = paritybydata[val].result;
        let price = 0;
        let resultper = "";
        let winamount = 0;
        if (resultPeriod == prresult) {
          winamount = Math.floor(prprice * 1.85);
        }
        Balance.find(
          { mobile: parseInt(prmobile) },
          {},
          { sort: { createddate: -1 } },
          (err, prresult1) => {
            if (err) {
            }
            if (
              prresult1 == [] ||
              prresult1 == null ||
              prresult1 == undefined ||
              prresult1 == {} ||
              prresult1 == "[]"
            ) {
            } else {
              Balance.aggregate(
                [
                  {
                    $match: {
                      mobile: parseInt(prmobile),
                    },
                  },
                  {
                    $group: {
                      _id: "$mobile",
                      total: {
                        $sum: "$totalBallance",
                      },
                    },
                  },
                ],
                function (err, resultpr2) {
                  if (err) {
                  } else {
                    balact = 0;
                    const querymp = { mobile: parseInt(prmobile) };
                    if (resultpr2.length > 0) {
                      balact =
                        parseInt(resultpr2[0].total) +
                        parseInt(Math.floor(winamount));
                    }
                    Balance.updateMany(
                      querymp,
                      { $set: { totalBallance: balact } },
                      function (err, ress) {
                        if (err) {
                        } else {
                          const queryyp = { period: prperiod };
                          Parity.updateMany(
                            queryyp,
                            {
                              $set: {
                                status: true,
                              },
                            },
                            function (err, ress) {
                              if (err) {
                              } else {
								  Transaction.insertMany([
								  {
									userid:parseInt(prmobile),
									paymentMethod:'Not Method',
									transactionType:'win',
									transactionId:'Not Transaction Id',
									amount:winamount,
									referralamount:0,
									status:true,
								  },
								])
								  .then(function () {})
								  .catch(function (error) {});
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });
    }
  }
  if (timv == 1) {
    timv = 180;
    let mnperiondt = await Manageperiod.find(
      {},
      {},
      { sort: { createddate: -1 } }
    );
    let period = mnperiondt[0].period;
    const query1 = { id: 1 };
    Manageperiod.updateMany(
      query1,
      {
        $set: {
          period: period + 1,
        },
      },
      function (err, ress) {
        if (err) {
        } else {
        }
      }
    );
  }
  
	const queryup = { sessionid: 1 };
    Managesession.updateMany(
      queryup,
      {
        $set: {
          session: timv,
        },
      },
      function (err, ress) {
        if (err) {
        } else {
        }
      }
    );
  
});
//cron check
cron.schedule("0 0 0 * * *'", async function() {
	let bldata = await Balance.find({}, {}, { sort: { createddate: -1 } });
	bldata.forEach(function(inx,value){
		let mobile = bldata[value].mobile;
		let commper = 100;
		let commpervalue = 2;
		let interestvalue = (bldata[value].totalBallance * commpervalue) / commper
		let totalBallance = bldata[value].totalBallance + Math.floor(interestvalue);
		const query = { mobile: mobile };
			Balance.updateMany(
			  query,
			  {
				$set: {
				  totalBallance: totalBallance
				},
			  },
			  function (err, ress) {
				if (err) {
				  
				} else {
				  Interest.create({"mobile":mobile,"amount":Math.floor(interestvalue),"status":true});
				 
				}
			  }
			);
	});
  });
/* Get Method  10-11-2022 */

//refund rozarpy
app.post('/refund',async (req,res)=>{
	var instance = new Razorpay({ key_id: 'rzp_test_YgDBD3RUfdn37O', key_secret: 'wPNnSkOI09f4ZCJGRMvXbAqJ' })
	instance.payments.refund('pay_Kqyv1OespLLXN8',{
	  "amount": "100",
	  "speed": "optimum",
	  "receipt": "Receipt No. 31"
	}).then((response) => {
	  // handle success
	  console.log(response)
	}).catch((error) => {
		console.log(error)
	  // handle error
	})	
});

//end

//Api for get referral first level

app.post("/manageInterest", async (req, res) => {
  let bldata = await Balance.find({}, {}, { sort: { createddate: -1 } });
  bldata.forEach(function (inx, value) {
    let mobile = bldata[value].mobile;
    let totalBallance = bldata[value].totalBallance + 20;
    const query = { mobile: mobile };
    Balance.updateMany(
      query,
      {
        $set: {
          totalBallance: totalBallance,
        },
      },
      function (err, ress) {
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
      }
    );
  });
});

app.get("/getReferralLevel1/:referraltomobile", async function (req, res) {
  let referraltomobile = req.params.referraltomobile;
  //join two table
  Referral.aggregate(
    [
      {
        $lookup: {
          from: "accounts",
          let: {
            referral_mobile: "$referraltomobile",
            account_amont: "$referralamount",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$mobile", "$$referral_mobile"] },
                    { $gt: ["$referralamount", 0] },
                  ],
                },
              },
            },
            { $project: { mobile: 0, _id: 0 } },
          ],
          as: "userdat",
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let tore = 0;
        const ustlist = {};
        const ustlist1 = [];
        result.forEach(function (ind, value) {
          let udt = result[value].userdat;
          ustlist.frommoble = result[value].referralfrommobile;
          ustlist.tomoble = result[value].referraltomobile;
          ustlist.date = result[value].createddate;
          udt.forEach(function (indx, val) {
            tore += udt[val].referralamount;
          });
          ustlist.totalreferral = tore;
        });
        ustlist1.push(ustlist);
        let response = {
          code: 200,
          message: "Get successfully record...",
          data: ustlist1,
        };
        res.send(response);
      }
    }
  );
});
//End api

//Start Get reward by user
app.get("/getMyReward/:mobile", async (req,res) =>{
	let mobile = req.params.mobile;
	let promotiondata = await Transaction.find(
    {userid:mobile,referralamount:{$gte :1}},
    {},
    { sort: { createddate: -1 } }
  );
  if(promotiondata.length > 0){
	  let response = {
          code: 200,
          message: "Get successfully record...",
          data: promotiondata,
        };
        res.send(response);
  }else{
	  let response = {
          code: 404,
        };
        res.send(response);
  }
});

//End
//Start Get reward by user
app.get("/getMyPromotionTotal/:mobile", async (req,res) =>{
	let mobile = req.params.mobile;
	Transaction.aggregate(
			[
			  {
				$match: {
				  userid: parseInt(mobile),
				},
			  },
			  {
				$group: {
				  _id: "$userid",
				  total: {
					$sum: "$referralamount",
				  },
				},
			  },
			],
			function (err, result) {
				if(result){
				  let response = {
					  code: 200,
					  message: "Get successfully record...",
					  data: result,
					};
					res.send(response);
			  }else{
				  let response = {
					  code: 404,
					};
					res.send(response);
			  }
			}
		);
});
//End
//Start Get reward by user
app.get("/getMyInterestTotal/:mobile", async (req,res) =>{
	let mobile = req.params.mobile;
	Interest.aggregate(
			[
			  {
				$match: {
				  mobile: parseInt(mobile),
				},
			  },
			  {
				$group: {
				  _id: "$mobile",
				  total: {
					$sum: "$amount",
				  },
				},
			  },
			],
			function (err, result) {
				if(result){
				  let response = {
					  code: 200,
					  message: "Get successfully record...",
					  data: result,
					};
					res.send(response);
			  }else{
				  let response = {
					  code: 404,
					};
					res.send(response);
			  }
			}
		);
});
//End
//Start Get reward by user
app.get("/getMyInterest/:mobile", async (req,res) =>{
	let mobile = req.params.mobile;
	let interestdata = await Interest.find(
    {mobile:mobile,amount:{$gte :1}},
    {},
    { sort: { createddate: -1 } }
  );
  if(interestdata.length > 0){
	  let response = {
          code: 200,
          message: "Get successfully record...",
          data: interestdata,
        };
        res.send(response);
  }else{
	  let response = {
          code: 404,
        };
        res.send(response);
  }
});
 
//Start Get last session
app.get("/getLastSession", async (req, res) => {
  let sessiondata = await Managesession.findOne(
    {},
    {},
    { sort: { createddate: -1 } }
  );
  let session = 0;
  if (sessiondata) {
    session = sessiondata.session;
  }
  let response = {
    code: 200,
    message: "Get successfully record...",
    session: session,
  };
  res.send(response);
});
//End

//Start Get last period
app.get("/getPeriod", async (req, res) => {
  let perioddata = await Manageperiod.findOne(
    {},
    {},
    { sort: { createddate: -1 } }
  );
  let period = 0;
  if (perioddata) {
    period = perioddata.period;
  }
  let response = {
    code: 200,
    message: "Get successfully record...",
    period: period,
  };
  res.send(response);
});
//End
//Start Get last period
app.get("/getLastPeriod", async (req, res) => {
  let perioddata = await Period.findOne({}, {}, { sort: { createddate: -1 } });
  let period = 0;
  if (perioddata) {
    period = perioddata.period;
  }
  let response = {
    code: 200,
    message: "Get successfully record...",
    period: period,
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
        $match: {
          mobile: parseInt(mobile),
        },
      },
      {
        $group: {
          _id: "$mobile",
          total: {
            $sum: "$totalBallance",
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.length > 0) {
          let response = {
            code: 200,
            data: result[0],
            message: "Get record",
          };
          res.send(response);
        } else {
          let response = {
            code: 200,
            data: { total: 0 },
            message: "Get record",
          };
          res.send(response);
        }
      }
    }
  );
});

//End

//Get Last Paritie
app.get("/getLastParity", async (req, res) => {
  let paritydata = await Parity.findOne({}, {}, { sort: { createddate: -1 } });
  let period = paritydata.period;
  let response = {
    code: 200,
    message: "Get successfully record...",
    period: period,
  };
  res.send(response);
});
//End
//Get all product

app.get("/getProduct", async (req, res) => {
  let productdata = await Product.find(req.body);
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: productdata,
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
    data: paritydata,
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
    data: bankdata,
  };
  res.send(response);
});

//End

//Get all Bank details

app.get("/getRedenvelope", async (req, res) => {
  let edenvelopedata = await Redenvelope.find(req.body);
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: edenvelopedata,
  };
  res.send(response);
});

//End

//Get all Bank details

app.get("/getUsers", async (req, res) => {
  let userdata = await User.find(req.body);
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: userdata,
  };
  res.send(response);
});

//End
//get parity by admin
app.get('/getParityadmin',async(req,res)=>{
	paritydata = await Parity.find(
    { status: true },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: paritydata,
  };
  res.send(response);
})
//end
app.get("/getSession", async (req, res) => {
  let sessdata = {};
  let managesession = await Managesession.find({ sessionid: 1 }).exec();
  if (managesession.length > 0) {
    sessdata = managesession;
  }
  res.send(sessdata);
});


//get image for site general

//get parity by admin
app.get('/getImagedmin',async(req,res)=>{
  imgdata = await Image.find({},{});
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: imgdata,
  };
  res.send(response);
})
//end
//casefree api
app.post('/addcashorder',async(req,res)=>{
	let customer_id = req.body.customer_id;
	let customer_email = req.body.customer_email;
	let customer_phone = req.body.customer_phone;
	let order_amount = req.body.order_amount;
	sdk.createOrder({
	  customer_details: {
		customer_id: (customer_id !='') ? customer_id:'7112AAA812234',
		customer_email: (customer_email !='')?customer_email:'test@cashfree.com',
		customer_phone: (customer_phone !='')?customer_phone:'0000000000'
	  },
	  order_amount: order_amount,
	  order_currency: 'INR'
	}, {
	  'x-client-id': '2820198642f652a118abf9ead3910282',
	  'x-client-secret': '60029927436e84870805fd0d1f75e95dca25362d',
	  'x-api-version': '2022-09-01'
	})
		.then((data)=>{
			if(data.data.payment_session_id){
				let response = {
				  payment_session_id:data.data.payment_session_id,
				  code: 200,
				};
				res.send(response);
			}else{
				let response = {
				  code: 404,
				};
				res.send(response);
			}
		})
	  .catch(err => console.error(err));
});
//

//Get all Contact Bank details


app.post("/getContactById", async (req, res) => {
  let contactid = req.body.contactid;
  var req = unirest("GET", "https://api.razorpay.com/v1/contacts/" + contactid)
    .headers({
      Authorization:
        "Basic cnpwX3Rlc3RfY0Q1a1hvUWpKdVBjMGE6WkdsOFh3MDFCdW9oWHB6ZUs5Y1pjRTMx",
    })
    .end(function (ress) {
      if (res.error) throw new Error(res.error);
      if (ress.raw_body) {
        let datat = JSON.parse(ress.raw_body);
        let response = {
          data: datat,
          code: 200,
        };
        res.send(response);
      } else {
        let response = {
          code: 404,
        };
        res.send(response);
      }
    });
});

//End
/* All Post Methods 10-11-2022 */

//Start Rarorpay withdrawl process
app.post("/paymentWithdrawal", async (req, res) => {
  let usermobile = req.body.usermobile;
  let contactid = req.body.contactid;
  let amount = req.body.amount;
  let userdata = await User.find({
    mobile: usermobile,
  });
  if (userdata.length > 0) {
    let bankData = await Bankdetails.find({
      contactid: contactid,
    });
    if (bankData.length > 0) {
      let account_type = "bank_account";
      let name = bankData[0].actualname;
      let ifsc = bankData[0].ifsccode;
      let account_number = bankData[0].bankaccount;
      var requni = unirest("POST", "https://api.razorpay.com/v1/fund_accounts")
        .headers({
          "Content-Type": "application/json",
          Authorization:
            "Basic cnpwX3Rlc3RfY0Q1a1hvUWpKdVBjMGE6WkdsOFh3MDFCdW9oWHB6ZUs5Y1pjRTMx",
        })
        .send(
          JSON.stringify({
            contact_id: contactid,
            account_type: account_type,
            bank_account: {
              name: name,
              ifsc: ifsc,
              account_number: account_number,
            },
          })
        )
        .end(function (ress) {
          if (res.error) throw new Error(res.error);
          let fdata = JSON.parse(ress.raw_body);
          if (fdata) {
            let fundid = fdata.id;
            //payout procrss
            var reqe = unirest("POST", "https://api.razorpay.com/v1/payouts")
              .headers({
                "Content-Type": "application/json",
                Authorization:
                  "Basic cnpwX3Rlc3RfY0Q1a1hvUWpKdVBjMGE6WkdsOFh3MDFCdW9oWHB6ZUs5Y1pjRTMx",
              })
              .send(
                JSON.stringify({
                  account_number: "2323230096421983",
                  fund_account_id: fundid,
                  amount: amount,
                  currency: "INR",
                  mode: "NEFT",
                  purpose: "refund",
                  queue_if_low_balance: true,
                  reference_id: "Acme Transaction ID 12345",
                  narration: "Acme Corp Fund Transfer",
                  notes: {
                    random_key_1: "Make it so.",
                    random_key_2: "Tea. Earl Grey. Hot.",
                  },
                })
              )
              .end(function (ress) {
                let paydata = JSON.parse(ress.raw_body);
                if (paydata.error.reason != null) {
                  let response = {
                    code: 404,
                    error: paydata.error,
                  };
                  res.send(response);
                } else {
                  if (paydata) {
                    Withdrawal.insertMany([
                      {
                        usermobile: usermobile,
                        contactid: contactid,
                        amount: amount,
                        accounttype: account_type,
                        name: name,
                        ifsccode: ifsc,
                        accountnumber: account_number,
                        fundaccountid: fundid,
                        currency: "INR",
                        mode: "NEFT",
                        purpose: "refund",
                        reference_id: "Acme Transaction ID 12345",
                        narration: "Acme Corp Fund Transfer",
                        randomkey1: "Make it so.",
                        randomkey2: "Tea. Earl Grey. Hot.",
                      },
                    ])
                      .then(function () {})
                      .catch(function (error) {});
                    let response = {
                      code: 200,
                      message: "Withdrawal successfully",
                    };
                    res.send(response);
                  } else {
                    let response = {
                      code: 404,
                    };
                    res.send(response);
                  }
                }
              });
          }
        });
    } else {
      let response = {
        code: 404,
        message: "This user bank details not exist",
      };
      res.send(response);
    }
  } else {
    let response = {
      code: 404,
      message: "User not registered",
    };
    res.send(response);
  }
});
//End

//Start Register Api
app.post("/register", async (req, res) => {
  let userdata = await User.findOne(req.body);
  let useralldata = await User.findOne({}, {}, { sort: { createddate: -1 } });
  let userid = 1;
  if (useralldata) {
    userid = 0;
    userid = useralldata.userid + 1;
  }
  if (userdata) {
    let response = {
      code: 404,
      message: "Record allready match",
    };
    res.send(response);
  } else {
    let user = new User(req.body);
    user.userid = userid;
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
      message: "This mobile number not register please first register",
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

//Start Login Api

app.post("/checkPassword", async (req, res) => {
  let userdata = await User.find({
    mobile: req.body.mobile,
    password: req.body.password,
  });
  if (userdata.length > 0) {
    let response = {
      status: 1,
    };
    res.send(response);
  } else {
    let response = {
      status: 0,
    };
    res.send(response);
  }
});

//Start search product api
app.post("/searchProduct", async (req, res) => {
  let searnm = req.body.searnm;
  Product.find({ "productName" : {"$regex": searnm, "$options": "i"} },
          function (err, product) {
                 if (err) return handleError(err);
                 if(product){
					 let response = {
						code: 200,
						message: "Get successfully record...",
						data: product,
					  };
					  res.send(product);
				 }else{
					 let response = {
						code: 404,
						message: "Error...",
					
					  };
					  res.send(product);
				 }

   });
});
//End

//Start Get user By mobile api
app.post("/getUserByMobile", async (req, res) => {
  let userdata = await User.find(
    { _id: req.body.mobile },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: userdata,
  };
  res.send(response);
});
//End

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
//Endaddredenvelope

//Get referral user details

app.post("/getUserByReferralcode", async (req, res) => {
  let promotioncode = req.body.promotioncode;
  let promotion = await Promotion.findOne(req.body);
  if (promotion) {
    let response = {
      code: 201,
      data: promotion,
      message: "Record found",
    };
    res.send(response);
  } else {
    let response = {
      code: 404,
      message: "Record not found",
    };
    res.send(response);
  }
});
//Referral Management api
app.post("/manageReferral", async (req, res) => {
  let referral = new Referral(req.body);
  let result = await referral.save();
  let response = {
    code: 201,
    data: result,
    message: "Record has been saved",
  };
  res.send(response);
});
//End

//Referral Management api
app.post("/manageReferralByRecharge", async (req, res) => {
  let referraldt = await Referral.findOne(req.body);
  if (referraldt) {
    let response = {
      code: 201,
      data: referraldt,
      message: "Data found",
    };
    res.send(response);
  } else {
    let response = {
      code: 404,
      message: "Data not found",
    };
    res.send(response);
  }
});
//End

//Start Product add api

app.post("/addredenvelope", async (req, res) => {
  let redenvelope = new Redenvelope(req.body);
  let result = await redenvelope.save();
  let response = {
    code: 200,
    data: result,
    message: "Record has been saved",
  };
  res.send(response);
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
  let bankdata = await Bankdetails.find(
    { _id: req.body.id },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: bankdata,
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
  let complaintsdata = await Complaints.find(
    { _id: req.body.id },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: complaintsdata,
  };
  res.send(response);
});

//End

//Start Get With components
app.post("/getWaitComplaints", async (req, res) => {
  let complaintsdata = await Complaints.find(
    { userid: req.body.userid, status: false },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: complaintsdata,
  };
  res.send(response);
});

//End
//Start Get All address

app.post("/getAddress", async (req, res) => {
  let Addressdata = await Address.find(
    { userid: req.body.userid },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: Addressdata,
  };
  res.send(response);
});

//End

//Start Get Bankdetails By id api
app.post("/getAddressById", async (req, res) => {
  let addressdata = await Address.find(
    { _id: req.body.id },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: addressdata,
  };
  res.send(response);
});
//End

//Start Get Completed components api
app.post("/getComplatedComplaints", async (req, res) => {
  let complaintsdata = await Complaints.find(
    { userid: req.body.userid, status: true },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: complaintsdata,
  };
  res.send(response);
});

//End
//Start Get one user trancation

app.post("/getUserTransation", async (req, res) => {
  let transactiondata = await Transaction.find(
    { userid: req.body.userid },
    {},
    { sort: { createddate: -1 } }
  );
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: transactiondata,
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
  if(timv > 30){
	  let parity = new Parity(req.body);
	  let result = await parity.save();
	  let response = {
		code: 200,
		data: result,
		message: "Record has been saved",
	  };
	  res.send(response);
  }else{
	  let response = {
		code: 404,
		message: "Your time expired",
	  };
	  res.send(response);
  }	
  
});
//End

//Start Get My Parity record api
app.post("/getMyParityRecord", async (req, res) => {
  //let paritydata = await Parity.find(req.body);
  let paritydata = await Parity.find({
    usermobile: req.body.usermobile,
  }).exec();
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: paritydata,
  };
  res.send(response);
});
//End

//Start Get My Parity record api
app.post("/getMyPromotionCode", async (req, res) => {
  //let paritydata = await Parity.find(req.body);
  let userdata = await User.findOne({ mobile: req.body.mobile }).exec();
  let response = {
    code: 200,
    message: "Get successfully record...",
    data: userdata,
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
//Start Transaction add api

app.post("/addTransaction", async (req, res) => {
  //let productData = await Product.findOne(req.body);
  let transaction = new Transaction(req.body);
  let result = await transaction.save();
  let response = {
    code: 201,
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

//Start add promotion api
app.post("/addPromotion", async (req, res) => {
  let promotion = new Promotion(req.body);
  let result = await promotion.save();
  let response = {
    code: 200,
    data: result,
    message: "Record has been saved",
  };
  res.send(response);
});
//End

//Parity manage api

app.post("/parityManage", async (req, res) => {
  let userMobile = req.body.userMobile;
  parityManage(userMobile, res);
});

//End

//Start add xpayouy create contact api
app.post("/addContact", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let contact = req.body.contact;
  let type = req.body.type;
  let reference_id = req.body.reference_id;
  let random_key_1 = req.body.random_key_1;
  let random_key_2 = req.body.random_key_2;
  var req = unirest("POST", "https://api.razorpay.com/v1/contacts")
    .headers({
      "Content-Type": "application/json",
      Authorization:
        "Basic cnpwX3Rlc3RfY0Q1a1hvUWpKdVBjMGE6WkdsOFh3MDFCdW9oWHB6ZUs5Y1pjRTMx",
    })
    .send(
      JSON.stringify({
        name: name,
        email: email,
        contact: contact,
        type: type,
        reference_id: reference_id,
        notes: {
          random_key_1: random_key_1,
          random_key_2: random_key_2,
        },
      })
    )
    .end(function (ress) {
      if (res.error) throw new Error(res.error);
      if (ress.raw_body) {
        let datat = JSON.parse(ress.raw_body);
        let conid = datat.id;
        let entity = datat.entity;
        let response = {
          code: 200,
          data: conid,
        };
        res.send(response);
      } else {
        let response = {
          code: 404,
        };
        res.send(response);
      }
      //res.send(ress.raw_body);
    });
});
//End

/* Start Put Method  10-11-2022 */

//Start updateParity with amount api
app.put("/updateParityWithAmount", async (req, res) => {
  let period = req.body.period;
  let resultPeriod = req.body.result;
  let mobile = req.body.mobile;
  let paritydata = await Parity.find({
    usermobile: parseInt(mobile),
    period: parseInt(period),
  }).exec();
  let price = 0;
  let resultper = "";
  let winamount = 0;
  if (paritydata.length > 0) {
    price = paritydata[0].price;
    resultper = paritydata[0].result;
  }
  if (resultPeriod == resultper) {
    winamount = Math.floor(price * 1.85);
  } else {
    winamount = Math.floor(price);
  }

  Balance.find(
    { mobile: parseInt(mobile) },
    {},
    { sort: { createddate: -1 } },
    (err, result1) => {
      if (err) {
        res.send("some error");
      }
      if (
        result1 == [] ||
        result1 == null ||
        result1 == undefined ||
        result1 == {} ||
        result1 == "[]"
      ) {
        res.send("blankdata");
      } else {
        Balance.aggregate(
          [
            {
              $match: {
                mobile: parseInt(mobile),
              },
            },
            {
              $group: {
                _id: "$mobile",
                total: {
                  $sum: "$totalBallance",
                },
              },
            },
          ],
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              balact = 0;
              const query = { mobile: parseInt(mobile) };
              if (result.length > 0) {
                balact =
                  parseInt(result[0].total) + parseInt(Math.floor(winamount));
              }

              Balance.updateMany(
                query,
                { $set: { totalBallance: balact } },
                function (err, ress) {
                  if (err) {
                    let response = {
                      code: 404,
                    };
                    res.send(response);
                  } else {
                    let response = {
                      code: 200,
                      balact: balact,
                    };
                    res.send(response);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
app.put("/updateParity", (req, res) => {
  let period = req.body.period;
  let result = req.body.result;
  let mobile = req.body.mobile;
  let status = true;
  //let paritydata = await Parity.find({ usermobile: mobile }).exec();
  const query = { period: period };
  var color = "";
  switch (result) {
    case 0:
      color = "http://localhost:8100/assets/images/redviolet.png";
      break;
    case 1:
      color = "http://localhost:8100/assets/images/greenimg.png";
      break;
    case 2:
      color = "http://localhost:8100/assets/images/redimg.png";
      break;
    case 3:
      color = "http://localhost:8100/assets/images/greenimg.png";
      break;
    case 4:
      color = "http://localhost:8100/assets/images/redimg.png";
      break;
    case 5:
      color = "http://localhost:8100/assets/images/greenviolite.png";
      break;
    case 6:
      color = "http://localhost:8100/assets/images/redimg.png";
      break;
    case 7:
      color = "http://localhost:8100/assets/images/greenimg.png";
      break;
    case 8:
      color = "http://localhost:8100/assets/images/redimg.png";
      break;
    case 9:
      color = "http://localhost:8100/assets/images/greenimg.png";
      break;
    case 10:
      color = "http://localhost:8100/assets/images/greenimg.png";
      break;
    case 11:
      color = "http://localhost:8100/assets/images/violiteimg.png";
      break;
    case 12:
      color = "http://localhost:8100/assets/images/redimg.png";
      break;
    default:
  }
  Parity.updateMany(
    query,
    { $set: { result: result, color: color, status: status } },
    function (err, ress) {
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
    }
  );
});

//End

//Start Update Address
app.put("/updateAddress", (req, res) => {
  let id = req.body.id;
  let userid = req.body.userid;
  let fullname = req.body.fullname;
  let mobilenumber = req.body.mobilenumber;
  let pincode = req.body.pincode;
  let state = req.body.state;
  let city = req.body.city;
  let detailsaddress = req.body.detailsaddress;
  let updateddate = new Date().toLocaleDateString();
  const query = { _id: id };
  Address.updateMany(
    query,
    {
      $set: {
        userid: userid,
        fullname: fullname,
        mobilenumber: mobilenumber,
        pincode: pincode,
        state: state,
        city: city,
        detailsaddress: detailsaddress,
        updateddate: updateddate,
      },
    },
    function (err, ress) {
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
    }
  );
});

//End

//Start Update Bankdata
app.put("/updateBankdetails", (req, res) => {
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
  let updateddate = new Date().toLocaleDateString();
  const query = { _id: id };
  Bankdetails.updateMany(
    query,
    {
      $set: {
        actualname: actualname,
        ifsccode: ifsccode,
        bankname: bankname,
        bankaccount: bankaccount,
        state: state,
        city: city,
        address: address,
        mobilenumber: mobilenumber,
        email: email,
        accountmobilenumber: accountmobilenumber,
        verificationcode: verificationcode,
        updateddate: updateddate,
      },
    },
    function (err, ress) {
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
    }
  );
});

//End

//Start Update Balance

app.put("/updateBalance", async (req, res) => {
  let mobile = req.body.mobile;
  let balance = req.body.totalBallance;
  let operation = req.body.operation;

  Balance.find(
    { mobile: parseInt(mobile) },
    {},
    { sort: { createddate: -1 } },
    async (err, result1) => {
      if (err) {
        res.send("some error");
      }
      if (result1.length == 0) {
        let balance1 = new Balance(req.body);
        let resu = await balance1.save();
        let response = {
          code: 200,
          data: resu,
          message: "Record has been saved",
        };
        res.send(response);
      } else {
        Balance.aggregate(
          [
            {
              $match: {
                mobile: parseInt(mobile),
              },
            },
            {
              $group: {
                _id: "$mobile",
                total: {
                  $sum: "$totalBallance",
                },
              },
            },
          ],
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              const query = { mobile: parseInt(mobile) };
              let balact = 0;
              if (operation == "increment" && result.length > 0) {
                balact =
                  parseInt(result[0].total) + parseInt(Math.floor(balance));
              }
              if (operation == "decrement" && result.length > 0) {
                balact =
                  parseInt(result[0].total) - parseInt(Math.floor(balance));
              }

              Balance.updateMany(
                query,
                { $set: { totalBallance: balact } },
                function (err, ress) {
                  if (err) {
                    let response = {
                      code: 404,
                    };
                    res.send(response);
                  } else {
                    let response = {
                      code: 200,
                      balact: balact,
                    };
                    res.send(response);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

//End

/* Manage session api */
app.post("/addMaageperiod", async (req, res) => {
  let manageobj = new Manageperiod(req.body);
  let result = await manageobj.save();
  let response = {
    code: 200,
    data: result,
    message: "Record has been saved",
  };
  res.send(response);
});
//End
/* Manage session api */
app.post("/updateSession", async (req, res) => {
  let manageobj = new Managesession(req.body);
  let result = await manageobj.save();
  let response = {
    code: 200,
    data: result,
    message: "Record has been saved",
  };
  res.send(response);
});
//End

//Update referral payment status

app.put("/updateReferralStatus", async (req, res) => {
  //let managesession = await Managesession.find({ sessionid: 1 }).exec();
  let referraltomobile = req.body.referraltomobile;
  let applyreferral = req.body.applyreferral;
  const query = { referraltomobile: referraltomobile };
  Referral.updateMany(
    query,
    {
      $set: {
        applyreferral: applyreferral,
      },
    },
    function (err, ress) {
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
    }
  );
});
//End

//Update user details for admin

app.put('/editUser', async(req,res)=>{
	let userid = req.body.userid;
	let mobilenumber = req.body.mobilenumber;
	const query = { userid: userid };
	  User.updateMany(
		query,
		{
		  $set: {
			mobile: mobilenumber,
		  },
		},
		function (err, ress) {
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
		}
	  );
});
//end
//Update user details for admin

app.put('/editParity', async(req,res)=>{
	let id = req.body.id;
	let amount = req.body.amount;
	let joinsection = req.body.joinsection;
	let qty = req.body.qty;
	let period = req.body.period;
	let usermobile = req.body.usermobile;
	let price = req.body.price;
	const query = { _id: id };
	  Parity.updateMany(
		query,
		{
		  $set: {
			amount: amount,
			joinsection: joinsection,
			qty: qty,
			period: period,
			usermobile: usermobile,
			price: qty*amount,
		  },
		},
		function (err, ress) {
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
		}
	  );
});
//end
/* End Put Method */

/* Delete method start */
app.delete("/deleteAddress", (req, res) => {
  Address.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    let response = {
      code: 200,
    };
    res.send(response);
    // deleted at most one tank document
  });
});
/* Delete method end */
/* Delete method start */
app.delete("/deleteBankcard", (req, res) => {
  Bankdetails.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    let response = {
      code: 200,
    };
    res.send(response);
    // deleted at most one tank document
  });
});
/* Delete method start */
app.delete("/deleteUser", (req, res) => {
  User.deleteOne({ userid: req.body.userid }, function (err) {
    if (err) return handleError(err);
    let response = {
      code: 200,
    };
    res.send(response);
    // deleted at most one tank document
  });
});

/* Delete method start */
app.delete("/deleteParity", (req, res) => {
  Parity.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    let response = {
      code: 200,
    };
    res.send(response);
    // deleted at most one tank document
  });
});

//Sent Mobile Otp function
/* Delete method start */
app.delete("/deleteAll", (req, res) => {
  Interest.deleteMany({ status: true }, function (err) {
    if (err) return handleError(err);
    let response = {
      code: 200,
    };
    res.send(response);
    // deleted at most one tank document
  });
});
//Sent Mobile Otp function
function sentOtp(mobile, ress) {
  let otpValue = Math.floor(100000 + Math.random() * 900000);
  const fastreq = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
  json.chk = [];
  fastreq.headers({
    authorization:
      "35QVEvamzjWIxHpgkD4Yy7sFOLTZnPht1ow8AfNbrCeXJKM6iSSN3BbCghAZwHtFizeaX5WTJ2IsfLrO",
  });
  fastreq.form({
    variables_values: otpValue,
    route: "otp",
    numbers: mobile,
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

/* Most important function */

async function parityManage(userMobile, resp) {
  let paritydata = (paritybydata = perioddata = {});
  paritydata = await Parity.find(
    { status: true },
    {},
    { sort: { createddate: -1 } }
  );
  paritybydata = await Parity.find({
    usermobile: userMobile,
    status: true,
  }).exec();
  perioddata = await Period.findOne({}, {}, { sort: { createddate: -1 } });
  let period = 0;
  if (perioddata) {
    period = perioddata.period;
  }
  let response = {
    code: 200,
    paritydata: paritydata,
    paritybydata: paritybydata,
    perioddata: period,
    message: "Record Found",
  };
  resp.send(response);
}

app.listen(port, () => {
  console.log("listing 5000");
});
