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

function FAQResponse(question){
  let answer;
  switch(question){
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
  this.button.style.display = "none";
}

function submitPrompt(tab){
  let prompt;
  if(tab==="FAQ-text"){
    prompt = document.getElementById("FAQ-message");
  }else{
    prompt = document.getElementById("CHAT-message");
  }
  let textarea = document.getElementById(tab);
  textarea.innerHTML += `</br><p class="user-message"><strong>User:</strong> ${prompt.value}</p></br>`;
  prompt.value = "";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

$('.editable').each(function(){
  this.contentEditable = true;
});

