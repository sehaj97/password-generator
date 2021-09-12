// Assignment code here
  var msg = document.getElementById("msg");
  var passwordLengthBtn = document.getElementById("btnlen");
  var passwordLengthText = document.getElementById("plen");
  var passwordCheckCharBtn = document.getElementById("chkChar");
  var pass = "";
  
  passwordLengthBtn.addEventListener("click", checkLength);
  passwordCheckCharBtn.addEventListener("click", createPassword);

  function checkLength() {
    msg.style.display = "none";
    if(passwordLengthText.value < 8 || passwordLengthText.value > 128){
      msg.style.display = "block";
      msg.innerText = "length should be between 8-128 characters";
    } else {
      msg.style.display = "none";
      passwordLengthText.style.backgroundColor = "green";
      passwordLengthText.disabled = true;
      document.getElementById("charTypes").style.display = "block";
      passwordLengthBtn.style.display = "none"
      passwordCheckCharBtn.style.display = "block"
    }
  }

  function createPassword() { 
    var checkedCounter = 0;
    var numberChars = "";
    var upperChars = "";
    var lowerChars = "";
    var specialChars = "";
    var inputElements = document.getElementsByClassName('charCheckbox');
    for(var i=0; inputElements[i]; ++i){
      if(inputElements[i].checked){
           checkedCounter++;
      }
    }
    if (checkedCounter !== 0){
      msg.style.display = "none";
      if(document.querySelector("#numeric").checked){
        numberChars = "0123456789";
      }
      if(document.querySelector("#uppercase").checked){
        upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }
      if(document.querySelector("#lowercase").checked){
        lowerChars = "abcdefghijklmnopqrstuvwxyz";
      }
      if(document.querySelector("#specialChars").checked){
        specialChars = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
      }
      //pass = getPassword(numberChars,upperChars,lowerChars,specialChars);

    } else {
      msg.style.display = "block";
      msg.innerText = "Please Select atleast one character type";
    }
  }

  function generatePassword() {
    msg.innerText = pass;
    passwordLengthBtn.style.display = "block"
    passwordCheckCharBtn.style.display = "none"
    passwordLengthText.value="8"
    passwordLengthText.style.backgroundColor = "white";
    passwordLengthText.disabled = false;
    document.getElementById("charTypes").style.display = "none";
    passwordCheckCharBtn.id="btnlen"
    passwordLengthBtn.addEventListener("click", checkLength);
    return ""
  }


// Get references to the #generate element
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
  //display prompts for password
  var passwordPrompts = document.getElementById("password-prompts");
  passwordPrompts.style.display = 'flex';
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
