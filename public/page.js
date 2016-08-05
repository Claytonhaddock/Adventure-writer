

window.onload = function() {

    socket = io.connect('http://localhost:8080');
    socket.emit('connect');
    var storyBox = document.getElementById("storyTime");
    var promptBox = document.getElementById("prompt");
    var sentences = [];
    var last = 0;
    var newLine = {
        phrase: ""
    };

    form.addEventListener('submit', function(e) {
    e.preventDefault();
    promptBox.classList.add('fade-out');
    
 });

     
    
    socket.on('count', function (data) {
        
            sentences = data.whatever;
            for (var i = 0; i<sentences.length; i++) {
                console.log(sentences[i]);
                console.log(sentences.length);
            };
            var last = sentences.length-1;
            $('#prompt').text(sentences[last]);
             

            if(sentences.length>=10) {
                sentences.unshift("There once was a puppy named walter.")
                sentences.push("The end.");
                var wholeStory = sentences.join(" ");
                storyBox.innerHTML = wholeStory;
                document.querySelector('#storyTime').classList.remove('is-paused');
            }

    });
    
    
	$(document).ready(function() {
        $("#subButton").click(function() {
            newLine.phrase= $('#inputBox').val();
            socket.emit('click', newLine);
            $('#inputBox').val("");
        });
	});


}
