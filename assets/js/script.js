// Assignment code here

// to display errors
  var msg = document.getElementById("msg");

  var passwordPrompts = document.getElementById("password-prompts");

  var passwordLengthBtn = document.getElementById("btnlen");
  var passwordLengthText = document.getElementById("plen");
  var passwordCheckCharBtn = document.getElementById("chkChar");

  // text area which will display password
  var passwordText = document.querySelector("#password");
  var pass = "";
  
  // event listeners to handle criteria on clicks
  passwordLengthBtn.addEventListener("click", checkLength);
  passwordCheckCharBtn.addEventListener("click", createPassword);

  // validate password length
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

  // validate characters and display password 
  function createPassword() { 
    var checkedCounter = 0;
    var numberChars = "";
    var upperChars = "";
    var lowerChars = "";
    var specialChars = "";
    var inputElements = document.getElementsByClassName('charCheckbox');
    // check if atleast one check box is selected
    for(var i=0; inputElements[i]; ++i){
      if(inputElements[i].checked){
           checkedCounter++;
      }
    }
    // provide values based on the type of characters selected
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
      pass = getPassword(numberChars,upperChars,lowerChars,specialChars);
      generatePassword();
      passwordPrompts.style.display = 'none';
      passwordText.style.backgroundColor = "Green";
      passwordText.style.fontSize = "1.5em";
      passwordText.style.overflowY = "scroll";
    } else {
      // display error if no character type is selected
      msg.style.display = "block";
      msg.innerText = "Please Select atleast one character type";
    }
  }

  // make Password using the characters selected in criteria
  function getPassword(numberChars,upperChars,lowerChars,specialChars){
    // create array based on length selected
     var passwordArray = Array(parseInt(passwordLengthText.value));
     // in case only one character type is selected
     var allChars = numberChars + upperChars + lowerChars + specialChars;
     passwordArray[0] = allChars;

     // set the character types for each element in array so all of the selected ones are covered in password
     for (let i = 1; i < passwordArray.length; i++) {
      if (passwordArray[i-1] === allChars && numberChars != ""){
        passwordArray[i] = numberChars;
      } else if (passwordArray[i-1] === numberChars && upperChars != ""){
        passwordArray[i] = upperChars;
      } else if (passwordArray[i-1] === upperChars && lowerChars != ""){
         passwordArray[i] = lowerChars;
       }else if (passwordArray[i-1] === lowerChars && specialChars != ""){
         passwordArray[i] = specialChars;
       } else{
        passwordArray[i] = allChars;
       }
    }
    var  stringPosition = 0;
    // select a random character for each element in array
    for (let i = 0; i < passwordArray.length; i++) {
      stringPosition=randomNumber(passwordArray[i].length);
      passwordArray[i]=passwordArray[i].substring(stringPosition,stringPosition+1);
    }
    //get array and join them to generate a password
    var password = passwordArray.join('');
    //check special characters are covered as it causes an exception sometimes
    if(password.includes(specialChars) == false && specialChars != ""){
      stringPosition=randomNumber(specialChars.length);
      password = password.replace(/.$/,specialChars.substring(stringPosition,stringPosition+1));
    }
    //return the password
     return password;
  }

  // generate a random number
  function randomNumber(initialNumber){
    return Math.floor(Math.random() * initialNumber);
  }

  // start selecting criteria for password
  function generatePassword() {
    //reset everything
    msg.innerText = "";
    msg.style.display = "none";
    passwordLengthBtn.style.display = "block"
    passwordCheckCharBtn.style.display = "none"
    passwordLengthText.value="8"
    passwordLengthText.style.backgroundColor = "white";
    passwordLengthText.disabled = false;
    document.getElementById("charTypes").style.display = "none";
    passwordCheckCharBtn.id="btnlen"
    passwordLengthBtn.addEventListener("click", checkLength);
    document.querySelector("#numeric").checked = false;
    document.querySelector("#uppercase").checked = false;
    document.querySelector("#lowercase").checked = false;
    document.querySelector("#specialChars").checked = false;
    passwordText.style.backgroundColor = "white";
    passwordText.style.fontSize = "1.2rem";
    passwordText.value = pass;
    passwordText.style.overflowY = "hidden";
    return "";
  }


// Get references to the #generate element
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  passwordText.value = password;

  //display prompts for password criteria
  var passwordPrompts = document.getElementById("password-prompts");
  passwordPrompts.style.display = 'flex';
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
