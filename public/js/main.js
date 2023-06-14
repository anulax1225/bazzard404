
$(document).ready(() => {
  //When the delete button is pressed
  $('.delete-article').on('click', async (e) => {
      var $target = $(e.target);
      const id = $target.attr('data-id');
      //Send ajax request of DELETE to /articles/id 
      await $.ajax({
          type:'DELETE',
          url: '/articles/'+id,
          success: function(response){
            alert('Article deleted.');
            window.location.href='/articles/';
          },
          error: function(err){
            alert('Cound\'t delete articles');
            window.location.href='/articles/';
          }
        });
  });
});

function sendAjax(data) {
  $.ajax({
    type: 'POST', 
    url: '/articles/add',
    data: data,
    async: false,
    error: (err) => {
      alert("Couldn't added article" + err)
      //window.location.href='/articles/';
    },
    success: (res) => {
      if (res == 'Success') { 
        alert('Article added.');
        window.location.href='/articles/';
      }
    },
  });
}

$(document).ready(() => {
  //When button add article is pressed
  $('#add_article').on('submit', (e) => {
    var name_input = document.getElementById('title_input');
    var body_input = document.getElementById('body_input');
    var image_input = document.getElementById('image_input');
    var image_file = image_input.files[0];
    const reader = new FileReader();
    //Reading image as DATAurl then resizing it
    reader.addEventListener('load', () => {
      var image = document.createElement('img');
      image.addEventListener('load', async () => {
        //Resizing image
        var canvas = document.createElement('canvas');
        var ratio = 100 / image.width;
        canvas.width = 100;
        canvas.height = image.height * ratio;

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        var shrink_image = context.canvas.toDataURL(image_file.type);
        //Send ajax request of POST to /articles/add
        sendAjax({
            title: name_input.value,
            image: shrink_image,
            body: body_input.value                       
          })
      });
      image.src = reader.result;
    });
    if(image_file) {
      reader.readAsDataURL(image_file);
    } else {
      sendAjax({
        title: name_input.value,
        body: body_input.value
    });
      
    }
  });
});