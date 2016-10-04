var storageRef = firebase.storage().ref();

function fileSelect(evt) {
	// body...
	evt.stopPropagation();
	evt.preventDefault();

	var file = evt.target.files[0];

	var metadata = {
		'contentType': file.type
	};

	var upload = storageRef.child('resumes').put(file, metadata);

	upload.on('state_changed', null, function(error){
		console.error('Upload failed:', error);
	}, function(){
		document.getElementById('applicant-resume').innerHTML = '<a href="' +  url + '">Applicant Resume</a>'
	});
}