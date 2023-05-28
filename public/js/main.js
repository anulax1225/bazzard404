$(document).ready(() => {
    //When the delete button is pressed
    $('.delete-article').on('click', async (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        //Send ajax request of DELETE to /articles/id 
        await $.ajax({
            type:'DELETE',
            url: '/articles/'+id,
            success: function(response){
              alert('Article deleted.')
              window.location.href='/articles/';
            },
            error: function(err){
              window.location.href='/articles/';
            }
          });
    });
});



$(document).ready(() => {
  //When button add article is pressed
  $('#add_article').on('submit', (e) => {
    var image_input = document.getElementById('image_input');
    var image_file = image_input.files[0];
    if (image_file) {
      const reader = new FileReader();
      var image = document.createElement('img');
      var canvas = document.createElement('canvas');
      //Reading image as DATAurl then resizing it
      reader.addEventListener('load', async () => {
        image.addEventListener('load', async () => {

          ratio = 100 / image.width;
          canvas.width = 100;
          canvas.height = image.height * ratio;
  
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          shrink_image = context.canvas.toDataURL(image_file.type);
          var name_input = document.getElementById('title_input');
          var body_input = document.getElementById('body_input');
          //Send ajax request of POST to /articles/add
          await $.ajax({
            type: 'POST', 
            path: '/articles/add',
            data: {
              title: name_input.value,
              image: shrink_image,
              body: body_input.value                       
            },
          }, (res) => {
            window.location.href = '/articles' 
          });
        });
        image.src = reader.result;
      });
      reader.readAsDataURL(image_file);
    }
  });
});