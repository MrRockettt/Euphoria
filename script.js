// Home Page Carousel
var swiper = new Swiper(".swiper-container", {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const compNewSectionContent = document.getElementById(
    "comp-new-section-content"
  );
  const inTheLimelightSectionContent = document.getElementById(
    "in-the-limelight-section-content"
  );
  const feedbackSectionContent = document.getElementById(
    "feedback-section-content"
  ); // New
  const wishListCounter = document.getElementById("wishlist-counter");

  let wishListCount = 0;

  // Load JSON data
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched successfully:", data);
      displayData(data);
      const feedbackCategory = data.find(
        (category) => category.category === "Feedback"
      ); // New
      if (feedbackCategory) {
        // New
        displayFeedback(feedbackCategory.items); // New
      }
      searchButton.addEventListener("click", () => handleSearch(data));
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleSearch(data);
        }
      });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  function displayData(data) {
    console.log("Displaying data:", data);
    compNewSectionContent.innerHTML = "";
    inTheLimelightSectionContent.innerHTML = "";

    data.forEach((category) => {
      if (category.category === "In the Limelight") {
        displayInTheLimelight(category.items);
      } else if (category.category !== "Feedback") {
        // Exclude Feedback from general display
        displayCategory(category);
      }
    });
  }

  function displayCategory(category) {
    console.log("Displaying category:", category);
    const categorySpan = document.createElement("span");
    categorySpan.innerHTML = `<div class="left-top"><img src="images/Rectangle 21.png" alt="line" class="line2">Categories For ${category.category}</div>`;
    compNewSectionContent.appendChild(categorySpan);

    const compRow = document.createElement("div");
    compRow.className = "comp-row";

    category.items.forEach((item) => {
      const compColumn = document.createElement("div");
      compColumn.className = "comp-column";
      compColumn.innerHTML = `
        <img class="product-img" src="${item.img}" alt="${item.title}">
        <h3>${item.title}</h3>
        <a href="${item.link}"><p>Explore Now !</p></a>
        <i class="fas fa-arrow-right arrow-icon"></i>
      `;
      compRow.appendChild(compColumn);
    });

    compNewSectionContent.appendChild(compRow);
  }

  function displayInTheLimelight(items) {
    console.log("Displaying In the Limelight items:", items);
    const limelightTitle = document.createElement("div");
    limelightTitle.className = "limelight-title";
    limelightTitle.innerHTML = `<div class="left-top"><img src="images/Rectangle 21.png" alt="line" class="line2">In the Limelight</div>`;
    inTheLimelightSectionContent.appendChild(limelightTitle);

    const limelightRow = document.createElement("div");
    limelightRow.className = "limelight-row";

    items.forEach((item) => {
      const limelightColumn = document.createElement("div");
      limelightColumn.className = "limelight-column";
      limelightColumn.innerHTML = `
        <div class="image-container">
          <img class="product-img" src="${item.img}" alt="${item.title}">
          <button class="like-button" data-liked="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
            </svg>
          </button>
        </div>
        <h3>${item.title}</h3>
        <div class="para">
          <p>${item.brand}</p>
          <p>${item.price}</p>
        </div>
      `;
      limelightRow.appendChild(limelightColumn);

      const likeButton = limelightColumn.querySelector(".like-button");
      likeButton.addEventListener("click", () =>
        handleLikeButtonClick(likeButton)
      );
    });

    inTheLimelightSectionContent.appendChild(limelightRow);
  }

  function displayFeedback(items) {
    console.log("Displaying feedback items:", items);
    const feedbackTitle = document.createElement("div");
    feedbackTitle.className = "feedback-title";
    feedbackTitle.innerHTML = `<div class="left-top"><img src="images/Rectangle 21.png" alt="line" class="line2">Feedback</div>`;
    feedbackSectionContent.appendChild(feedbackTitle);

    const feedbackRow = document.createElement("div");
    feedbackRow.className = "feedback-row";

    items.forEach((item) => {
      const feedbackCard = document.createElement("div");
      feedbackCard.className = "feedback-card";
      feedbackCard.innerHTML = `
      <div class="feedback-con">
      <div class="feedback-left">
        <img class="feedback-img" src="${item.img}" alt="${item.title}">
        <h3>${item.title}</h3>
        </div>
        <img class="feedback-ratings" src="${item.ratings}" alt="ratings">
        </div>
        <p>${item.content}</p>
      `;
      feedbackSectionContent.appendChild(feedbackCard);
    });
  }

  function handleLikeButtonClick(button) {
    const liked = button.getAttribute("data-liked") === "true";
    if (liked) {
      button.setAttribute("data-liked", "false");
      wishListCount--;
    } else {
      button.setAttribute("data-liked", "true");
      wishListCount++;
    }
    button.classList.toggle("liked", !liked);
    wishListCounter.textContent = wishListCount;
  }

  function handleSearch(data) {
    console.log("Handling search for:", searchInput.value);
    document
      .getElementById("comp-new-section")
      .scrollIntoView({ behavior: "smooth" });

    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = data.map((category) => {
      return {
        category: category.category,
        items: category.items.filter((item) =>
          item.title.toLowerCase().includes(searchTerm)
        ),
      };
    });

    const filteredCategories = filteredData.filter(
      (category) => category.items.length > 0
    );

    if (filteredCategories.length > 0) {
      displayData(filteredCategories);
      const feedbackCategory = filteredCategories.find(
        (category) => category.category === "Feedback"
      ); // New
      if (feedbackCategory) {
        // New
        displayFeedback(feedbackCategory.items); // New
      }
    } else {
      alert("No Stock Found");
    }
  }
});
