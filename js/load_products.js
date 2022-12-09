// this script is used to load the products in on the products
// pages in different sections...

// ====================== gloabal objects =========================

var men_json_data = {
  val: "",
  get: () => men_json_data.val,
  set: (obj) => {
    men_json_data.val = obj;
  },
};

// cookies function to handle cart
var setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
var getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// handling the add to cart click
var handle_add_to_cart = (data) => {
  let cart = getCookie("cart");
  let cart_no = 0;
  let cart_count = getCookie("cart_count");
  if (cart) {
    let cart_arr;
    try {
      cart_arr = JSON.parse(cart);
    } catch (err) {
      cart_arr = [];
    }
    is_item_present = cart_arr.filter((item) => {
      return item.name == data.name;
    });
    console.log(is_item_present);
    if (is_item_present.length) {
      push_notification(
        data,
        `${data.name} already present in cart!`,
        `Total ${getCookie("cart_count")} items are in the cart.`
      );
      return;
    }
    cart_arr.push(data);
    cart_no = cart_arr.length;
    setCookie("cart", JSON.stringify(cart_arr));
  } else {
    setCookie("cart", JSON.stringify([data]));
    cart_no = 1;
  }
  setCookie("cart_count", cart_no.toString());
  console.log("data set in cookes..");
  push_notification(
    data,
    `${data.name} item added in cart.`,
    `Total ${getCookie("cart_count")} are present in the cart.`
  );
};

// generater random number in given range
var getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// takes entry objec and index number and return card html
var create_card = (entry, index) => {
  let max_price = 0;
  let sell_price = entry.price
    ? parseInt(entry.price)
    : getRndInteger(1000, 2000);

  if (entry.price) {
    max_price =
      Math.trunc(Math.random() * parseInt(entry.price)) + parseInt(entry.price);
  } else {
    max_price = getRndInteger(2000, 3000);
  }
  return `
  <div class="carousel-item ${index == 0 ? "active" : ""}"
  style="border-top-left-radius: 6px; border-top-right-radius: 6px;"
  >
    <div class="card">
      <div class="img-wrapper" style="object-fit:cover;width:100%">
        <img src="${entry.img_url}" class="d-block w-100" alt="${entry.name}" 
style="border-top-left-radius: 6px; border-top-right-radius: 6px;"
/>
      </div>
      <div class="card-body">
        <center>
          <h5 class="card-title" style="font-weight:700">${entry.name}
          ${
            Math.random() > 0.3
              ? '<sup><i class="ps-1 text-success fa-solid fa-circle-check"></i><span style="font-size:0.6rem;">varified</span></sup>'
              : ""
          }
          </h5>
          <h4>₹${sell_price.toString()} <sup style="text-decoration:line-through; color:red">₹${max_price.toString()}</sup></h4>
          <h6 style="color:rgba(0,0,0,0.4)">Item in stock: <span style="color:green">${Math.trunc(
            Math.random() * 100
          )}</span></h6>
          <p class="card-text">
            Some quick example text to build on the card title and
            make up the bulk of the card's content.
          </p>
          <button class="btn btn-warning" onclick='handle_add_to_cart(${JSON.stringify(
            {
              ...entry,
              price: sell_price,
              no: 1,
              max_price: max_price,
            }
          )})'>Add to cart <i
          class="fa-solid fa-cart-shopping text-light"
          style="
            font-size: 1.5rem;
            margin-left: 0.1rem;
            vertical-align: middle;
          "
        ></i></button>
        </center>
      </div>
    </div>
  </div>
`;
};

// pass the id of the carousle container
var activate_carousle = (mount_point_id) => {
  console.log("Mounting..to", mount_point_id);

  // after mounting all the html attach carousel
  // written in jquery
  let multiple_cards_carousel = document.querySelector("#" + mount_point_id);
  // console.log(multiple_cards_carousel)

  if (window.matchMedia("(min-width: 768px)").matches) {
    // let carousel = new bootstrap.Carousel(multiple_cards_carousel, {
    //   interval: false,
    // });

    let carousel_width = $(".carousel-inner")[0].scrollWidth;
    let card_width = $(".carousel-item").width();
    // console.log(card_width)
    let scroll_position = 0;
    $("#" + mount_point_id + " .carousel-control-next").on(
      "click",
      function () {
        if (scroll_position < carousel_width - card_width * 4) {
          scroll_position += card_width;
          $("#" + mount_point_id + " .carousel-inner").animate(
            { scrollLeft: scroll_position },
            600
          );
        }
      }
    );
    $("#" + mount_point_id + " .carousel-control-prev").on(
      "click",
      function () {
        if (scroll_position > 0) {
          scroll_position -= card_width;
          $("#" + mount_point_id + " .carousel-inner").animate(
            { scrollLeft: scroll_position },
            600
          );
        }
      }
    );
  } else {
    $(multiple_cards_carousel).addClass("slide");
  }
};

// this will load the mount point with carousle html
var load_carousel_templet = (mounting_point_id, data_arr) => {
  // mounting_point_id, data
  // this master templet will have many carousel sections
  let master_templet = "";

  data_arr.forEach((data, index) => {
    let templet = `<center><h3 class="bg-warning" style="border-radius:6px">${data.title}</h3></center>
  <div
    id="${data.crousle_mount_point}"
    class="carousel"
    data-bs-ride="carousel"
  >
    <div class="carousel-inner" id="${data.cards_mount_point}"></div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#${data.crousle_mount_point}"
      data-bs-slide="prev"
    >
      <span
        class="carousel-control-prev-icon"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#${data.crousle_mount_point}"
      data-bs-slide="next"
    >
      <span
        class="carousel-control-next-icon"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
  <br>
  <br>
  `;

    // loading the templet in master templet
    master_templet += templet;
  });

  let mount_point = document.getElementById(mounting_point_id);
  // lading the master templet in the dom
  mount_point.innerHTML += master_templet;
};

// ================== women json data injection ====================
let women_json = new XMLHttpRequest();
women_json.open("GET", "/data/women.json");

women_json.onload = () => {
  load_carousel_templet("nav-women", [
    {
      title: "Women's all products",
      cards_mount_point: "mount-women-product",
      crousle_mount_point: "carousel_women_mount_point",
    },
  ]);
  load_carousel_templet("nav-dress", [
    {
      title: "Women's All season Dresses",
      cards_mount_point: "mount-women-dress",
      crousle_mount_point: "carousel_women_dress_mount_point",
    },
  ]);
  load_carousel_templet("nav-pants", [
    {
      title: "Women's Fashion Pants",
      cards_mount_point: "mount-women-pant",
      crousle_mount_point: "carousel_women_pant_mount_point",
    },
  ]);
  load_carousel_templet("nav-skirts", [
    {
      title: "Women's Latest Skirts",
      cards_mount_point: "mount-women-skirt",
      crousle_mount_point: "carousel_women_skirt_mount_point",
    },
  ]);

  // also adding to general section
  load_carousel_templet("nav-product", [
    {
      title: "Women Section",
      cards_mount_point: "mount-women-product-gen",
      crousle_mount_point: "carousel_women_mount_point_gen",
    },
  ]);

  // console.log(women_json.responseText);
  let women_data = JSON.parse(women_json.responseText);
  // console.log(women_data);
  let women_data_html = "";
  let women_dress = "";
  let women_pants = "";
  let women_skirt = "";

  women_data.products.forEach((entry, index) => {
    // console.log("Injecting..", index);
    Math.random() < 0.3
      ? (women_data_html += create_card(entry, index))
      : (women_data_html = create_card(entry, index) + women_data_html);
    if (entry.tag.includes("dress")) {
      Math.random() < 0.3
        ? (women_dress += create_card(entry, index))
        : (women_dress = create_card(entry, index) + women_dress);
    } else if (entry.tag.includes("pants")) {
      Math.random() < 0.3
        ? (women_pants += create_card(entry, index))
        : (women_pants = create_card(entry, index) + women_pants);
    } else if (entry.tag.includes("skirt")) {
      Math.random() < 0.3
        ? (women_skirt += create_card(entry, index))
        : (women_skirt = create_card(entry, index) + women_skirt);
    }
  });
  // console.log(women_data_html);
  // finally inject the above prepared html at the mound point
  let mount_women_product = document.getElementById("mount-women-product");
  let mount_women_product_gen = document.getElementById(
    "mount-women-product-gen"
  );
  let mount_women_dress = document.getElementById("mount-women-dress");
  let mount_women_pant = document.getElementById("mount-women-pant");
  let mount_women_skirt = document.getElementById("mount-women-skirt");

  mount_women_product.innerHTML = women_data_html;
  mount_women_product_gen.innerHTML = women_data_html;
  mount_women_dress.innerHTML = women_dress;
  mount_women_pant.innerHTML = women_pants;
  mount_women_skirt.innerHTML = women_skirt;
  console.log("Women dress mounting..");

  setTimeout(() => {
    activate_carousle("carousel_women_mount_point");
    activate_carousle("carousel_women_mount_point_gen");
    activate_carousle("carousel_women_dress_mount_point");
    activate_carousle("carousel_women_pant_mount_point");
    activate_carousle("carousel_women_skirt_mount_point");
  }, 400);

  // activate_women_carousle();
};

women_json.send();

// ========================= Kids products mount ==========================
let kids_json = new XMLHttpRequest();
kids_json.open("GET", "/data/kids.json");

kids_json.onload = () => {
  load_carousel_templet("nav-kids", [
    {
      title: "Kids all products",
      cards_mount_point: "mount-kids-dress",
      crousle_mount_point: "carousel_kids_mount_point",
    },
  ]);
  // adding also to general section
  load_carousel_templet("nav-product", [
    {
      title: "Kids Section",
      cards_mount_point: "mount-kids-dress-gen",
      crousle_mount_point: "carousel_kids_mount_point_gen",
    },
  ]);

  // console.log(kids_json.responseText);
  let kids_data = JSON.parse(kids_json.responseText);
  // console.log(kids_data);
  let kids_data_html = "";

  kids_data.products.forEach((entry, index) => {
    Math.random() < 0.4
      ? (kids_data_html += create_card(entry, index))
      : (kids_data_html = kids_data_html + create_card(entry, index));
  });
  // console.log(kids_data_html);
  let mount_kids_product = document.getElementById("mount-kids-dress");
  let mount_kids_product_gen = document.getElementById("mount-kids-dress-gen");

  // finally inject the above prepared html at the mound point
  mount_kids_product.innerHTML = kids_data_html;
  mount_kids_product_gen.innerHTML = kids_data_html;
  console.log("Kids dress mounting..");

  setTimeout(() => {
    activate_carousle("carousel_kids_mount_point");
    activate_carousle("carousel_kids_mount_point_gen");
  }, 400);
};

kids_json.send();

// ======================== Men product data =============================

let men_json = new XMLHttpRequest();
men_json.open("GET", "/data/men.json");

men_json.onload = () => {
  load_carousel_templet("nav-men", [
    {
      title: "Men's all products",
      cards_mount_point: "mount-men-dress",
      crousle_mount_point: "carousel_men_mount_point",
    },
  ]);
  load_carousel_templet("nav-men-pants", [
    {
      title: "Men Stylish Panst",
      cards_mount_point: "mount-men-pants",
      crousle_mount_point: "carousel_men_pants_mount_point",
    },
  ]);
  load_carousel_templet("nav-hoodies", [
    {
      title: "Men's Casual Hoodies",
      cards_mount_point: "mount-men-hoodies",
      crousle_mount_point: "carousel_men_hoodies_mount_point",
    },
  ]);
  load_carousel_templet("nav-shirts", [
    {
      title: "Men's Formal Shirts",
      cards_mount_point: "mount-men-shirts",
      crousle_mount_point: "carousel_men_shirts_mount_point",
    },
  ]);
  // load mens all product in general product section
  load_carousel_templet("nav-product", [
    {
      title: "Men's all products",
      cards_mount_point: "mount-men-dress-gen",
      crousle_mount_point: "carousel_men_mount_point_gen",
    },
  ]);

  // console.log(men_json.responseText);
  let data = JSON.parse(men_json.responseText);
  men_json_data.set(data); // settind data in gloabal var, for gloabal access
  // console.log(data);
  let data_html = "";
  let data_pant_html = "";
  let data_hoodies_html = "";
  let data_shirts_html = "";

  // creating html card out of fetched data
  data.products.forEach((entry, index) => {
    Math.random() < 0.4
      ? (data_html += create_card(entry, index))
      : (data_html = data_html + create_card(entry, index));
    if (entry.tag.includes("pant")) {
      Math.random() < 0.4
        ? (data_pant_html += create_card(entry, index))
        : (data_pant_html = data_pant_html + create_card(entry, index));
    } else if (entry.tag.includes("hoodie")) {
      Math.random() < 0.4
        ? (data_hoodies_html += create_card(entry, index))
        : (data_hoodies_html = data_hoodies_html + create_card(entry, index));
    } else if (entry.tag.includes("shirt")) {
      Math.random() < 0.4
        ? (data_shirts_html += create_card(entry, index))
        : (data_shirts_html = data_shirts_html + create_card(entry, index));
    }
  });

  let mount_men_product = document.getElementById("mount-men-dress");
  let mount_pant_product = document.getElementById("mount-men-pants");
  let mount_hoodies_product = document.getElementById("mount-men-hoodies");
  let mount_shirts_product = document.getElementById("mount-men-shirts");

  // general section
  let mount_men_product_gen = document.getElementById("mount-men-dress-gen");

  // finally inject the above prepared html at the mound point
  mount_men_product.innerHTML = data_html;
  mount_men_product_gen.innerHTML = data_html; // general section
  mount_pant_product.innerHTML = data_pant_html;
  mount_hoodies_product.innerHTML = data_hoodies_html;
  mount_shirts_product.innerHTML = data_shirts_html;
  console.log("Mens dress mounting..");

  // activating the carousle buttons
  setTimeout(() => {
    activate_carousle("carousel_men_mount_point");
    activate_carousle("carousel_men_mount_point_gen"); //general section
    activate_carousle("carousel_men_pants_mount_point");
    activate_carousle("carousel_men_hoodies_mount_point");
    activate_carousle("carousel_men_shirts_mount_point");
  }, 400);
};

men_json.send();
