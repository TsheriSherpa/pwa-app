// registering service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("service-worker.js")
		.then((reg) => {
			console.log("Service Worker registered!", reg);
		})
		.catch((err) => {
			console.log("Service Worker registration failed: ", err);
		});
}

const firebaseConfig = {
	apiKey: "AIzaSyBzid9lSK0jQkX5T_OWrpdbcPoJ1jRf_18",
	authDomain: "mobile-web-215c0.firebaseapp.com",
	projectId: "mobile-web-215c0",
	storageBucket: "mobile-web-215c0.appspot.com",
	messagingSenderId: "680953453597",
	appId: "1:680953453597:web:2cbf8babb01546f2983af4",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

const collectionRef = db.collection("lab3");

// running code after the dom content are loaded
document.addEventListener("DOMContentLoaded", function () {
	// read all items from firebase and append them to html dom
	readAllItemsFromFirebase();

	var form = document.getElementById("form");

	// on form submit add item to list
	form.addEventListener("submit", function (e) {
		e.preventDefault();
		var titleInput = document.getElementById("titleInput");
		var artistInput = document.getElementById("artistInput");
		var title = titleInput.value.trim();
		var artist = artistInput.value.trim();
		addSongInfoToFirebase(title, artist);
	});
});

const removeItem = (e) => {
	let key = e.getAttribute('data-id');
	deleteDataFromFirebase(key);
};

const addDataToDom = (id, song, artist, likesCount) => {
	var itemList = document.getElementById("songs-list");

	var listItem = document.createElement("li");
	listItem.setAttribute("id", id);

	var listItemHeader = document.createElement("div");
	listItemHeader.classList.add("list-item-header");

	var listItemTitleSection = document.createElement("div");
	listItemTitleSection.classList.add("list-item-title-section");

	var songTitle = document.createElement("span");
	songTitle.classList.add("list-song-title");

	var artistTitle = document.createElement("span");
	artistTitle.classList.add("list-artist-title");

	var listItemLikeSection = document.createElement("div");
	listItemLikeSection.classList.add("list-item-like-section");

	var listItemLikeTitle = document.createElement("span");
	listItemLikeTitle.classList.add("list-item-like-section");

	var listItemNoOfLikes = document.createElement("span");
	listItemNoOfLikes.classList.add("list-item-no-of-likes");
	listItemNoOfLikes.setAttribute("id", id + "-like");

	var listItemButtonSection = document.createElement("div");
	listItemButtonSection.classList.add("list-item-button-section");

	var btnRemove = document.createElement("button");
	btnRemove.setAttribute("data-id", id);
	btnRemove.setAttribute("id", "btnRemove");
	btnRemove.setAttribute("onclick", "removeItem(this)");
	btnRemove.classList.add("btn-danger");
	btnRemove.textContent = "Remove";
	listItemButtonSection.appendChild(btnRemove);

	var btnLike = document.createElement("button");
	btnLike.setAttribute("data-id", id);
	btnLike.setAttribute("id", "btnLike");
	btnLike.setAttribute("onclick", "addLike(this)");
	btnLike.classList.add("btn-like");
	btnLike.textContent = "+1 Like";
	listItemButtonSection.appendChild(btnLike);

	songTitle.textContent = song;
	artistTitle.textContent = artist;

	listItemLikeTitle.textContent = "Likes: ";
	listItemNoOfLikes.textContent = likesCount;

	listItemLikeSection.appendChild(listItemLikeTitle);
	listItemLikeSection.appendChild(listItemNoOfLikes);

	listItemTitleSection.appendChild(songTitle);
	listItemTitleSection.appendChild(artistTitle);

	listItemHeader.appendChild(listItemTitleSection);
	listItemHeader.appendChild(listItemLikeSection);

	listItem.appendChild(listItemHeader);
	listItem.appendChild(listItemButtonSection);

	itemList.appendChild(listItem);
};

// firebase functions
const addSongInfoToFirebase = (song, artist) => {
	var id = Math.floor(10000 + Math.random() * 90000) + "-" + (new Date()).getTime()
	var item = {
		id: id,
		song: song,
		artist: artist,
		likesCount: 0,
	};

	collectionRef.doc("FjPzpHaFckDEJJ97fcbw").get().then((doc) => {
		if (doc.exists) {
		  	var data = doc.data();
			// Adding the new item to the array copy
		  	var newArray = data.items ? [...data.items, item] : [item]; 
		  
			collectionRef.doc("FjPzpHaFckDEJJ97fcbw").update({ items: newArray }).then(() => {
				console.log("Item created successfully!");
				addDataToDom(item.id, song, artist, 0);
			}).catch((error) => {
				console.error("Failed to create : ", error);
			});
		} else {
		  console.log("Document does not exist");
		}
	}).catch((error) => {
		console.error("Error getting document:", error);
	});

};

const addLike = (e) => {
	let key = e.getAttribute('data-id');
	updateDataToFirebase(key);
};

const listAllItemsToDom = (items) => {
	var itemList = document.getElementById("songs-list");
	itemList.innerHTML = "";

	if(items) {
		items.forEach((item) => {
			console.log(item)
			addDataToDom(
				item.id,
				item.song,
				item.artist,
				item.likesCount,
				itemList
			);
		});
	}
};

// fetching all data from collection from firestore
const readAllItemsFromFirebase = () => {
	collectionRef.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			var items = doc.data().items;
			listAllItemsToDom(items);
		});
	}).catch((error) => {
		console.error("Error getting documents: ", error);
	});
	
};

// deleting data from firestore
function deleteDataFromFirebase(id) {
	collectionRef.doc("FjPzpHaFckDEJJ97fcbw").get().then((doc) => {
		if (doc.exists) {
		  	var data = doc.data();
		  	var newArray = data.items.filter(function (item) {
				return item.id != id
			});
			
			collectionRef.doc("FjPzpHaFckDEJJ97fcbw").update({ items: newArray }).then(() => {
				// finding the list item to remove using its id attribute
				var element = document.getElementById(id);
				if (element) {
					element.parentNode.removeChild(element);
				}
				console.log("Item deleted successfully!");
				
			}).catch((error) => {
				console.error("Error deleting item: ", error);
			});
		} else {
		  console.log("Document does not exist");
		}
	}).catch((error) => {
		console.error("Error getting document:", error);
	});
}

function updateDataToFirebase(id) {
	collectionRef.doc("FjPzpHaFckDEJJ97fcbw").get().then((doc) => {
		if (doc.exists) {
		  	var data = doc.data();
			
			console.log(id)
			var updatedLikeCount = 0;
			var newArray = data.items.map(function(item) {
				if(item.id == id) {
					updatedLikeCount = item.likesCount + 1;
					return {...item, likesCount: item.likesCount + 1}
				}
				return item;
			});
	
			collectionRef.doc("FjPzpHaFckDEJJ97fcbw").update({ items: newArray }).then(() => {
				document.getElementById(id + "-like").innerHTML = updatedLikeCount;
				console.log("item updated successfully!");
			}).catch((error) => {
				console.error("Error updating item: ", error);
			});
		} else {
		  console.log("Document does not exist");
		}
	}).catch((error) => {
		console.error("Error getting document:", error);
	});
}
