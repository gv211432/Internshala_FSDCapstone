// this js file targets two mount points to
// mount the header and footer components there
// that is "app-header" and "app-footer"
let header = document.getElementById("app-header");
let footer = document.getElementById("app-footer");

console.log("Load components..");

// initialize the hover function on women men dropdown
let init_header_dropdown = () => {
  console.log("Init header dropdown");
  let dropdown_women = document.getElementById("dropdownMenuWomen");
  let dropdown_men = document.getElementById("dropdownMenuMen");
  // console.log(dropdown_men);
  dropdown_men.addEventListener("mouseover", (e) => {
    if (screen.width > 700) {
      dropdown_men.click();
    }
  });
  document
    .getElementById("dropdown_men_content")
    .addEventListener("mouseleave", (e) => {
      if (screen.width > 700) {
        dropdown_men.click();
      }
    });

  dropdown_women.addEventListener("mouseover", (e) => {
    if (screen.width > 700) {
      dropdown_women.click();
    }
  });
  document
    .getElementById("women_dropdown_conten")
    .addEventListener("mouseleave", (e) => {
      if (screen.width > 700) {
        dropdown_women.click();
      }
    });
};

// fetch header component and inset it at the
// "app-header" mount point
let ajax_header = new XMLHttpRequest();
ajax_header.open("GET", "/components/header.html");
ajax_header.onload = () => {
  header.innerHTML = ajax_header.responseText;
  console.log("Injected header");
  let show_cart_count = document.getElementById("show_cart_count");
  show_cart_count.innerHTML = getCookie("cart_count");
  init_header_dropdown();
  init_search();
};
ajax_header.send();

// fetch footer component and insert the footer component at
// the "app-footer" mount point
let ajax_footer = new XMLHttpRequest();
ajax_footer.open("GET", "/components/footer.html");
ajax_footer.onload = () => {
  footer.innerHTML = ajax_footer.responseText;
};
ajax_footer.send();
