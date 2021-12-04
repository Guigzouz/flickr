const apiKey = 'abb38c51c876161489e6c0a57b4b70a4';
const urlFlickr = 'https://www.flickr.com/services/rest/?'

let nbPerPage = $('input[type=radio]:checked').val();
let indPage = 1;
let searchTerm;
let photos;
let sizeSuffix = 'z'

let wV = window.innerWidth;
let hV = window.innerHeight;
console.log(wV, hV);

// Pour masquer par défaut le conteneur Lightbox
$('#lightbox').hide();

// Pour être averti lorsque l'image ligghtbox est chargée.
// Permet de centrer l'image
$('#img-lightbox').on('load', (e) => {
    console.log("image chargée")
    console.log($('#img-lightbox').width(), $('#img-lightbox').height())
    const x = (wV - $('#img-lightbox').width()) / 2;
    const y = (hV - $('#img-lightbox').height()) / 2;

    $('#img-lightbox').css({left:x, top:y});
})


$('input[type=radio]').on('change', (e) => {
    nbPerPage = $(e.currentTarget).val();
})
$('#search').on('focusin', () => {
    $('#search').val('');
})
$('#search').on('focusout', () => {
    searchTerm = $('#search').val();
    searchPhotos();
})
$('#bt-search').on('mousedown', () => {
    if(!$('#search').is(":focus"))
        searchPhotos()
})
$(window).on('keypress', (e) => {
    if(e.keyCode === 13){
        e.preventDefault();

        $('#search').blur();
        searchTerm = $('#search').val();
        searchPhotos()
    }
})


/**
 * Fonction pour rechercher des photos
 * 3 paramètres pris en compte : nbPerPage, indPage, searchTerm
 */
function searchPhotos(){
    console.log("searchTerm:", searchTerm, nbPerPage)

    let url = urlFlickr + 'method=flickr.photos.search'
    url += '&api_key=' + apiKey;
    url += '&text=' + searchTerm;
    url += '&tags=' + searchTerm;
    url += '&per_page=' + nbPerPage;
    url += '&page=' + indPage;
    url += '&format=json&nojsoncallback=1'
    console.log(url)

    $('#galery').empty();
    $('#galery').html('Recherche en cours.<br/>Patientez quelques istants !')

    $.getJSON(url)
        .done((data) => {
            console.log(data);
            photos = data.photos.photo;
            createThumbs();
        })

    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            photos = data.photos.photo;
            createThumbs();
        })
}

/**
 * 
 */
function createThumbs(){
    $('#galery').empty();

    for(let [i, p] of photos.entries()){

        //`https://live.staticflickr.com/${server}/${id}_${secret}_${sizeSuffix}.jpg`
        let urlPhoto = `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}_z.jpg`
        //let urlPhoto = 'https://live.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_' + sizeSuffix+'.jpg'
        $('<img>')
            .attr('src', urlPhoto)
            .addClass('thumb')
            .data('id', i)
            .appendTo($('#galery'))
            .on('click', (e) => {
                $('#lightbox').show();
                //console.log($(e.currentTarget).data('id'));
                const idx = $(e.currentTarget).data('id');
                //console.log(photos[idx]);
                let urlPhotoLB = `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}_b.jpg`
                $('#img-lightbox').attr('src', urlPhotoLB)
            })
    }
}

