'use strict';
//life easy funcs
function _(id) {
  return document.getElementById(id);
}

//Variables linking DOM Elements
var opportunityForm = _('opportunity-form');

//All form elements
var opportunityTitle = _('new-opportunity-title');
var opportunityOrganisation = _('new-opportunity-organisation');
var opportunityAddress = _('new-opportunity-address');
var opportunityCommitment = _('new-opportunity-commitment');
var opportunityDescription = _('new-opportunity-description');
var opportunityEmail = _('new-opportunity-email');
var opportunityWebsite = _('new-opportunity-website');
var contactNumber = _('contact-number');
var locality = _('locality');
var resume = _('resume');
var workExperience = _('work-experience');
var applications = _('applications');
var applicationButton = _('application-button');
var applyButton = _('apply-button');
var applyForm = _('apply');

//Miscellaneous elements
var mainPage = _('main-page');
var splashPage = _('splash-page');
var accountPage = _('account-page');
var searchPage = _('search-page');

var accountHeader = _('account-header');

var pages = [mainPage, splashPage, accountPage, searchPage];

var googleSignInButton = _('google-sign-in-button');
var epSignInButton = _('ep-sign-in-button');
var skipButton = _('skip');
var addOpportunity = _('add-opportunity');
var addButton = _('add');
var publicPostsSection = _('public-posts-list');
var myPostsSection = _('my-posts-list');
var myFeedMenuButton = _('my-feed');
var publicFeedMenuButton = _('public-feed');
var signOutButton = _('sign-out');
var email = _('email');
var emailError = _('error-login-email');
var password = _('userpass');
var passwordError = _('error-login-password');
var storageRef = firebase.storage().ref();

function validate(str, min, max) {
  if (str.length > min && str.length <= max) {
    console.log("validation successful");
    return true;
  }
  return false;
  
}

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
  
  console.log("I worked in posting");
	//writing data to public and user feed
	var updates = {};
	updates['/opportunities/' + newOppKey] = oppData;
  updates['/user-opp/' + getUser().uid + '/' + newOppKey] = oppData;

	return firebase.database().ref().update(updates);
  
}

function postApplication(applicationObj, oppId) {
  var newAppKey = firebase.database().ref().child('applications').push().key; 
  var emptyObj = {key: newAppKey};
  var updates = {};
  var userApp = {
    user: getUser().uid
  };
  updates['/applications/' + newAppKey] = applicationObj;
  updates['/opp-app/' + oppId + '/' + newAppKey] = userApp;
  updates['/user-app/' + getUser().uid + '/' + newAppKey] = emptyObj;
  firebase.database().ref().update(updates);
}
function createOppElement(oppId, title, organisation, description, commitment, address, email, website, checkBundle){
	var uid = getUser().uid;
  //var oppKey = firebase.database().ref().child('opportunities').push().key; //explain me why is this thing here?
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
                    '<div class = "description"></div>' +
                  '</div>' + 
                '</div>' +
                '<div class="mdl-tabs__panel" id = "more-info">' + 
                  '<div class="mdl-card__supporting-text">' +
                    '<h5 class="supporting"><b> Address:</b> <span class = "address"></span></h5>' +
                    '<h5 class="supporting"><b> Email:</b> <span class = "email"></span></h5>' +
                    '<h5 class="supporting"><b> Weekly Commitment:</b> <span class = "weekly-commitment"></span></h5>' +
                    '<h5 class="supporting"><b> Website:</b> <span class = "website"></span>' +
                    '</h5>' +
                  '</div>' +
                '</div>' +
                '<div class="mdl-tabs__panel" id = "apply">' + 
                  '<form id = "application-form" class="application-form" action="#">' +
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input nm" type="text" id="applicant-name">' +
                        '<label class="mdl-textfield__label" for="applicant-name">Name</label>' +
                    '</div>' +
                    '<div class="error-message-name em" style="display:none;">' +
                      '<p style="color:red;"> Please enter your name </p>'+
                    '</div>'+
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input nm" type="text" id="applicant-email">' +
                        '<label class="mdl-textfield__label" for="applicant-email">Email</label>' +
                    '</div>' +
                    '<div class="error-message-email em" style="display:none;" >' +
                      '<p style="color:red;"> Please enter your email </p>'+
                    '</div>'+
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input nm" type="text" id="applicant-school">' +
                        '<label class="mdl-textfield__label" for="applicant-school">School</label>' +
                    '</div>' +
                    '<div class="error-message-school em" style="display:none;">' +
                      '<p style="color:red;"> Please enter your school </p>'+
                    '</div>'+
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input cb" type="text" id="applicant-contact-number">' +
                        '<label class="mdl-textfield__label" for="applicant-contact-number">Contact Number</label>' +
                    '</div>' +
                    '<div class="error-message-contact em" style="display:none;">' +
                      '<p style="color:red;"> Please fill this field </p>'+
                    '</div>'+
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input class="mdl-textfield__input cb" type="text" id="applicant-locality">' +
                        '<label class="mdl-textfield__label" for="applicant-locality">Locality</label>' +
                    '</div>' +
                    '<div class="error-message-locality em" style="display:none;">' +
                      '<p style="color:red;"> Please fill this field </p>'+
                    '</div>'+
                    '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">' +
                        '<input  type="text" rows= "3" class="mdl-textfield__input cb" type="text" id="applicant-work-experience">' +
                        '<label class="mdl-textfield__label" for="applicant-work-experience">Work Experience</label>' +
                    '</div>' +
                    '<div class="error-message-experience em" style="display:none;">' +
                      '<p style="color:red;"> Please fill this field </p>'+
                    '</div>'+
                    '<input type="file" id="file" name="file" class="file apply-button cb"/><br>' +
                    '<div class="error-message-resume em" style="display:none;">' +
                      '<p style="color:red;"> Please upload your resume </p>'+
                    '</div>'+
                    '<button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect apply-button"> Apply</button>' + 
                  '</form>' +
                '</div>' +
                '<div class="mdl-tabs__panel" id = "applications" style = "display:none;">' + 
                //we'll dynamically add divs containing titles like "Application from XYZ, clicking on the div will route to a new page with applicant details and further actions."
                '</div>' +
                '<div class="mdl-card__menu">'+
                        '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">'+
                          '<i class="material-icons">share</i>'+
                        '</button>'+
                      '</div>'+
                '<div class=" mdl-card__actions mdl-tabs__tab-bar">' +
                  '<a href="#about-panel" class="mdl-tabs__tab is-active">About </a>' +
                  '<a href="#more-info" class="mdl-tabs__tab">More</a>' +
                  '<a href="#apply" id = "apply-button" class="mdl-tabs__tab">Apply</a>' +
                  '<a href="#applications" id = "application-button" class="mdl-tabs__tab" style="display:none;">Applications</a>' +
                '</div>' + 
            '</div>';
	var div = document.createElement('div');
	div.innerHTML = html;
	var oppElement = div.firstChild;
	oppElement.getElementsByClassName('description')[0].innerText = description;
  oppElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  oppElement.getElementsByClassName('username')[0].innerText = organisation;
  oppElement.getElementsByClassName('weekly-commitment')[0].innerText = commitment;
  oppElement.getElementsByClassName('address')[0].innerText = address;
  oppElement.getElementsByClassName('email')[0].innerText = email;
  oppElement.getElementsByClassName('website')[0].innerText = website;
  componentHandler.upgradeElements(oppElement);


  var checkBundleElements = [
    oppElement.getElementsByClassName('cb')[0],
    oppElement.getElementsByClassName('cb')[1],
    oppElement.getElementsByClassName('cb')[2],
    oppElement.getElementsByClassName('cb')[3]
  ];

  var i = 0;
  while(i < checkBundle.length) {
    if (checkBundle[i] === false) {
      if (i == 3) {
        checkBundleElements[i].style.display = "none";
      } else {
        checkBundleElements[i].parentElement.style.display = "none";
      }
      console.log(checkBundleElements[i]);
    }
    i++;
  }
  console.log(checkBundle);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-textfield')[1]);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-textfield')[2]);
  //componentHandler.upgradeElements(oppElement.getElementsByClassName('mdl-tabs')[0]);

  oppElement.getElementsByClassName('application-form')[0].addEventListener('submit', function(e) {
    e.preventDefault();
    //validation

    var name = oppElement.getElementsByClassName('nm')[0].value;
    var email = oppElement.getElementsByClassName('nm')[1].value;
    var school = oppElement.getElementsByClassName('nm')[2].value;
    var errorName = oppElement.getElementsByClassName('em')[0];
    var errorEmail = oppElement.getElementsByClassName('em')[1];
    var errorSchool = oppElement.getElementsByClassName('em')[2];
    // Handle inline validation for optional fields
    var errorContact = oppElement.getElementsByClassName('em')[3];
    var errorLocality = oppElement.getElementsByClassName('em')[4];
    var errorExperience = oppElement.getElementsByClassName('em')[5];
    // Resume handling is probably done
    var errorResume = oppElement.getElementsByClassName('em')[6];
    var formComplete = true;
    if (validate(name, 2, 50) === false) {
      errorName.style.display = 'block'; //we can change this text
      formComplete = false; 
    }
    if (validate(email, 1, 50) === false) {
      errorEmail.style.display = 'block'; //we can change this text
      formComplete = false;
    }
    email = (email.length < 1) ? '-' : email;
    if (validate(school, 1, 50) === false) {
      errorSchool.style.display = 'block'; //we can change this text
      formComplete = false;
    }
    school = (school.length < 1) ? '-' : school;

    i = 0;
    while (i < checkBundle.length) {
      if (i == 3) {
        break;//file shit
      }
      if (checkBundle[i] === true) {
        var val = checkBundleElements[i].value;
        if (validate(val, 0, 50) === false) {
          errorResume.style.display = 'block';
          formComplete = false;
          return;
        }
        checkBundleElements[i].value = (val.length < 1) ? '-': val;
      } 
      i++;
    }
    
    var fileName = null;
    //i is 3 by now, congracts i, u came a long way
    if (checkBundle[i] === true) {//handling the file shit
      if (checkBundleElements[i].files.length < 1) {
        errorResume.style.display = 'block';
        formComplete = false;
        return;
      }

      var file = checkBundleElements[i].files[0];
      var fileNameArr = file.name.split('.');
      var ext = fileNameArr[fileNameArr.length - 1];
      console.log(ext);


      var fileKey = firebase.database().ref().child('files').push().key;
      var updates = {};
      updates['/files/' + fileKey] = fileKey;
      firebase.database().ref().update(updates);

      //resume storage feature
      // Get a reference to the storage service, which is used to create references in your storage bucket
      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();
      fileName = 'files/' + fileKey + '.' + ext;

      var resumesRef = storageRef.child(fileName).put(file);

      var updates = {};
      updates['/files/' + fileKey] = fileName;
      firebase.database().ref().update(updates);

    }
    if (formComplete === true) {
      var application = {
        name: name,
        email: email,
        school: school,
        contactNumber: checkBundleElements[0].value,
        locality: checkBundleElements[1].value,
        workExperience: checkBundleElements[2].value,
        resume: fileName
      };
      postApplication(application, oppId);
      swal("Your application has been submitted", "The organisation will get in touch shortly", "success");
      name = "";
      email = "";
      school = "";
    }
  }, false);

    
  return oppElement;
  
}



function startDatabaseQueries() {
	var myUserId = getUser().uid;
	var recentPostsRef = firebase.database().ref('opportunities').limitToLast(100);
	var userPostsRef = firebase.database().ref('user-opp/' + myUserId);
  
  console.log("Entering the dragon");

 

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var dat = data.val();
      var checkBundle = [
        dat.contactNumber,
        dat.locality,
        dat.workExperience,
        dat.resume
      ];
      containerElement.insertBefore(
        
        createOppElement(
          data.key,
          data.val().title,
          data.val().organisation,
          data.val().description,
          data.val().commitment,
          data.val().address,
          data.val().email,
          data.val().website,
          checkBundle), containerElement.firstChild);
      console.log("I fetched posts");
    });
  };
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

function getLoc() {
  var routLoc = window.location.hash;
  if (routLoc.length > 0) {
    routLoc = routLoc.slice(1, routLoc.length).split('/');
    var page = routLoc[0];
    var url = [];
    var i = 1;
    while (i < routLoc.length) {
      url.push(routLoc[i])
      i++;
    }
    return {
      page: page,
      url: url
    };
  }
  return false;
}

function changePage(no) {
  //newPage will be an element in the pages array
  var i = 0;
  while (i < pages.length) {
    pages[i].style.display = "none";
    if (i == 2) {
      accountHeader.style.display = "none";
    }
    i++;
  }
  pages[no].style.display = "block";
  if (pages[no] == pages[2]) {
    accountHeader.style.display = 'block';
  }
}

function routBitch() {
  var loc = getLoc();
  console.log(loc.page);
  switch (loc.page) {
    case 'search':
      changePage(3);
      break;

    default: 
      changePage(2);
      break;
  }
}

window.addEventListener('load', function() {
  routBitch();

  // Bind Email and Password Sign in button.
  
  epSignInButton.addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('userpass').value;
    if (email.length < 4) {
        emailError.style.display = "block";
        return;
    }
    if (password.length < 4) {
      passwordError.style.display = "block";
      return;
    }
    changePage(2);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.log('right in here');
          // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
          // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        passwordError.style.display = "block";
      } else {
        console.error(error);
      }
          // [END_EXCLUDE]
      });
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithPopup(provider);
  });

  googleSignInButton.addEventListener('click', function(){
    changePage(2);
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  var user = firebase.auth().currentUser;
 
  skipButton.addEventListener('click', function(){
    firebase.auth().signInAnonymously().then(function(user) {
        console.log('Anonymous Sign In Success', user);
      }).catch(function(error) {
        console.error('Anonymous Sign In Error', error);
      });
  });
  
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
      console.log(user.providerData);
      var providerName = user.providerData[0].providerId;
      console.log(providerName);
      if (providerName === "google.com") {
        console.log('I come from Google');
        addButton.style.display = 'none';
        // addButton.style.display = 'none';
        writeUserData(user.uid, user.displayName, user.email);
        startDatabaseQueries();
      } 
      else if(providerName === "password") {
        console.log('I come from Password');
        writeUserData(user.uid, user.displayName, user.email);
        startDatabaseQueries(); 
      } 
    } 
    else {
        changePage(1);
      }
  });

  // Saves message on form submit.
  opportunityForm.onsubmit = function(e) {
    e.preventDefault();
    if (opportunityDescription.value && opportunityTitle.value && opportunityOrganisation.value) {
      console.log("Reporting from submit function");
      // [START single_value_read]
      postOpportunity().then(function() {
        changePage(pages[2]);
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
}, false);
