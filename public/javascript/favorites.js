var addToFavoritesButtons = document.querySelectorAll(".addtofavoritesbutton");

addToFavoritesButtons.forEach(btn => btn.addEventListener("click", (event) => {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "favorite");
    input.setAttribute("value", event.target.value);

    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/news/favorites');
    form.style.display = 'hidden';

    form.appendChild(input);
    document.body.appendChild(form)

    form.submit();


}));

function callMe(article) {
    // console.log(article);
}