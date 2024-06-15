const firebaseConfig = {
  apiKey: "AIzaSyADCXJAtMSX0Fi8jtgz90yF-DepnijSogE",
  authDomain: "full-fota.firebaseapp.com",
  databaseURL: "https://full-fota-default-rtdb.firebaseio.com",
  projectId: "full-fota",
  storageBucket: "full-fota.appspot.com",
  messagingSenderId: "442262673816",
  appId: "1:442262673816:web:83fd86baf7d2998f4473ed",
  measurementId: "G-3BB8NP6WHM"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

// URLs for each file 
const files = [
  'https://github.com/ebrahem1812/file-update/blob/4cafdd4049e1399ccbe411266aa04aaff737dc92/package1.bin',
  ''
];

// Function to upload files
function uploadFile(fileUrl) {
  const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const fetchUrl = corsProxyUrl + fileUrl;

  fetch(fetchUrl)
    .then(response => response.blob())
    .then(blob => {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(fileUrl.split('/').pop()); // Get the file name from URL
      return fileRef.put(blob);
    })
    .then(() => {
      console.log('File uploaded successfully!');
      return incrementVersion();
    })
    .catch(error => {
      console.error('Error during the file upload:', error);
    });
}

function incrementVersion() {
  const versionRef = database.ref("updating-form/Version");
  versionRef.transaction(currentVersion => {
    return (currentVersion || 0) + 1;
  }).then(transactionResult => {
    console.log('Version incremented successfully!', transactionResult.snapshot.val());
  }).catch(error => {
    console.error('Error incrementing the version:', error);
  });
}

// Event listeners for each upload button
document.getElementById('upload1').addEventListener('click', () => uploadFile(files[0]));
document.getElementById('upload2').addEventListener('click', () => uploadFile(files[1]));
// document.getElementById('upload3').addEventListener('click', () => uploadFile(files[2]));
