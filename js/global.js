// this updates the current value of cart count on call
var update_cart_count = () => {
  console.log("Hello cart count updata.....");
  let show_cart_count = document.getElementById("show_cart_count");
  show_cart_count.innerHTML = getCookie("cart_count");
};

// used for right bottom notifications on any page
var push_notification = (data, data_msg, final_msg) => {
  let notify_count = document.getElementById("notify_items_count");
  notify_count.innerHTML = final_msg;
  let notify_templet = `
  <div class="toast-header">
    <div id="notify_item_img">
      <img
        src="${data.img_url}"
        class="rounded me-2"
        style="max-width: 50; max-height: 50px"
      />  
    </div>
    <strong class="me-auto">${data_msg}</strong>
    <small>just now</small>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="toast"
      aria-label="Close"
    ></button>
  </div>
  `;
  document.getElementById("notify_item_details").innerHTML += notify_templet;
  $(".toast").toast("show");
  var notify_time = setTimeout(() => {
    clearTimeout(notify_time);
    document.getElementById("notify_item_details").innerHTML = "";
  }, 4500);
  update_cart_count();
};

// used to display modal on any page with given values
var call_modal = (title, body, lbutton = "Close", rbutton = "Ok") => {
  let modal_title = document.getElementById("modal_title");
  let modal_body = document.getElementById("modal_body");
  let l = document.getElementById("modal_lbutton");
  let r = document.getElementById("modal_rbutton");

  modal_title.innerHTML = title;
  modal_body.innerHTML = body;
  l.innerHTML = lbutton;
  r.innerHTML = rbutton;
  document.getElementById("modal_button").click();
};

// used for getting parameter value in url string
var get_query_params = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// this generates the search result card rows
var create_serach_result_row = (data) => {
  let search_templet = `
            <a class="dropdown-item" href="one.html">
              <div class="input-group">
                <span class="input-group-text">
                  <img
                    src="${data.img_url}"
                    style="
                      max-height: 50px;
                      max-width: 50px;
                      border-radius: 5px;
                  "/>
                </span>
                <div class="form-control">
                  <div class="row-lg">${data.name}</div>
                  <div class="row-lg"><span class="rounded-pill bg-success ps-2 pe-2 text-light">${data.tag}</span></div>
                </div>
              </div>
            </a>
  `;
  return search_templet;
};

// in here show the results coming in array to search results
var show_search_product = (found_results) => {
  let search_result = document.getElementById("search_result_mount_point");
  // search_result.addEventListener("", () => {
  //   // window.location.href = "/one.html";
  //   console.log("Href hi..")
  // });

  let all_result_product_html = "";
  found_results.forEach((data, index) => {
    if (index < 5) {
      all_result_product_html += create_serach_result_row(data);
    }
  });

  if (found_results.length > 0) {
    search_result.innerHTML = all_result_product_html;
  } else {
    let serach_templet_for_empty = `
    <li class="ps-2 pe-2">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span class="text-muted"> Type to start searching...</span>
    </li>
    `;
    search_result.innerHTML = serach_templet_for_empty;
  }
};

// var body_tag = document.getElementsByTagName("body");
// console.log(body_tag);
// body_tag[0].addEventListener("load", (e) => {
//   console.log("Body loaded..");
// });

// call this function when header is loaded for the load_components.js file
// add the call in .load section of headers xhr
// this funtion initalizes search bar to work
var init_search = () => {
  let search_bar = document.getElementById("search_product_bar");
  let search_button = document.getElementById("search_product_button");
  let search_result = document.getElementById("search_result_mount_point");

  let all_data_arr = [];
  let data_loaded = [false, false, false];

  // when search bar is focused, fetch the data and start showing serach result
  search_bar.addEventListener("focus", (e) => {
    console.log("Hello search..");
    // if not all data is  loaded, rerun the fetching process
    if (!data_loaded[0] || !data_loaded[1] || !data_loaded[2]) {
      let men_json = new XMLHttpRequest();
      men_json.open("GET", "/data/men.json");
      men_json.onload = () => {
        all_data_arr.push(JSON.parse(men_json.responseText));
        data_loaded[0] = true;
      };
      men_json.send();

      let kids_json = new XMLHttpRequest();
      kids_json.open("GET", "/data/kids.json");
      kids_json.onload = () => {
        all_data_arr.push(JSON.parse(kids_json.responseText));
        data_loaded[1] = true;
      };
      kids_json.send();

      let women_json = new XMLHttpRequest();
      women_json.open("GET", "/data/women.json");
      women_json.onload = () => {
        all_data_arr.push(JSON.parse(women_json.responseText));
        data_loaded[2] = true;

        // console.log(all_data_arr);
      };
      women_json.send();
    }
    search_result.className += " show";
  });

  // on unfocus of the serach bar, close searc results
  search_bar.addEventListener("blur", (e) => {
    search_result.className = search_result.className.substring(
      0,
      search_result.className.length - 5
    );
  });

  // start searching when key is pressed
  search_bar.addEventListener("keyup", (e) => {
    let str = search_bar.value;
    let found_results = [];
    // console.log("Key is pressed..");
    // console.log(e.key);
    // console.log(search_bar.value);
    // str.split(" ").forEach((query) => {
    if (str.length < 3) {
    } else {
      all_data_arr.forEach((data) => {
        // console.log(data)
        data.products.forEach((entry) => {
          // console.log(entry);
          let is_searched = false;
          let is_valid_result = true;
          str.split(" ").forEach((query) => {
            is_searched = true;
            let name = entry.name.toLowerCase().includes(query.toLowerCase());
            let tag = entry.tag.toLowerCase().includes(query.toLowerCase());
            let url = entry.img_url.toLowerCase().includes(query.toLowerCase());
            let etag = entry["e-tag"]
              .toLowerCase()
              .includes(query.toLowerCase());
            if ((name || tag || url || etag) && is_valid_result) {
              is_valid_result = true;
            } else {
              is_valid_result = false;
            }
          });
          if (is_valid_result && is_searched) {
            found_results.push(entry);
          }
        });
      });
    }
    // });
    show_search_product(found_results);
  });

  search_button.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Search button pressed..");
  });
};

// init_search();
