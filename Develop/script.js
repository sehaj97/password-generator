// Assignment code here
  var msg = document.getElementById("msg");
  var passwordLengthBtn = document.getElementById("btnlen");
  var passwordLengthText = document.getElementById("plen");
  
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
  }
}


// Get references to the #generate element
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = '';
  //generatePassword();
  var passwordText = document.querySelector("#password");
  //display prompts for password
  var passwordPrompts = document.getElementById("password-prompts");
  
  //checkPrompts();

  passwordText.value = password;
  passwordPrompts.style.display = 'flex';
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
