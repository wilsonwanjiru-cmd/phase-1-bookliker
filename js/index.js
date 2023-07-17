document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch the list of books and display them
    function fetchBooks() {
      fetch("http://localhost:3000/books")
        .then((response) => response.json())
        .then((books) => {
          const listElement = document.getElementById("list");
          listElement.innerHTML = ""; // Clear the list before adding books
  
          // Create an li element for each book and add it to the list
          books.forEach((book) => {
            const li = document.createElement("li");
            li.textContent = book.title;
            li.addEventListener("click", () => showBookDetails(book));
            listElement.appendChild(li);
          });
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
        });
    }
  
    // Function to display book details when a book is clicked
    function showBookDetails(book) {
      const showPanel = document.getElementById("show-panel");
      showPanel.innerHTML = ""; // Clear the show panel before adding book details
  
      // Create elements for book details
      const thumbnail = document.createElement("img");
      thumbnail.src = book.img_url;
      const description = document.createElement("p");
      description.textContent = book.description;
  
      // Create an unordered list for displaying the users who liked the book
      const likedByList = document.createElement("ul");
      book.users.forEach((user) => {
        const userItem = document.createElement("li");
        userItem.textContent = user.username;
        likedByList.appendChild(userItem);
      });
  
      // Create a like button
      const likeButton = document.createElement("button");
      likeButton.textContent = "LIKE";
      likeButton.addEventListener("click", () => likeBook(book));
  
      // Add book details to the show panel
      showPanel.appendChild(thumbnail);
      showPanel.appendChild(description);
      showPanel.appendChild(likedByList);
      showPanel.appendChild(likeButton);
    }
  
    // Function to like a book
    function likeBook(book) {
      const currentUser = { id: 1, username: "pouros" };
      const likedByList = document.querySelector("#show-panel ul");
      const likedByUsernames = Array.from(likedByList.children).map(
        (li) => li.textContent
      );
  
      // Check if the current user has already liked the book
      if (likedByUsernames.includes(currentUser.username)) {
        // User has already liked the book, so remove them from the list
        const updatedUsers = book.users.filter(
          (user) => user.username !== currentUser.username
        );
        patchLikedUsers(book.id, updatedUsers)
          .then(() => {
            // Remove the user from the DOM
            const userItem = Array.from(likedByList.getElementsByTagName("li")).find(
              (li) => li.textContent === currentUser.username
            );
            if (userItem) {
              userItem.remove();
            }
          })
          .catch((error) => {
            console.error("Error updating liked users:", error);
          });
      } else {
        // User has not liked the book, so add them to the list
        const updatedUsers = [...book.users, currentUser];
        patchLikedUsers(book.id, updatedUsers)
          .then(() => {
            // Add the user to the DOM
            const userItem = document.createElement("li");
            userItem.textContent = currentUser.username;
            likedByList.appendChild(userItem);
          })
          .catch((error) => {
            console.error("Error updating liked users:", error);
          });
      }
    }
  
    // Function to send a PATCH request to update liked users
    function patchLikedUsers(bookId, updatedUsers) {
      return fetch(`http://localhost:3000/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: updatedUsers }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update liked users");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error updating liked users:", error);
        });
    }
  
    // Fetch the list of books when the page loads
    fetchBooks();
  });
  