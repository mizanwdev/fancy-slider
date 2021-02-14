/*------------------------------------
---- Requirement -----
১. সার্চ বক্সে কিছু লিখে সার্চ দিলে। সার্চ রেজাল্ট 
ওয়েবসাইট এ দেখায় না। কেন দেখায় না। সেটা ফিক্স করতে হবে। 
-- Done

২. স্লাইডার দেখানোর জন্য ইমেজ সিলেক্ট করলে, স্লাইডার দেখায় না। সেটা একটু ফিক্স করতে হবে। 
-- Done

৩. স্লাইডার এর স্পিড যদি নেগেটিভ নাম্বার দেয়া হয়ে তাহলে সে মাথা খারাপ করে ফেলে। একটার কিছু একটা সমাধান করতে হবে /
-- Done

৪. কোন কিছু সার্চ দেয়ার সময় Enter বাটনে চাপ দিলে যেন রেজাল্ট দেখায়। সেই রিলেটেড একটা ফিচার যোগ করতে হবে /
-- Done

৫. কোন ইমেজ এ একবার ক্লিক করলে সেটা স্লাইডার এ যোগ করা হবে। সেই ইমেজ এ আরেকবার ক্লিক করা হলে সেটাকে স্লাইডার থেকে রিমুভ করা হবে।
-- Done

------- Extra 2 Features Added ---------
1. Displaying loading spinner while searching for the image.

2. Displaying Error Message if searched image is not found.

--------------------------------------*/

/*------------- CODE START -----------------*/

const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// API key from Pixabay Website
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

/*------------------------------------
---------- Showing Images ------------
--------------------------------------*/
// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  if (images.length != 0) {
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
    displayErrorMessage(true);
  } else {
    displayErrorMessage();
  }
  displayLoadingSpinner();
};

/*------------------------------------
----- Getting Images from Api --------
--------------------------------------*/
const getImages = (query) => {
  displayLoadingSpinner();
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    // spelling mistake fixed ( for getting images for api)
    // console.log(data.hits)
    .then((data) => showImages(data.hits))
    .catch((err) => displayErrorMessage(err));
};

/*-----------------------------------------
-- Slider Item Selecting and Unselecting --
-------------------------------------------*/

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  // checking if the img is selected,if so then remove it from sliders
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
  // toggling the image class to unselect it
  element.classList.toggle("added");
};

/*------------------------------------
--------- Creating Slider ------------
--------------------------------------*/

// changed to let (ES6 Modern JavaScript)
let timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";

  // fixed spelling mistake of duration in the html id attribute
  const duration = document.getElementById("duration").value || 1000;
  // console.log(duration);

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

/*------------------------------------
------- Changing slider item ---------
--------------------------------------*/
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

/*------------------------------------
------- Changing slider image ------
--------------------------------------*/
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

/*------------------------------------
------- Display Loading Spinner ------
--------------------------------------*/
const displayLoadingSpinner = () => {
  const displaySpinner = document.getElementById("display-spinner");
  displaySpinner.classList.toggle("d-none");
};

/*------------------------------------
------- Display Error Message --------
--------------------------------------*/
const displayErrorMessage = (showMessage) => {
  const displayError = document.getElementById("display-error");
  if (showMessage) {
    displayError.classList.add("d-none");
  } else {
    displayError.classList.remove("d-none");
  }
};

/*------------------------------------
----- Search Button Event Listener ---
--------------------------------------*/
searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
});

/*------------------------------------
----- Slider Button Event Listener ---
--------------------------------------*/
sliderBtn.addEventListener("click", function () {
  createSlider();
});

/*------------------------------------------
--- Pressing Enter Button Event Listener ---
--------------------------------------------*/
document
  .getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      document.getElementById("search-btn").click();
    }
  });
