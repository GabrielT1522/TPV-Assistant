function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
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
  "UML": {
    "What is UML?" : "The Unified Modeling Language (UML) is a general-purpose visual modeling language that is intended to provide a standard way to visualize the design of a system.",
    "How do you represent a class in a class diagram?" : `To represent a class in a class diagram, use the following notation:
    <div class='codebox'><pre><code>
    [visibility] class ClassName {
      - attribute1: Type
      + operation1(parameter1: Type): Return Type
    }
    </code></pre><div>`
  },
  "TPV": {
    "What is TPV?": "The Temporal Property Validator (TPV) is a lightweight analysis tool for validating temporal properties on UML class diagrams. TPV implements a new analysis framework that aims to eliminate the need to learn non-UML formal specification and verification methods that can be challenging. You can download and learn more about TPV <a href='https://github.com/mustafalail/TPV-Tool' target='_blank'>here.</a>"
  },
  "OCL": {
    "What is OCL?": "The Object Constraint Language (OCL) is a declarative language describing rules applying to Unified Modeling Language models developed at IBM and is now part of the UML standard. Initially, OCL was merely a formal specification language extension for UML."
  },
  "USE": {
    "What is USE?": "The UML-based Specification Environment (USE) is a system for the specification and validation of information systems based on a subset of the Unified Modeling Language (UML) and the Object Constraint Language (OCL). The USE documentation can be found <a href='https://sourceforge.net/projects/useocl/' target='_blank'>here.</a>"
  }
};


function FAQResponse(question) {
  let answer;
  switch (question) {
    case 'UML-question':
      answer = "The Unified Modeling Language (UML) is a general-purpose visual modeling language that is intended to provide a standard way to visualize the design of a system.";
      break;
    case 'TPV-question':
      answer = "The Temporal Property Validator (TPV) is a lightweight analysis tool for validating temporal properties on UML class diagrams. TPV implements a new analysis framework that aims to eliminate the need to learn non-UML formal specification and verification methods that can be challenging. You can download and learn more about TPV <a href='https://github.com/mustafalail/TPV-Tool' target='_blank'>here.</a>";
      break;
    case 'OCL-question':
      answer = "The Object Constraint Language (OCL) is a declarative language describing rules applying to Unified Modeling Language models developed at IBM and is now part of the UML standard. Initially, OCL was merely a formal specification language extension for UML.";
      break;
    case 'USE-question':
      answer = "The UML-based Specification Environment (USE) is a system for the specification and validation of information systems based on a subset of the Unified Modeling Language (UML) and the Object Constraint Language (OCL). The USE documentation can be found <a href='https://sourceforge.net/projects/useocl/' target='_blank'>here.</a>";
      break;
    default:
      break;
  }
  faq_question = document.getElementById(question).innerText;

  document.getElementById("FAQ-text").innerHTML += `</br><p class="user-message"><strong>User:</strong> ${faq_question}</p></br>`;
  document.getElementById("FAQ-text").innerHTML += `<p class="chat-message"><strong>TPV:</strong> ${answer}</p>`;
  
}

document.getElementById("FAQ-text").innerHTML += chatMessage("Hello! Please select a category you would like to learn more about.");
function initializeFAQButtons() {
  document.getElementById("FAQ-buttons").innerHTML = "";
  for (const category in faq) {
    document.getElementById("FAQ-buttons").innerHTML += `<button id="${category}" class="special-pill-button" onclick="expandFAQ('${category}')">${category}</button>`;
  }
}
initializeFAQButtons();

function expandFAQ(value){
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

function matchQuestion(userQuestion) {
  document.getElementById("FAQ-text").innerHTML += userMessage(userQuestion);
  for (const category in faq) {
    const questions = faq[category];
    for (const question in questions) {
      if (userQuestion.toLowerCase() === question.toLowerCase()) {
        document.getElementById("FAQ-text").innerHTML += chatMessage(questions[question]);
        document.getElementById(userQuestion).style.display = "none";
        return;
      }
    }
  }
  document.getElementById("FAQ-text").innerHTML += chatMessage('I am sorry I do not understand your question.');
}

function submitFAQPrompt() {
  let prompt = document.getElementById("FAQ-message");
  let textarea = document.getElementById("FAQ-text");
  matchQuestion(prompt.value);
  prompt.value = "";
}

function submitCHATPrompt(){
  let prompt = document.getElementById("CHAT-message");
  let textarea = document.getElementById("CHAT-text");
  textarea.innerHTML += `</br>${userMessage(prompt.value)}</br>`;
  query({ "inputs": prompt.value }).then((response) => {
    textarea.innerHTML += chatMessage(JSON.stringify(response));
  });
  prompt.value = "";
}


// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-hf",
    {
      headers: { Authorization: getKey() },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function userMessage(value){
  return `<p class="user-message"><strong>User:</strong> ${value}</p>`
}

function chatMessage(value){
  return `<p class="chat-message"><strong>TPV Assistant:</strong> ${value}</p>`
}

