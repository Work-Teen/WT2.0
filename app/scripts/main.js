'use strict';
//Variables linking DOM Elements
var opportunityForm = document.getElementById('opportunity-form');

//All form elements
var opportunityTitle = document.getElementById('new-opportunity-title');
var opportunityOrganisation = document.getElementById('new-opportunity-organisation');
var opportunityAddress = document.getElementById('new-opportunity-address');
var opportunityCommitment = document.getElementById('new-opportunity-commitment');
var opportunityDescription = document.getElementById('new-opportunity-description');
var opportunityEmail = document.getElementById('new-opportunity-email');
var opportunityWebsite = document.getElementById('new-opportunity-website');
var contactNumber = document.getElementById('contact-number');
var locality = document.getElementById('locality');
var resume = document.getElementById('resume');
var workExperience = document.getElementById('work-experience');

//Miscellaneous elements
var splashPage = document.getElementById('splash-page');
var googleSignInButton = document.getElementById('google-sign-in-button');
var epSignInButton = document.getElementById('ep-sign-in-button');
var addOpportunity = document.getElementById('add-opportunity');
var addButton = document.getElementById('add');
var publicPostsSection = document.getElementById('public-posts-list');
var myPostsSection = document.getElementById('my-posts-list');
var myFeedMenuButton = document.getElementById('my-feed');
var publicFeedMenuButton = document.getElementById('public-feed');
var signOutButton = document.getElementById('sign-out');
var email = document.getElementById('email');
var password = document.getElementById('userpass');

function getTags() {
  var tagsLi = document.getElementsByClassName('tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable');
  var i = 0;
  var tags = [];
  if (tagsLi.length != undefined) {
    while (i < tagsLi.length) {
      var tagText = tagsLi[i].getElementsByClassName('tagit-label')[0].innerText;
      tags.push(tagText);
      i++;
    }
  }
  return tags;
}
/**
Pushing opportunity to database/
*/
function postOpportunity() {
  //data =  [uid, username, title, organisation, description]
	var tags = getTags();

  var oppData = {
    title: opportunityTitle.value,
    organisation: opportunityOrganisation.value,
    address: opportunityAddress.value,
    commitment: opportunityCommitment.value,
    description: opportunityDescription.value,
    email: opportunityEmail.value,
    website: opportunityWebsite.value,
    contactNumber: contactNumber.checked,
    locality: locality.checked,
    resume: resume.checked,
    workExperience: workExperience.checked,
    tags: tags
	};


  
	// new key for opportunity
	var newOppKey = firebase.database().ref().child('opportunities').push().key;
  var emptyObj = {
    oppkey: newOppKey
  };
  console.log("I worked in posting");
	//writing data to public and user feed
	var updates = {};
	updates['/opportunities/' + newOppKey] = oppData;
	updates['/user-opp/' + getUser().uid + '/' + newOppKey] = emptyObj;

	return firebase.database().ref().update(updates);
  
}

function createOppElement(oppId, title, organisation, description ) {
	var uid = getUser().uid;
  console.log("Opportunity Created");
	var html ='<div class="mdl-card mdl-shadow--6dp mdl-tabs mdl-js-tabs">' +
                '<div class = "mdl-tabs__panel is-active" id = "about-panel">' +
                  '<div class="mdl-card__title ">' + 
                    '<h4 class="mdl-card__title-text"></h4>' + 
                  '</div>' + 
                  '<div class="header">' + 
                    '<div>' + 
                      '<div class="avatar"></div>'+
                      '<div class="username mdl-color-text--black"></div>' + 
                    '</div>' + 
                  '</div>' + 
                '</div>' +
                '<div class="mdl-tabs__panel" id = "more-info">' + 
                  '<div class="mdl-card__supporting-text">' +
                    '<h5><b> Start Date:</b><span class = "start-date"></span></h5>' +
                    '<h5><b> Total Hours:</b><span class = "hours"></span></h5>' +
                    '<h5><b> Weekly Commitment:</b> <span class = "weekly-commitment"></span></h5>' +
                    '<h5><b> Organisation Description:</b> <p><span class = "organisation description"></span>' +
                    '</p></h5>' +
                  '</div>' +
                '</div>' +
                '<div class="mdl-tabs__panel" id = "apply">' + 
                  '<form id = "application-form" action="#">' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input" type="text" id="applicant-name">' +
                        '<label class="mdl-textfield__label" for="applicant-name">Name</label>' +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input" type="text" id="applicant-email">' +
                        '<label class="mdl-textfield__label" for="applicant-email">Email</label>' +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input" type="text" id="applicant-school">' +
                        '<label class="mdl-textfield__label" for="applicant-school">School</label>' +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="display:none;">' +
                        '<input class="mdl-textfield__input" type="text" id="applicant-contact-number">' +
                        '<label class="mdl-textfield__label" for="applicant-contact-number">Contact Number</label>' +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="display:none;">' +
                        '<input class="mdl-textfield__input" type="text" id="applicant-locality">' +
                        '<label class="mdl-textfield__label" for="applicant-locality">Locality</label>' +
                    '</div>' + 
                    '<input style="display:none;" type="file" id="file" name="file"/>' +
                    '<button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"> Apply</button>' + 
                  '</form>' +
                '</div>' +
                '<div class=" mdl-card__actions mdl-tabs__tab-bar">' +
                  '<a href="#about-panel" class="mdl-tabs__tab is-active">Name</a>' +
                  '<a href="#more-info" class="mdl-tabs__tab">More</a>' +
                  '<a href="#apply" class="mdl-tabs__tab">Apply</a>' +
                '</div>' + 
            '</div>'
            '</div>';
	var div = document.createElement('div');
	div.innerHTML = html;
	var oppElement = div.firstChild;
	oppElement.getElementsByClassName('description')[0].innerText = description;
  oppElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  oppElement.getElementsByClassName('username')[0].innerText = organisation;
  componentHandler.upgradeElements(oppElement);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-textfield')[1]);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-textfield')[2]);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-tabs')[0]);
  return oppElement;
  
}

function startDatabaseQueries() {
	var myUserId = getUser().uid;
	var recentPostsRef = firebase.database().ref('opportunities').limitToLast(100);
	var userPostsRef = firebase.database().ref('user-opp/' + myUserId);
  console.log(userPostsRef);

  function fetchByKey(key, sectionElement) {
    var ref = firebase.database().ref('opportunities/' + key);
    ref.on('value', function(snapshot){
      var data = snapshot.val();
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createOppElement(
          key,
          data.title,
          data.organisation,
          data.description
        ), 
        containerElement.firstChild);
      console.log("I fetched posts");
    });
  }

  function fetchPosts(postsRef, sec) {
    userPostsRef.on('child_added', function(data){
      var key = data.key;
      fetchByKey(key, sec);
    });
  }

	fetchPosts(recentPostsRef, publicPostsSection);
  fetchPosts(userPostsRef, myPostsSection);
}

function getUser() {
  return firebase.auth().currentUser;
}

function writeUserData(userId, name, email) {
	firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
  });
  console.log("I wrote user data")
}
window.addEventListener('load', function() {
  // Bind Email and Password Sign in button.
  
  epSignInButton.addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('userpass').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
          // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        console.error(error);
      }
          // [END_EXCLUDE]
      });
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithPopup(provider);
  });

  googleSignInButton.addEventListener('click', function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider); 
  });

  var user = firebase.auth().currentUser;
 
  
  
  // Bind sign out button
  signOutButton.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      email.value = '';
      password.value = '';
    }, function(error) {
        console.error('Sign Out Error', error);
      });
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    
    if (user) {
      var providerName = user.providerData[0].providerId;
      console.log(providerName);
      if (providerName === "google.com") {
        console.log('I come from Google');
        addButton.style.display = 'none';
        splashPage.style.display = 'none';
        // addButton.style.display = 'none';
        writeUserData(user.uid, user.displayName, user.email);
        startDatabaseQueries();
      } 
      else if(providerName === "password") {
        console.log('I come from Password');
        splashPage.style.display = 'none';
        writeUserData(user.uid, user.displayName, user.email);
        startDatabaseQueries(); 
      } 
    } 
    else {
        splashPage.style.display = 'block';
      }

  });

  // Saves message on form submit.
  opportunityForm.onsubmit = function(e) {
    e.preventDefault();
    if (opportunityDescription.value && opportunityTitle.value && opportunityOrganisation.value) {
      console.log("Reporting from submit function");
      // [START single_value_read]
      postOpportunity().then(function() {
        publicFeedMenuButton.click();
      });
      // [END single_value_read]
    }
  };

  // Bind menu buttons.
  publicFeedMenuButton.onclick = function() {
    publicPostsSection.style.display = 'block';
    myPostsSection.style.display = 'none';
    addOpportunity.style.display = 'none';
    publicFeedMenuButton.classList.add('is-active');
    myFeedMenuButton.classList.remove('is-active');
  };
  myFeedMenuButton.onclick = function() {
    publicPostsSection.style.display = 'none';
    myPostsSection.style.display = 'block';
    addOpportunity.style.display = 'none';
    publicFeedMenuButton.classList.remove('is-active');
    myFeedMenuButton.classList.add('is-active');
  };
  addButton.onclick = function() {
    publicPostsSection.style.display = 'none';
    myPostsSection.style.display = 'none';
    addOpportunity.style.display = 'block';
    publicFeedMenuButton.classList.remove('is-active');
    myFeedMenuButton.classList.remove('is-active');
    opportunityDescription.value = '';
    opportunityTitle.value = '';
    opportunityOrganisation.value = '';
  };
  publicFeedMenuButton.onclick();
>>>>>>> origin/master
}, false);