$(document).on("click", "#scrapeArticles", function() {
    // Empty the articles from the note section
    $("#articles").empty();
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .then(function(data) {
        alert(`You have scraped ${data.length} articles`);
        console.log(data);
        $("#articles").append('<h4 class="text-center font-weight-lighter">Recent Articles</h4>')
        for (let i = 0; i < data.length; i++) {
          
        $("#articles").append(`
        <div id='card-${data[i]._id}' class='card card${data[i]._id}'>
          <div class='card-body'>
            <div class='card-header' id='card${data[i]._id}'>
              <button id='button-${data[i]._id}' data-id='${data[i]._id}' type='submit' class='save btn btn-outline-secondary'>Save Article</button>
                <a target='_blank' href='${data[i].link}'>
                  <h2  id='title-${i}'>${data[i].title}</h2></a>
                    <span>${moment(data[i].time).fromNow()}</span>
                  </div>
                <div>
                  <img class='img-fluid' src='${data[i].pic}'>
                </div>
                <div class='card-body'><blockquote class='blockquote mb-0'>
                  <div id='text-${i}' class='text'>${data[i].summary}
                  </footer>
                  </blockquote>
                </div>
              </div>
            </div>`);
            $(".showNote").append(`
            <div class='modal fade' id='showNote${data[i]._id}' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
              <div class='modal-dialog' role='document'>
                <div class='modal-content'>
                  <div class='modal-header'>
                    <h5 class='modal-title' id='exampleModalLabel'>
                      Note for Article <span class='font-italic'>"${data[i].title}"</span>
                    </h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                    <div class='modal-body'><div id='list-note-${data[i]._id}'>
                    </div>
                    </br>
                      <div>
                        <textarea id='text-note${data[i]._id}' placeholder=' Write note here'></textarea>
                      </div>
                </div>
                  <div class='modal-footer'>
                    <button data-note='${data[i]._id}' type='button' class='note btn btn-secondary' data-dismiss='modal'>
                      Save Note
                    </button>
                </div>
              </div>
            </div>`);       
        }
      });
  });
  //saved articles
  $(document).on("click", "#savedArticles", function() {
    // Empty the articles from the note section
    $("#articles").empty();
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/saved"
    })
      .then(function(data) {
        //console.log(data);
        $("#articles").append('<h4 class="text-center font-weight-lighter">Saved Articles</h4>')
        for (let i = 0; i < data.length; i++) {
          
        $("#articles").append(`
        <div id='cardbod-${data[i]._id}' class='card card${data[i]._id}'>
          <div class='card-body'>
            <div class='card-header' id='card${data[i]._id}'>
            <button type='button' data-id='${data[i]._id}' class='note-show btn btn-outline-secondary' data-toggle='modal' data-target='#showNote${data[i]._id}'>Notes</button> <button id='button-${data[i]._id}' data-id='${data[i]._id}' type='submit' class='read btn btn-outline-secondary'>Mark Read</button>
                <a target='_blank' href='${data[i].link}'>
                  <h2 id='title-${i}'>${data[i].title}</h2></a>
                    <span>${moment(data[i].time).fromNow()}</span>
                  </div>
                <div>
                  <img class='img-fluid' src='${data[i].pic}'>
                </div>
                <div class='card-body'><blockquote class='blockquote mb-0'>
                  <div id='text-${i}' class='text'>${data[i].summary}
                  </footer>
                  </blockquote>
                </div>
              </div>
            </div>`);
            $(".showNote").append(`
            <div class='modal fade' id='showNote${data[i]._id}' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
              <div class='modal-dialog' role='document'>
                <div class='modal-content'>
                  <div class='modal-header'>
                    <h5 class='modal-title' id='exampleModalLabel'>
                      Note for Article <span class='font-italic'>"${data[i].title}"</span>
                    </h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                    <div class='modal-body'><div id='list-note-${data[i]._id}'>
                    </div>
                    </br>
                      <div>
                        <textarea id='text-note${data[i]._id}' placeholder=' Write note here'></textarea>
                      </div>
                </div>
                  <div class='modal-footer'>
                    <button data-note='${data[i]._id}' type='button' class='note btn btn-secondary' data-dismiss='modal'>
                      Save Note
                    </button>
                </div>
              </div>
            </div>`);      
        }
      });
  });

  // save article
  $(document).on('click', '.save', function(event){
    event.preventDefault();
    const thisId = $(this).attr('data-id');
    const buttonId = $(this).attr('id')
    const cardId = $(this).parent().attr('id')
    console.log(thisId)
    console.log(buttonId)
    console.log(cardId)
    
    saveArticle = {
        saved: true,
    }
    console.log(saveArticle);
    
    $.ajax({
      method: "POST",
      url: "/saved/"+ thisId,
    })
      // With that done, add the note information to the page
      .then(function(data) {
        $(`#${buttonId}`).prop('disabled','true');
        $(`#${buttonId}`).text('Saved');
        $(`#${cardId}`).prepend(`<button type='button' data-id='${thisId}' class='note-show btn btn-outline-secondary' data-toggle='modal' data-target='#showNote${thisId}'>Notes</button>`);
        console.log(data);
      });
  });

    // mark article read
    $(document).on('click', '.read', function(event){
      event.preventDefault();
      const thisId = $(this).attr('data-id');
      const cardId = $(this).parent().parent().parent().attr('id')
      console.log(cardId)
      
      saveArticle = {
          saved: false,
      }
      $.ajax({
        method: "POST",
        url: "/read/"+ thisId,
      })
        // With that done, add the note information to the page
        .then(function(data) {
          $(`#${cardId}`).remove();
        });
    });

  // saved Note
  $(document).on("click", '.note', function(event) {
    event.preventDefault();
    var thisId = $(this).attr("data-note");
    var body = $("#text-note"+ thisId).val().trim();
    newNote = {
      body: body
    }
    console.log(newNote);
    $.ajax({
      method: "POST",
      url: "/article/"+thisId,
      data: newNote
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
      });
  });

  // Show note
  $(document).on("click", '.note-show', function(event){
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/article/"+thisId,
    })
      // With that done, add the note information to the page
      .then(function(data) {
        $(`#list-note-${thisId}`).empty();
        for (let i = 0; i < data.length; i++) {
        $(`#list-note-${thisId}`).append("<div class='card notemodal-"+data[i].note._id+"'><div class='card-body'><div>"+data[i].note.body+"<button data-deletenote="+data[i].note._id+" type='button' class='delete-note btn btn-outline-danger'>Delete</button></div></div></div>")
        }
      });
  });

  // Delete note
  $(document).on("click", '.delete-note', function(event) {
    event.preventDefault();
    var thisId = $(this).attr("data-deletenote");
    $.ajax({
      method: "DELETE",
      url: "/deletenote/"+ thisId,
    })
      // With that done, add the note information to the page
      .then(function(data) {
        $('.notemodal-' + thisId).remove(),
        console.log("Note has been deleted");
      });
  });

  
  // Delete Article -- not implemented
  $(document).on("click", '.Delete', function(event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/delete/"+ thisId,
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        $('#card-' + thisId).remove(),
        console.log("Article have been deleted");
      });
  });
    

    