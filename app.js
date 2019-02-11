let config = {
  apiKey: "AIzaSyCAlMrDCczQWmFYgZn0b6JIDSIwCUOANZc",
  authDomain: "pfm-simulation.firebaseapp.com",
  databaseURL: "https://pfm-simulation.firebaseio.com",
  projectId: "pfm-simulation",
  storageBucket: "pfm-simulation.appspot.com",
  messagingSenderId: "562600285763"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $('#setUpModal').modal('show');
  }
  else {
      
      
    ref = firebase.database().ref(firebase.auth().currentUser.uid);

      if(signed) {
          ref.child('balance').set(balance);
  ref.child("salary").set(salary);
    ref.child("name").set(name);
    ref.child("interestType").set(t);
          ref.child("leaderbalance").set(0);
      }
      
    
      ref.once("value", snap => {
          ref.on("value", snap => {
            data = snap.val();
            balance = parseInt(data.balance);
            salary = parseInt(data.salary);
            name = data.name;
            interestType = data.interestType;
            });
          init();
      })
      
  }
});

let data;

let name;
let ref;
let signed = false;
let balance = 0;
let balanceOutput = document.getElementById("balanceOutput");
let salary = 0;
let salaryOutput = document.getElementById("salaryOutput");

let interestOutput = document.getElementById('interestOutput');

let interestType = "";

let nameInput = document.getElementById("nameId");
let t = "";


function payday()
{
    balance = data.balance;
  let interest = 5;
  if(interestType === "Money Market Deposit")
    interest = Math.sqrt(balance)/250 + 2;
    if(interest>30)
        interest = 30;
    interestOutput.innerHTML = interest;
    
    if(data.place === 1) 
    {
        document.getElementById('tbody').innerHTML = '<tr><td class="winner">You got 50000 dollars for being 1st place</td></tr>' + document.getElementById('tbody').innerHTML;
        balance+=50000;
    }
    if(data.place === 2) 
    {
        document.getElementById('tbody').innerHTML = '<tr><td class="winner">You got 25000 dollars for being 2st place</td></tr>' + document.getElementById('tbody').innerHTML;
        balance+=50000;
    }
    if(data.place === 3) 
    {
        document.getElementById('tbody').innerHTML = '<tr><td class="winner">You got 10000 dollars for being 3st place</td></tr>' + document.getElementById('tbody').innerHTML;
        balance+=50000;
    }
    let s = 0;
    if(salary < 37950)
        s = salary*.85;
    else if(salary < 91900)
        s = salary*.75;
    else
        s = salary*.72;
    document.getElementById('tbody').innerHTML = '<tr><td>You lost '+(salary - s)+' dollars from your salary to deductibles</td></tr>' + document.getElementById('tbody').innerHTML;
    let earned = balance*interest/100.0;
    
   balance += s;
  balance *= 1 + interest/100.0;
    balance = Math.floor(balance*100)/100;
    earned = Math.floor(earned*100)/100;
    balanceOutput.innerHTML = balance;
    salaryOutput.innerHTML = salary;
    ref.child('balance').set(balance);
    document.getElementById('tbody').innerHTML = '<tr><td>You earned '+s+' dollars from your salary</td></tr>' + document.getElementById('tbody').innerHTML;
    document.getElementById('tbody').innerHTML = '<tr><td>Your balance increased by '+earned+' due to interest</td></tr>' + document.getElementById('tbody').innerHTML;

}

function start()
{
    $('#setUpModal').modal('hide');
    salary = Math.floor(Math.random()*90000)+10000;
    salaryOutput.innerHTML = salary;
    name =  nameInput.value;
    if(document.getElementById("interest").checked)
        t="Money Market Deposit";
    else
        t="Time deposit";
    interestType = t;
    firebase.auth().signInAnonymously();
    signed = true;
}

function is()
{
    if(document.getElementById("interest").checked)
        document.getElementById("interestStyle").innerHTML = "Money Market Deposit";
    else
        document.getElementById("interestStyle").innerHTML = "Time Deposit";
}

function openInput()
{
    document.getElementById('withdraw').style.display = 'none';
    document.getElementById('withdrawInput').style.display = 'block';
}

function pushToLeaderboard()
{
    
  if(interestType == "Time Deposit")
    setTimeout(pushLeader, 10000);
  else
    pushLeader();

    document.getElementById('withdraw').style.display = 'block';
    document.getElementById('withdrawInput').style.display = 'none';
    document.getElementById('withdrawInput').value = '';
    
}

function pushLeader()
{
 try {
        
        let v = parseInt(document.getElementById('withdrawInput').value);
        if(v>balance)
            alert("Invalid Withdrawl amount");
        else {
            balance-=v;
            balanceOutput.innerHTML = balance;
            ref.child('balance').set(balance);
            ref.child("leaderbalance").set(parseInt(data.leaderbalance)+v);
            document.getElementById('tbody').innerHTML = '<tr><td class="withdrew">You withdrew '+ v + ' dollars</td></tr>' + document.getElementById('tbody').innerHTML;
        }
    } catch(err) {
        alert("Invalid Withdrawl amount");    
    } 
}

function init()
{
    setInterval(payday, 5000);
    
}


