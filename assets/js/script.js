// Assignment code here

// --- DOM Element References ---
// Gathers references to various HTML elements that the script will interact with.
const errorMessageElement = document.getElementById("msg"); // For displaying error messages
const passwordPromptsContainer = document.getElementById("password-prompts"); // Container for password criteria inputs
const passwordLengthButton = document.getElementById("btnlen"); // Button to confirm password length
const passwordLengthInput = document.getElementById("plen"); // Input field for password length
const characterTypesButton = document.getElementById("chkChar"); // Button to confirm character types

// Text area which will display password
const passwordOutputTextArea = document.querySelector("#password"); // Text area to display the generated password
let generatedPasswordStorage = ""; // Stores the most recently generated password

// --- Event Listeners ---
// Sets up interactions when the user clicks on certain buttons.
passwordLengthButton.addEventListener("click", validatePasswordLength);
characterTypesButton.addEventListener("click", handleCharacterSelectionAndGeneratePassword);

// --- Core Functions ---

// Validates the password length entered by the user.
function validatePasswordLength() {
  errorMessageElement.style.display = "none"; // Clear previous errors
  const length = parseInt(passwordLengthInput.value);

  // Password length must be between 8 and 128 characters.
  if (length < 8 || length > 128) {
    errorMessageElement.style.display = "block";
    errorMessageElement.innerText = "Password length must be between 8 and 128 characters.";
  } else {
    // If valid, update UI to proceed to character type selection.
    errorMessageElement.style.display = "none";
    passwordLengthInput.style.backgroundColor = "green";
    passwordLengthInput.disabled = true;
    const charTypesElement = document.getElementById("charTypes");
    if (charTypesElement) {
      charTypesElement.style.display = "block"; // Show character type options
    }
    passwordLengthButton.style.display = "none";
    characterTypesButton.style.display = "block";
  }
}

// Gathers the selected character types (numeric, uppercase, etc.) from the checkboxes.
function getSelectedCharacterSets() {
  let numberChars = ""; // String to hold numeric characters if selected
  let upperChars = "";  // String to hold uppercase characters if selected
  let lowerChars = "";  // String to hold lowercase characters if selected
  let specialChars = "";// String to hold special characters if selected
  let checkedCounter = 0; // Counts how many character types are selected
  const inputElements = document.getElementsByClassName('charCheckbox'); // Get all checkbox elements

  // Loop through each checkbox
  for (let i = 0; inputElements[i]; ++i) {
    if (inputElements[i].checked) { // If a checkbox is checked
      checkedCounter++;
      // Assign the corresponding character set string based on the checkbox ID
      if (inputElements[i].id === "numeric") {
        numberChars = "0123456789";
      } else if (inputElements[i].id === "uppercase") {
        upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      } else if (inputElements[i].id === "lowercase") {
        lowerChars = "abcdefghijklmnopqrstuvwxyz";
      } else if (inputElements[i].id === "specialChars") {
        specialChars = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
      }
    }
  }
  // Return an object containing all character sets and the count of selected types
  return { numberChars, upperChars, lowerChars, specialChars, checkedCounter };
}

// Handles the process after character types are selected.
// Generates the password and updates the UI.
function handleCharacterSelectionAndGeneratePassword() {
  const { numberChars, upperChars, lowerChars, specialChars, checkedCounter } = getSelectedCharacterSets();

  // Ensure at least one character type is selected.
  if (checkedCounter !== 0){
    errorMessageElement.style.display = "none";
    // Generate the password string using the selected character sets.
    generatedPasswordStorage = generatePasswordString(numberChars, upperChars, lowerChars, specialChars);
    resetPasswordGeneratorUI(); // Reset UI elements for a new password generation cycle.
    passwordPromptsContainer.style.display = 'none'; // Hide the password criteria prompts.
    // Style the output text area to indicate success.
    passwordOutputTextArea.style.backgroundColor = "Green";
    passwordOutputTextArea.style.fontSize = "1.5em";
    passwordOutputTextArea.style.overflowY = "scroll";
  } else {
    // If no character type is selected, display an error message.
    errorMessageElement.style.display = "block";
    errorMessageElement.innerText = "Please Select atleast one character type";
  }
}

// Builds a template for the password characters.
// This function aims to ensure that if a character type (e.g., numeric, uppercase) is selected,
// at least one character of that type is included in the generated password.
// The remaining slots are filled with a placeholder representing all possible characters.
function buildPasswordTemplateArray(length, { numberChars, upperChars, lowerChars, specialChars, allChars }) {
  const passwordArray = Array(length); // Create an array of the desired password length.

  // Safeguard: if allChars is empty (no types selected), initialize passwordArray elements to prevent errors.
  if (!allChars && length > 0) {
    // This case should ideally be prevented by prior checks (e.g., in handleCharacterSelectionAndGeneratePassword)
    // but as a fallback, fill with a default placeholder if needed, or handle error.
    // For now, let's assume 'allChars' will not be empty if length > 0 due to prior validation.
  } else if (length > 0) {
     passwordArray[0] = allChars; // Start with all characters for the first slot (or as a fallback for shuffling later).
  }


  let currentIndex = 0; // Index to assign guaranteed characters to ensure variety.

  // If a character type is selected, assign its character set to a slot in the passwordArray.
  // Modulo (%) operator ensures that if the password length is shorter than the number of selected types,
  // it wraps around and overwrites previous assignments. This is a simple way to ensure inclusion.
  if (numberChars) {
    passwordArray[currentIndex % length] = numberChars;
    currentIndex++;
  }
  if (upperChars) {
    passwordArray[currentIndex % length] = upperChars;
    currentIndex++;
  }
  if (lowerChars) {
    passwordArray[currentIndex % length] = lowerChars;
    currentIndex++;
  }
  if (specialChars) {
    passwordArray[currentIndex % length] = specialChars;
    currentIndex++;
  }

  // Fill any remaining undefined slots in the passwordArray with 'allChars'.
  // These slots will later be filled with random characters from the 'allChars' set.
  for (let i = 0; i < length; i++) {
    if (!passwordArray[i]) {
      passwordArray[i] = allChars;
    }
  }
  return passwordArray; // Return the template array.
}

// Generates the actual password string based on selected character types and length.
function generatePasswordString(numberChars,upperChars,lowerChars,specialChars){
  const passwordLength = parseInt(passwordLengthInput.value);
  const allChars = numberChars + upperChars + lowerChars + specialChars; // Concatenate all selected character sets.

  // If no character types are selected, allChars will be empty.
  // Return an empty string or handle as an error, though this should be caught earlier.
  if (!allChars) return "";

  // Create a template array that ensures each selected character type is represented.
  let passwordArray = buildPasswordTemplateArray(passwordLength, { numberChars, upperChars, lowerChars, specialChars, allChars });

  let stringPosition = 0; // To store the random position within a character set string.
  // For each slot in the passwordArray, pick a random character from the character set assigned to that slot.
  for (let i = 0; i < passwordLength; i++) {
    const charSet = passwordArray[i]; // Get the character set for the current slot.
    stringPosition = getRandomNumber(charSet.length); // Get a random index within that set.
    passwordArray[i] = charSet.substring(stringPosition, stringPosition + 1); // Assign the random character.
  }

  let password = passwordArray.join(''); // Join the array of characters into a final password string.

  // Fallback: A final check to ensure special characters are included if they were selected but somehow missed.
  // This is important for shorter passwords or if the template logic didn't guarantee their inclusion.
  let hasSpecialChar = false;
  if (specialChars) {
    for (let i = 0; i < password.length; i++) {
      if (specialChars.includes(password[i])) {
        hasSpecialChar = true;
        break;
      }
    }
  }

  if (specialChars && !hasSpecialChar) {
    if (password.length > 0) {
        // If special characters were missed, replace a random character in the password with a random special character.
        const randomIndex = getRandomNumber(password.length);
        const randomSpecialChar = specialChars[getRandomNumber(specialChars.length)];
        password = password.substring(0, randomIndex) + randomSpecialChar + password.substring(randomIndex + 1);
    } else if (passwordLength > 0) { // If password somehow ended up empty but length was >0 (e.g. allChars was empty)
        password = specialChars[getRandomNumber(specialChars.length)]; // Insert a special character.
    }
  }
  return password; // Return the generated password.
}

// Generates a random number up to (but not including) `max`.
function getRandomNumber(max){
  return Math.floor(Math.random() * max);
}

// Resets the password generator's UI to its initial state.
function resetPasswordGeneratorUI() {
  errorMessageElement.innerText = "";
  errorMessageElement.style.display = "none";
  passwordLengthButton.style.display = "block";
  characterTypesButton.style.display = "none";
  passwordLengthInput.value = "8"; // Default password length.
  passwordLengthInput.style.backgroundColor = "white";
  passwordLengthInput.disabled = false;

  const charTypesElement = document.getElementById("charTypes");
  if (charTypesElement) {
    charTypesElement.style.display = "none"; // Hide character type options.
  }

  // TODO: The following line (characterTypesButton.id="btnlen") was in the original code.
  // It seems to assign an ID 'btnlen' (usually for the length button) to the character types button.
  // This might be a bug or an intentional but unclear UI behavior. Review if this is correct.
  characterTypesButton.id = "btnlen";

  // It's generally good practice to remove an old listener before adding a new one if there's a chance of duplication,
  // though in this specific flow, it might not strictly be necessary.
  // passwordLengthButton.removeEventListener("click", validatePasswordLength); // Optional: remove before adding
  passwordLengthButton.addEventListener("click", validatePasswordLength);

  // Cache checkbox elements for efficiency
  const numericCheckbox = document.querySelector("#numeric");
  const uppercaseCheckbox = document.querySelector("#uppercase");
  const lowercaseCheckbox = document.querySelector("#lowercase");
  const specialCharsCheckbox = document.querySelector("#specialChars");

  // Uncheck all character type checkboxes.
  if (numericCheckbox) numericCheckbox.checked = false;
  if (uppercaseCheckbox) uppercaseCheckbox.checked = false;
  if (lowercaseCheckbox) lowercaseCheckbox.checked = false;
  if (specialCharsCheckbox) specialCharsCheckbox.checked = false;

  // Reset password output area styling and content.
  passwordOutputTextArea.style.backgroundColor = "white";
  passwordOutputTextArea.style.fontSize = "1.2rem";
  passwordOutputTextArea.value = ""; // Clear the password display
  generatedPasswordStorage = ""; // Clear the stored password
  passwordOutputTextArea.style.overflowY = "hidden";
  return ""; // UI reset functions often don't need to return a meaningful value.
}


// --- Initial Setup ---
// Get references to the #generate element (the main button to start password generation).
const generatePasswordButton = document.querySelector("#generate");

// Handles the click on the "Generate Password" button.
// Its main role is to display the password criteria prompts to the user.
function displayPasswordPrompts() {
  resetPasswordGeneratorUI(); // Reset UI. The function now also clears the password display and storage.
  // passwordOutputTextArea.value is now cleared within resetPasswordGeneratorUI.
  passwordPromptsContainer.style.display = 'flex'; // Show the password criteria input section.
}

// Add event listener to the main "Generate Password" button.
generatePasswordButton.addEventListener("click", displayPasswordPrompts);
