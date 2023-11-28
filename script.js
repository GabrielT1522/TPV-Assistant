function openForm() {
  document.getElementById("tpv-assistant").style.display = "block";
}

function closeForm() {
  document.getElementById("tpv-assistant").style.display = "none";
}

function showTPVAssistant() {
  var TPVAssistant = document.getElementById("tpv-assistant").style.display;
  if (TPVAssistant === "block") {
    TPVAssistant = "none";
  } else {
    TPVAssistant = "block";
  }
}

function showTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// FAQ
const faq = {
  "Hospitality": {
    "Hello": "Hi, I hope you are having a wonderful day! How can I help you?.",
    "Hi": "Hi, I hope you are having a wonderful day! How can I help you?."
  },
  "UML": {
    "What is UML?": "The Unified Modeling Language (UML) is a general-purpose visual modeling language that is intended to provide a standard way to visualize the design of a system.",
    "How do you represent a class in a class diagram?": `To represent a class in a class diagram, use the following notation:
    <div class='codebox'><pre><code>
    [visibility] class ClassName {
      - attribute1: Type
      + operation1(parameter1: Type): Return Type
    }
    </code></pre><div>`
  },
  "TPV": {
    "What is TPV?": "The Temporal Property Validator (TPV) is a lightweight analysis tool for validating temporal properties on UML class diagrams. TPV implements a new analysis framework that aims to eliminate the need to learn non-UML formal specification and verification methods that can be challenging. You can download and learn more about TPV <a href='https://github.com/mustafalail/TPV-Tool' target='_blank'>here.</a>",
    "What is a temporal property?": "Temporal properties are properties that change over time. ",
    "What are examples of temporal properties?": "There are two kinds of temporal properties: “safety” properties say our system doesn't do bad things. “liveness” properties say our system always does a good thing. “We do not violate any database constraints” is safety, “All transactions either complete or roll back” is a liveness property. ",
    "What is a safety property?": "Safety properties say our system doesn't do bad things. For example, the statement “We do not violate any database constraints” is a safety property",
    "What is a liveness property?": "Liveness properties say our system always does a good thing. For example, the statement “All transactions either complete or roll back” is a liveness property.",
  },
  "OCL": {
    "What is OCL?": "The Object Constraint Language (OCL) is a declarative language describing rules applying to Unified Modeling Language models developed at IBM and is now part of the UML standard. Initially, OCL was merely a formal specification language extension for UML."
  },
  "USE": {
    "What is USE?": "The UML-based Specification Environment (USE) is a system for the specification and validation of information systems based on a subset of the Unified Modeling Language (UML) and the Object Constraint Language (OCL). The USE documentation can be found <a href='https://sourceforge.net/projects/useocl/' target='_blank'>here.</a>"
  }
};

document.getElementById("FAQ-text").innerHTML += chatMessage("Hello! Please select a category you would like to learn more about.");
function initializeFAQButtons() {
  document.getElementById("FAQ-buttons").innerHTML = "";
  for (const category in faq) {
    if (category === "Hospitality") {
      // Skips the hospitality topic in the FAQ buttons
      continue;
    }
    document.getElementById("FAQ-buttons").innerHTML += `<button id="${category}" class="special-pill-button" onclick="expandFAQ('${category}')">${category}</button>`;
  }
}
initializeFAQButtons();

function expandFAQ(value) {
  document.getElementById("FAQ-buttons").innerHTML = "";
  document.getElementById("FAQ-buttons").innerHTML += `<button id="show-topics" class="special-pill-button" onclick="initializeFAQButtons()">Show Topics</button></br>`;
  if (faq.hasOwnProperty(value)) {
    const category = faq[value];
    for (const question in category) {
      if (category.hasOwnProperty(question)) {
        document.getElementById("FAQ-buttons").innerHTML += `<button id="${question}" class="pill-button" onclick="matchQuestion('${question}')">${question}</button>`;
      }
    }
  } else {
    console.log("Category was not found in the FAQ.");
  }
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}


function matchQuestion(userQuestion) {
  let maxSimilarValue = 0;
  let similarQuestion = "";
  document.getElementById("FAQ-text").innerHTML += userMessage(userQuestion);
  for (const category in faq) {
    const questions = faq[category];
    for (const question in questions) {
      if (userQuestion.toLowerCase() === question.toLowerCase()) {
        document.getElementById("FAQ-text").innerHTML += chatMessage(questions[question]);
        try {
          document.getElementById(userQuestion).style.display = "none";
        } catch (e) {
          console.log("Exact match.")
        }
        return;
      } else {
        cleanUserQuestion = userQuestion.replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
        cleanBankQuestion = questions[question].replace(/[&\/\\#,+()$~%.":*?<>{}]/g, '');
        //console.log(userQuestion);
        //console.log(question)
        currentSimilarValue = similarity(userQuestion, question);
        if (currentSimilarValue > maxSimilarValue) {
          maxSimilarValue = currentSimilarValue;
          similarQuestion = questions[question];
        }
        console.log(currentSimilarValue + "% similarity for " + question);
      }
    }
  }
  if (maxSimilarValue > .50) {
    document.getElementById("FAQ-text").innerHTML += chatMessage(similarQuestion);
  } else {
    document.getElementById("FAQ-text").innerHTML += chatMessage('I am sorry I do not understand. It might help if you re-word your question.');
  }

}

function submitFAQPrompt() {
  let prompt = document.getElementById("FAQ-message").value;
  if (prompt === null) {
    document.getElementById("FAQ-text").innerHTML += chatMessage('Please enter a valid question.');
    return;
  } else {
    //let textarea = document.getElementById("FAQ-text");
    matchQuestion(prompt);
  }
  prompt = "";
}

const openaiApiEndpoint = "https://api.openai.com/v1/engines/text-davinci-003/completions";

function submitCHATPrompt() {
  let textarea = document.getElementById("CHAT-text");
  let prompt = document.getElementById("CHAT-message");
  if (getAPIKey() === "") {
    textarea.innerHTML += chatMessage("Please enter your API Key in 'Help > Configure API Key'");
    return;
  } else if (prompt.value === "") {
    textarea.innerHTML += chatMessage("Please enter a prompt.");
    return;
  }


  //const sessionChatHistory = getChatHistory(textarea.innerHTML);
  const userQuestion = prompt.value;

  const messageYou = userMessage(userQuestion);
  textarea.innerHTML += messageYou;

  const loadingSpinner = '<div id="loader" class="spinner-grow spinner-grow-sm"></div>';
  textarea.innerHTML += loadingSpinner;

  //updateChatHistory(textarea, sessionChatHistory);

  generateResponse(userQuestion)
    .then(response => {
      document.getElementById("loader").remove();
      const messageAI = chatMessage(response);
      textarea.innerHTML += messageAI;
      //updateChatHistory(textarea, sessionChatHistory);
    })
    .catch(error => {
      document.getElementById("loader").remove();
      console.error('Error generating response:', error);
      const errorMessage = chatMessage("There has been an error getting a response from the API.");
      textarea.innerHTML += errorMessage;
      //updateChatHistory(textarea, sessionChatHistory);
    });

  prompt.value = "";
}


async function generateResponse(question) {
  let prompt = question;

  try {
    const response = await fetch(openaiApiEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAPIKey()}`,
      },
      method: "POST",
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.4,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.2,
        stop: null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const answer = result.choices[0].text.trim();
    return answer;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}


// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Get the FAQ input field
var FAQInput = document.getElementById("FAQ-message");

// Execute a function when the user presses a key on the keyboard
FAQInput.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("FAQ-btn").click();
  }
});

function clearText(tab){
  if (tab === "FAQ-text"){
    document.getElementById("FAQ-text").innerHTML = "";
    document.getElementById("FAQ-text").innerHTML = chatMessage("Hello! Please select a category you would like to learn more about.");
    initializeFAQButtons();
  }else{
    document.getElementById("CHAT-text").innerHTML = chatMessage("Hello! how can I help you?");
  }
}

// Get the input field
var CHATInput = document.getElementById("CHAT-message");

// Execute a function when the user presses a key on the keyboard
CHATInput.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("CHAT-btn").click();
  }
});

function userMessage(value) {
  return `<p class="user-message"><strong>User:</strong> ${value}</p></br>`
}

function chatMessage(value) {
  return `<p class="chat-message"><strong>TPV Assistant:</strong> ${value}</p></br>`
}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

function showAPIKey() {
  var x = document.getElementById("API_KEY_INPUT");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function setAPIKey() {
  var API_KEY = document.getElementById("API_KEY_INPUT").value;
  localStorage.setItem("API_KEY", API_KEY);
}

function updateAPIKey() {
  document.getElementById("API_KEY_INPUT").value = localStorage.getItem("API_KEY");
  document.getElementById("show-api-input").checked = false;
  document.getElementById("API_KEY_INPUT").type = "password";
}

function removeAPIKey() {
  localStorage.removeItem("API_KEY");
  document.getElementById("API_KEY_INPUT").value = localStorage.getItem("API_KEY");
}

function getAPIKey() {
  return localStorage.getItem("API_KEY");
}