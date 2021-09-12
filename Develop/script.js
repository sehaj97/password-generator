// Assignment code here
  var msg = document.getElementById("msg");
  var passwordLengthBtn = document.getElementById("btnlen");
  var passwordLengthText = document.getElementById("plen");
  var passwordCheckCharBtn = ""
  
  passwordLengthBtn.addEventListener("click", checkLength);

  function checkLength() {
    msg.innerText = "";
    if(passwordLengthText.value < 8 || passwordLengthText.value > 128){
      msg.innerText = "length should be between 8-128 characters";s
    } else {
      msg.innerText = "";
      passwordLengthText.style.backgroundColor = "green";
      passwordLengthText.disabled = true;
      document.getElementById("charTypes").style.display = "block";
      passwordLengthBtn.id= "checkChar";
      passwordCheckCharBtn = document.getElementById("checkChar");
      passwordCheckCharBtn.addEventListener("click", createPassword);
    }
  }

  function createPassword() {
    msg.innerText = "I work";
  }

  function generatePassword() {
    msg.innerText = "";
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
