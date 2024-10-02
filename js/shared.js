let ingredients_list = [];

function save_to_session_storage(place, data) {
    sessionStorage.setItem(place, JSON.stringify(data));
}