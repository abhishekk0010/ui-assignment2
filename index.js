var name = '';
var encoded = null;
var fileExt = null;
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone');


///// SEARCH TRIGGER //////
function searchFromVoice() {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    console.log(speechToText);
    document.getElementById("searchbar").value = speechToText;
    search();
  }
}

function search() {
  var searchTerm = document.getElementById("searchbar").value;
  var apigClient = apigClientFactory.newClient({ apiKey: "3TX4JSS1syaieUQvBLq0gqWfJfEHiTH7woeUrkt8" });


    var body = { };
    var params = {q : searchTerm};
    var additionalParams = {headers: {
    'Content-Type':"application/json"
    }};

    apigClient.searchGet(params, body , additionalParams).then(function(res){
        console.log("success");
        console.log(res);
        showImages(res.data)
      }).catch(function(result){
          console.log(result);
          console.log("NO RESULT");
      });

}


/////// SHOW IMAGES BY SEARCH //////

function showImages(res) {
  var newDiv = document.getElementById("images");
  if(typeof(newDiv) != 'undefined' && newDiv != null){
  while (newDiv.firstChild) {
    newDiv.removeChild(newDiv.firstChild);
  }
  }
  
  console.log(res);
  if (res.length === 0 || res.results.length ===0) {
    var newContent = document.createTextNode("No image to display");
    newDiv.appendChild(newContent);
  }
  else {

    results=res.results
    // results = ['file1.jpg','pic3.jpg','check.jpg']
    for (var i = 0; i < results.length; i++) {
      console.log(results[i]);
      var newDiv = document.getElementById("images");
      //newDiv.style.display = 'inline'
      var newimg = document.createElement("img");
      var classname = randomChoice(['big', 'vertical', 'horizontal', '']);
      if(classname){newimg.classList.add();}
      
      // filename = results[i].substring(results[i].lastIndexOf('/')+1)
      newimg.src = results[i]['url'];

      newDiv.appendChild(newimg);

    }
  }
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}



///// UPLOAD IMAGES ///////

const realFileBtn = document.getElementById("realfile");

function uploadImage() {
  realFileBtn.click(); 
}

function previewFile(input) {
  var reader = new FileReader();
  name = input.files[0].name;
  fileExt = name.split(".").pop();
  
  console.log(fileExt)
  console.log("THIS IS THE EXTENSION!!")

  var onlyname = name.replace(/\.[^/.]+$/, "");
  var finalName = onlyname+"."+fileExt;
  name = finalName;

  reader.onload = function (e) {
    var src = e.target.result;
    var newImage = document.createElement("img");
    var file = document.getElementById('realfile').files[0]
    newImage.src = src;
    encoded = newImage.outerHTML;
    console.log(encoded)

    last_index_quote = encoded.lastIndexOf('"');
    if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png') {
      encodedStr = encoded.substring(33, last_index_quote);
    }
    else {
      encodedStr = encoded.substring(32, last_index_quote);
    }
    var apigClient = apigClientFactory.newClient({ apiKey: "3TX4JSS1syaieUQvBLq0gqWfJfEHiTH7woeUrkt8" });

    var params = {
        "key": name,
        "Content-Type": "image/jpg",
    };

    var additionalParams = {
      headers: {
        "Content-Type": "image/jpg",
      }
    };

    apigClient.uploadBucketKeyPut(params, file, additionalParams)
      .then(function (result) {
        console.log(result);
        console.log('success OK');
        alert("Photo Uploaded Successfully");
      }).catch(function (result) {
        console.log(result);
      });
    }
   reader.readAsDataURL(input.files[0]);
}

function newUploadPhoto() {
  var file = document.getElementById('uploaded_file').files[0];
  console.log(custom_labels.value);

  var file_data;

  var additionalParams = {
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'x-amz-meta-customLabels': custom_labels.value,
      'x-amz-meta-customLabels': custom_labels.value,
      'Content-Type': file.type
    }
  };

  url = "https://61xp9plwfe.execute-api.us-east-1.amazonaws.com/dev/upload/" + file.name;
  axios.put(url, file, additionalParams).then((response) => {
    console.log(" New " + response.data);
    console.log("Success");
    alert("Photo Uploaded Successfully");
    document.getElementById("uploadText").innerHTML = "IMAGE UPLOADED SUCCESSFULLY!";
    document.getElementById("uploadText").style.display = "block";
    document.getElementById("uploadText").style.color = "white";
    document.getElementById("uploadText").style.fontWeight = "bold";
  });
}
