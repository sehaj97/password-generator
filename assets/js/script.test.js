// Basic Test Utilities
const tests = [];
let currentDescribe = "";

function describe(description, fn) {
  currentDescribe = description;
  fn();
  currentDescribe = "";
}

function it(description, fn) {
  tests.push({
    describe: currentDescribe,
    it: description,
    fn: fn
  });
}

function runTests() {
  let successes = 0;
  let failures = 0;
  console.log("Running tests...\n");

  tests.forEach(test => {
    const testName = `${test.describe} - ${test.it}`;
    try {
      test.fn();
      console.log(`%cPASS: ${testName}`, "color: green;");
      successes++;
    } catch (e) {
      console.error(`%cFAIL: ${testName}`, "color: red;");
      console.error(e);
      failures++;
    }
  });

  console.log(`\n--- Test Summary ---`);
  console.log(`Total tests: ${tests.length}`);
  console.log(`%cSuccesses: ${successes}`, "color: green;");
  if (failures > 0) {
    console.log(`%cFailures: ${failures}`, "color: red;");
  } else {
    console.log("All tests passed!");
  }
  console.log("--------------------");
}

// Mock DOM Elements and related variables from script.js that are needed for tests
// These will be reset/configured by individual tests as needed.
let mockPasswordLengthInput = {};
let mockErrorMessageElement = {};
let mockCharTypesElement = {}; // Assuming this is document.getElementById("charTypes")
let mockPasswordLengthButton = {};
let mockCharacterTypesButton = {};
let mockNumericCheckbox = {};
let mockUppercaseCheckbox = {};
let mockLowercaseCheckbox = {};
let mockSpecialCharsCheckbox = {};

// Mock for document.getElementById
const originalGetElementById = document.getElementById;
document.getElementById = (id) => {
  if (id === "msg") return mockErrorMessageElement;
  if (id === "plen") return mockPasswordLengthInput;
  if (id === "charTypes") return mockCharTypesElement;
  if (id === "btnlen") return mockPasswordLengthButton;
  if (id === "chkChar") return mockCharacterTypesButton;
  // Add other IDs if needed by functions under test
  return originalGetElementById ? originalGetElementById(id) : null; // Fallback for other IDs if any
};

// Mock for document.getElementsByClassName
const originalGetElementsByClassName = document.getElementsByClassName;
document.getElementsByClassName = (className) => {
  if (className === 'charCheckbox') {
    return [
      mockLowercaseCheckbox,
      mockUppercaseCheckbox,
      mockNumericCheckbox,
      mockSpecialCharsCheckbox,
    ].filter(cb => cb && cb.id); // Filter out uninitialized mocks. Ensure mocks are set up in test's beforeEach.
  }
  return originalGetElementsByClassName ? originalGetElementsByClassName(className) : [];
};

// Mock for document.querySelector
const originalQuerySelector = document.querySelector;
document.querySelector = (selector) => {
  if (selector === "#numeric") return mockNumericCheckbox;
  if (selector === "#uppercase") return mockUppercaseCheckbox;
  if (selector === "#lowercase") return mockLowercaseCheckbox;
  if (selector === "#specialChars") return mockSpecialCharsCheckbox;
  // Add other selectors if needed by functions under test e.g. #password for passwordOutputTextArea
  if (selector === "#password") { // Though passwordOutputTextArea is usually manipulated directly via its global var
      // This mock might only be needed if a function specifically does document.querySelector("#password")
      // For now, assume direct manipulation or getElementById("password") if that's used.
      // Let's assume the global mock `passwordOutputTextArea` (if it were defined) would be used.
  }
  return originalQuerySelector ? originalQuerySelector(selector) : null; // Fallback
};


// --- Test Suites ---

describe("getRandomNumber()", () => {
  it("should return a number within the range [0, max-1]", () => {
    const max = 10;
    const result = getRandomNumber(max);
    console.assert(result >= 0 && result < max, `Expected number between 0 and ${max-1}, got ${result}`);
  });

  it("should return 0 when max is 1", () => {
    const result = getRandomNumber(1);
    console.assert(result === 0, `Expected 0, got ${result}`);
  });

  it("should handle max value of 0 (edge case, though Math.random()*0 is 0)", () => {
    const result = getRandomNumber(0);
    console.assert(result === 0, `Expected 0, got ${result}`);
  });
});

// Helper to reset all global DOM mocks. Call in a general beforeEach or test-specific.
function resetGlobalDomMocks() {
  mockPasswordLengthInput = { value: "8", style: {}, disabled: false };
  mockErrorMessageElement = { innerText: "", style: { display: "none" } };
  mockCharTypesElement = { style: { display: "none" } };
  mockPasswordLengthButton = { style: { display: "block" } };
  mockCharacterTypesButton = { style: { display: "none" } };

  // Checkboxes for getSelectedCharacterSets and resetPasswordGeneratorUI
  mockLowercaseCheckbox = { id: "lowercase", checked: false, querySelectorId: "#lowercase" }; // Added querySelectorId for easier mapping if needed
  mockUppercaseCheckbox = { id: "uppercase", checked: false, querySelectorId: "#uppercase" };
  mockNumericCheckbox = { id: "numeric", checked: false, querySelectorId: "#numeric" };
  mockSpecialCharsCheckbox = { id: "specialChars", checked: false, querySelectorId: "#specialChars" };

  // Other elements that might be manipulated by functions under test
  // e.g. passwordOutputTextArea, passwordPromptsContainer from script.js
  // These are not typically queried by document.getElementById in the functions themselves,
  // but are global variables in script.js. For testing, we might need to provide mock versions
  // if the functions directly modify them and we want to inspect those modifications.
  // For now, validatePasswordLength and getSelectedCharacterSets primarily interact via the mocked query functions.
}


describe("validatePasswordLength()", () => {
  beforeEach(resetGlobalDomMocks);

  it("should validate correct length (e.g., 8)", () => {
    mockPasswordLengthInput.value = "8";
    validatePasswordLength();
    console.assert(mockErrorMessageElement.style.display === "none", "Error message should be hidden for valid length");
    console.assert(mockPasswordLengthInput.disabled === true, "Input should be disabled on valid length");
    console.assert(mockCharTypesElement.style.display === "block", "Char types should become visible");
  });

  it("should invalidate length less than 8 (e.g., 7)", () => {
    mockPasswordLengthInput.value = "7";
    validatePasswordLength();
    console.assert(mockErrorMessageElement.style.display === "block", "Error message should be visible for invalid length < 8");
    console.assert(mockErrorMessageElement.innerText === "Password length must be between 8 and 128 characters.", "Correct error message for too short");
  });

  it("should invalidate length greater than 128 (e.g., 129)", () => {
    mockPasswordLengthInput.value = "129";
    validatePasswordLength();
    console.assert(mockErrorMessageElement.style.display === "block", "Error message should be visible for invalid length > 128");
    console.assert(mockErrorMessageElement.innerText === "Password length must be between 8 and 128 characters.", "Correct error message for too long");
  });

  it("should invalidate non-numeric length (e.g., 'abc')", () => {
    mockPasswordLengthInput.value = "abc";
    validatePasswordLength(); // parseInt("abc") is NaN
    console.assert(mockErrorMessageElement.style.display === "block", "Error message should be visible for NaN length");
     console.assert(mockErrorMessageElement.innerText === "Password length must be between 8 and 128 characters.", "Correct error message for NaN");
  });
});

describe("getSelectedCharacterSets()", () => {
  beforeEach(resetGlobalDomMocks); // Use the global reset

  it("should return empty strings and 0 count if no checkboxes are checked", () => {
    const result = getSelectedCharacterSets();
    console.assert(result.numberChars === "", "Numeric chars should be empty");
    console.assert(result.upperChars === "", "Uppercase chars should be empty");
    console.assert(result.lowerChars === "", "Lowercase chars should be empty");
    console.assert(result.specialChars === "", "Special chars should be empty");
    console.assert(result.checkedCounter === 0, "Checked counter should be 0");
  });

  it("should return correct set for only lowercase", () => {
    mockLowercaseCheckbox.checked = true;
    const result = getSelectedCharacterSets();
    console.assert(result.lowerChars === "abcdefghijklmnopqrstuvwxyz", "Lowercase selected");
    console.assert(result.checkedCounter === 1, "Counter should be 1");
  });

  it("should return correct sets for lowercase and numeric", () => {
    mockLowercaseCheckbox.checked = true;
    mockNumericCheckbox.checked = true;
    const result = getSelectedCharacterSets();
    console.assert(result.lowerChars === "abcdefghijklmnopqrstuvwxyz", "Lowercase selected");
    console.assert(result.numberChars === "0123456789", "Numeric selected");
    console.assert(result.upperChars === "", "Uppercase empty");
    console.assert(result.checkedCounter === 2, "Counter should be 2");
  });

  it("should return all sets if all are checked", () => {
    mockLowercaseCheckbox.checked = true;
    mockNumericCheckbox.checked = true;
    mockUppercaseCheckbox.checked = true;
    mockSpecialCharsCheckbox.checked = true;
    const result = getSelectedCharacterSets();
    console.assert(result.lowerChars === "abcdefghijklmnopqrstuvwxyz");
    console.assert(result.numberChars === "0123456789");
    console.assert(result.upperChars === "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    console.assert(result.specialChars === " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");
    console.assert(result.checkedCounter === 4);
  });
});

describe("generatePasswordString()", () => {
  beforeEach(resetGlobalDomMocks); // Use the global reset

  // Utility to check if a password contains at least one character from a given character set
  function passwordContainsCharsFromSet(password, charSet) {
    if (!charSet) return false; // If the character set is empty, password cannot contain chars from it.
    for (let i = 0; i < password.length; i++) {
      if (charSet.includes(password[i])) {
        return true;
      }
    }
    return false;
  }


  it("should generate a password of the correct length", () => {
    mockPasswordLengthInput.value = "10";
    const pass = generatePasswordString("abc", "ABC", "123", "!@#");
    console.assert(pass.length === 10, `Expected length 10, got ${pass.length}`);
  });

  it("should generate a password with only lowercase if only lowercase is provided", () => {
    mockPasswordLengthInput.value = "15";
    const lc = "abcdefghijklmnopqrstuvwxyz";
    const pass = generatePasswordString(lc, "", "", "");
    console.assert(pass.length === 15, `Expected length 15, got ${pass.length}`);
    let onlyLc = true;
    for (let char of pass) {
      if (!lc.includes(char)) {
        onlyLc = false;
        break;
      }
    }
    console.assert(onlyLc, `Password ${pass} should only contain lowercase characters.`);
  });

  it("should include characters from all selected sets (high probability)", () => {
    mockPasswordLengthInput.value = "20"; // Longer password increases chance of all sets being used
    const lc = "abcdefghijklmnopqrstuvwxyz";
    const uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";
    const sp = "!@#$%^&*()";
    // Run multiple times due to randomness of buildPasswordTemplateArray's initial fill
    let success = false;
    for (let i = 0; i < 10; i++) { // Try a few times
        const pass = generatePasswordString(lc, uc, num, sp);
        if (pass.length === 20 &&
            passwordContainsCharsFromSet(pass, lc) &&
            passwordContainsCharsFromSet(pass, uc) &&
            passwordContainsCharsFromSet(pass, num) &&
            passwordContainsCharsFromSet(pass, sp)) {
            success = true;
            break;
        }
    }
    console.assert(success, `Password should contain chars from all selected sets (lc, uc, num, sp). Last attempt: ${generatePasswordString(lc, uc, num, sp)} (might require multiple runs due to randomness)`);
  });

  it("should return an empty string if all character sets are empty", () => {
    mockPasswordLengthInput.value = "10";
    const pass = generatePasswordString("", "", "", "");
    console.assert(pass === "", `Expected empty string, got "${pass}"`);
  });

   it("should generate with minimum length (e.g. 8)", () => {
    mockPasswordLengthInput.value = "8";
    const lc = "abc"; // Small sets to make it easier to verify inclusion
    const uc = "DEF";
    const pass = generatePasswordString(lc, uc, "", "");
    console.assert(pass.length === 8, `Expected length 8, got ${pass.length}`);
    console.assert(passwordContainsCharsFromSet(pass, lc) && passwordContainsCharsFromSet(pass, uc), `Password ${pass} must contain from ${lc} and ${uc}`);
  });

});

describe("resetPasswordGeneratorUI()", () => {
  let mockPasswordOutputTextArea; // This is a global in script.js
  let mockGeneratedPasswordStorage; // This is a global in script.js

  beforeEach(() => {
    resetGlobalDomMocks(); // Resets plen, msg, charTypes, buttons, checkboxes

    // Mock the global variables from script.js that resetPasswordGeneratorUI interacts with directly
    // In a real module system, these would be imported and potentially spied on/mocked.
    // Here, we assume they are global and we need to simulate their state for the test.
    mockPasswordOutputTextArea = { value: "old_password", style: { backgroundColor: "", fontSize: "", overflowY: "" } };
    mockGeneratedPasswordStorage = "old_password_storage";

    // Link mockPasswordOutputTextArea to how script.js might access it (if it uses getElementById for it)
    // However, script.js uses a global const passwordOutputTextArea = document.querySelector("#password");
    // So, our document.querySelector mock needs to return this if #password is queried.
    // For simplicity, we'll assume resetPasswordGeneratorUI directly uses the (conceptually) global passwordOutputTextArea.
    // We need to ensure our test can inspect this mock.
    // The test will call resetPasswordGeneratorUI(), then check mockPasswordOutputTextArea and mockGeneratedPasswordStorage.

    // To make resetPasswordGeneratorUI affect our *mock* of passwordOutputTextArea and generatedPasswordStorage,
    // we have a challenge since they are global in script.js.
    // The simplest way without altering script.js for exports is to temporarily assign to window scope
    // or rely on the fact that tests are in the same global scope in a browser-like environment.
    // For this subtask, we will assume that the `passwordOutputTextArea` and `generatedPasswordStorage`
    // inside `resetPasswordGeneratorUI` will refer to these mock versions if they were available in the global scope
    // where `script.js` functions operate. This is a limitation of not having modules.
    // A more robust way would be to pass them as parameters, or use a dependency injection pattern.

    // Let's make them available on a temporary global context for the test duration.
    // This is a hack due to lack of modules.
    globalThis.passwordOutputTextArea = mockPasswordOutputTextArea;
    globalThis.generatedPasswordStorage = mockGeneratedPasswordStorage; // script.js uses `let generatedPasswordStorage`
                                                                    // so this mock won't directly be modified unless
                                                                    // script.js is changed or this test setup is more advanced.
                                                                    // For now, we will check the DOM elements it *does* control.
                                                                    // The function itself assigns to `generatedPasswordStorage = ""`
                                                                    // so we can check if our `globalThis.generatedPasswordStorage` changes
                                                                    // IF `let generatedPasswordStorage` was on `window` (which it isn't with `let`).

    // The most practical part to test is the direct DOM manipulations and checkbox resets.
    // We will assume `generatedPasswordStorage` is reset within its own scope in `script.js`.
    // We *can* check `mockPasswordOutputTextArea.value`.
  });

  it("should reset UI elements to their initial state", () => {
    // Simulate some non-initial state
    mockErrorMessageElement.innerText = "Some error";
    mockErrorMessageElement.style.display = "block";
    mockPasswordLengthInput.value = "20";
    mockPasswordLengthInput.disabled = true;
    mockCharTypesElement.style.display = "block";
    mockPasswordLengthButton.style.display = "none";
    mockCharacterTypesButton.style.display = "block";
    mockNumericCheckbox.checked = true;
    globalThis.passwordOutputTextArea.value = "AStrongPassword123!"; // Use globalThis to modify the mock

    resetPasswordGeneratorUI();

    console.assert(mockErrorMessageElement.innerText === "", "Error message text should be cleared");
    console.assert(mockErrorMessageElement.style.display === "none", "Error message should be hidden");
    console.assert(mockPasswordLengthButton.style.display === "block", "Length button should be visible");
    console.assert(mockCharacterTypesButton.style.display === "none", "Char types button should be hidden");
    console.assert(mockPasswordLengthInput.value === "8", "Password length input should be reset to 8");
    console.assert(mockPasswordLengthInput.disabled === false, "Password length input should be enabled");
    console.assert(mockCharTypesElement.style.display === "none", "Char types section should be hidden");

    console.assert(mockNumericCheckbox.checked === false, "Numeric checkbox should be unchecked");
    console.assert(mockUppercaseCheckbox.checked === false, "Uppercase checkbox should be unchecked");
    console.assert(mockLowercaseCheckbox.checked === false, "Lowercase checkbox should be unchecked");
    console.assert(mockSpecialCharsCheckbox.checked === false, "SpecialChars checkbox should be unchecked");

    console.assert(globalThis.passwordOutputTextArea.value === "", "Password output text area should be cleared");
    // console.assert(globalThis.generatedPasswordStorage === "", "generatedPasswordStorage should be cleared"); // This is hard to test without modules for `let` variables
  });

  it("should ensure characterTypesButton id is set to 'btnlen' (per original code)", () => {
    resetPasswordGeneratorUI();
    console.assert(mockCharacterTypesButton.id === "btnlen", "Character types button ID should be 'btnlen'");
  });
});

describe("handleCharacterSelectionAndGeneratePassword()", () => {
  let mockPasswordPromptsContainer; // Global in script.js
  let mockPasswordOutputTextArea_HCSAGP; // Specific mock for this describe block for clarity
                                       // to avoid confusion with globalThis.passwordOutputTextArea in resetPasswordGeneratorUI tests.
                                       // This represents the `passwordOutputTextArea` global from script.js

  // Store original functions to mock and restore
  let originalGetSelectedCharacterSets;
  let originalGeneratePasswordString;
  let originalResetPasswordGeneratorUI;

  beforeEach(() => {
    resetGlobalDomMocks(); // Resets error msg, input fields, checkboxes etc.

    mockPasswordPromptsContainer = { style: { display: "flex" } }; // Initial state for testing hide
    mockPasswordOutputTextArea_HCSAGP = {
        value: "",
        style: { backgroundColor: "white", fontSize: "1.2rem", overflowY: "hidden" }
    };

    // Assign to globalThis so the function in script.js can (conceptually) access these mocks
    // This is a workaround for not having modules.
    globalThis.passwordPromptsContainer = mockPasswordPromptsContainer;
    globalThis.passwordOutputTextArea = mockPasswordOutputTextArea_HCSAGP; // The function uses `passwordOutputTextArea`
    globalThis.generatedPasswordStorage = ""; // Reset this as well

    // Mock the functions that handleCharacterSelectionAndGeneratePassword calls
    originalGetSelectedCharacterSets = getSelectedCharacterSets;
    originalGeneratePasswordString = generatePasswordString;
    originalResetPasswordGeneratorUI = resetPasswordGeneratorUI;

    // Default mock implementations (can be overridden in specific 'it' blocks)
    getSelectedCharacterSets = () => ({
      numberChars: "123", upperChars: "ABC", lowerChars: "abc", specialChars: "!@#", checkedCounter: 4
    });
    generatePasswordString = (num, up, low, sp) => "mockPassword123!";
    resetPasswordGeneratorUI = () => { /* Simulate reset; specific checks for reset are in its own describe */ };
  });

  afterEach(() => {
    // Restore original functions
    getSelectedCharacterSets = originalGetSelectedCharacterSets;
    generatePasswordString = originalGeneratePasswordString;
    resetPasswordGeneratorUI = originalResetPasswordGeneratorUI;
    // Clean up globalThis mocks
    delete globalThis.passwordPromptsContainer;
    delete globalThis.passwordOutputTextArea;
    delete globalThis.generatedPasswordStorage;
  });

  it("should display an error if no character types are selected", () => {
    getSelectedCharacterSets = () => ({ checkedCounter: 0 }); // Override mock for this test

    handleCharacterSelectionAndGeneratePassword();

    console.assert(mockErrorMessageElement.style.display === "block", "Error message should be visible");
    console.assert(mockErrorMessageElement.innerText === "Please Select atleast one character type", "Correct error message for no types selected");
  });

  it("should generate password and update UI if character types are selected", () => {
    let generateStringCalledWith = null;
    generatePasswordString = (num, up, low, sp) => {
      generateStringCalledWith = { num, up, low, sp };
      return "newMockPassword!@#";
    };
    let resetUICalled = false;
    resetPasswordGeneratorUI = () => { resetUICalled = true; };

    handleCharacterSelectionAndGeneratePassword();

    console.assert(mockErrorMessageElement.style.display === "none", "Error message should be hidden");
    console.assert(generateStringCalledWith !== null, "generatePasswordString should have been called");
    console.assert(generateStringCalledWith.num === "123", "generatePasswordString called with correct num chars");
    // Note: globalThis.generatedPasswordStorage would be set by the actual generatePasswordString
    // Here we check our mock was called.

    console.assert(resetUICalled, "resetPasswordGeneratorUI should have been called");

    console.assert(globalThis.passwordPromptsContainer.style.display === 'none', "Password prompts should be hidden");
    console.assert(globalThis.passwordOutputTextArea.style.backgroundColor === "Green", "Password output BG should be Green");
    console.assert(globalThis.passwordOutputTextArea.style.fontSize === "1.5em", "Password output font size updated");
    console.assert(globalThis.passwordOutputTextArea.style.overflowY === "scroll", "Password output overflowY updated");
  });
});


// Placeholder for beforeEach logic if needed by describe blocks
// This is a simplified version; proper test frameworks have better scoping for this.
let currentBeforeEach = null;
const originalDescribe = describe;
describe = (description, fn) => {
  currentBeforeEach = null; // Reset for outer describes
  originalDescribe(description, fn);
};
const originalIt = it;
it = (description, fn) => {
  const testFn = fn;
  const beforeEachFn = currentBeforeEach; // Capture current beforeEach
  originalIt(description, () => {
    if (beforeEachFn) beforeEachFn();
    testFn();
  });
};
function beforeEach(fn) {
  currentBeforeEach = fn;
}


// Run all defined tests
// This would typically be invoked by a test runner.
// For this environment, you might call runTests() explicitly
// after script.js and script.test.js are loaded.
// To make this self-executing for now (assuming script.js is loaded):
// Ensure all functions from script.js are available globally or imported.
// We are assuming they are global for this exercise.

// --- IMPORTANT ---
// To actually run these tests:
// 1. Ensure `script.js` is loaded before `script.test.js`.
// 2. Call `runTests()` at the end of this file or in an HTML runner.

// Example of how you might run it if this file was included in an HTML page after script.js:
// document.addEventListener('DOMContentLoaded', () => {
//   runTests();
// });
// For now, to make it runnable in some Node-like/direct script execution contexts for testing the tests themselves:
if (typeof getRandomNumber === 'undefined') {
    console.warn("Warning: script.js functions not found. Mocking them for test structure validation only.");
    getRandomNumber = (max) => Math.floor(Math.random() * max);
    validatePasswordLength = () => {}; // No-op
    getSelectedCharacterSets = () => ({ numberChars: "", upperChars: "", lowerChars: "", specialChars: "", checkedCounter: 0 });
    generatePasswordString = () => ""; // Empty string
}

runTests();
