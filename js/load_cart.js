// console.log(getCookie("cart"));

let cart_data = JSON.parse(getCookie("cart"));
var summary_total = {
  val: 0,
  get: () => summary_total.val,
  set: (n) => {
    summary_total.val = n;
  },
};
console.log(cart_data);

var makeid = (length) => {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let characters_length = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters_length));
  }
  return result;
};

// this returns dynamic html rows to feed in "Summary" section
var create_summary_row = (key, value, color) => {
  let summary_templet = `
    <div class="row">
      <div class="col mb-2 text-muted"  style="text-align: left">
        ${key}
      </div>
      <div class="col mb-2 ${
        color ? "text-" + color : "text-muted"
      }" style="text-align: right">
        ${value}
      </div>
    </div>
  `;
  return summary_templet;
};

// this calculated the summary of present items in cart
// and displays it in "Summary" section on cart page
var preapare_summary = () => {
  let summary_data = "";
  let cart = getCookie("cart");
  let cart_arr = JSON.parse(cart);
  let total = 0;
  cart_arr.forEach((data) => {
    total += data.price * data.no;
  });
  summary_data += create_summary_row("Cost", "₹" + total.toString());
  if (total > 0) {
    summary_data += create_summary_row("Delivery", "+₹100", "danger");
    summary_data += create_summary_row("Promocode", "-₹50", "success");
    summary_data += "<hr>";
    total += 150;
    summary_data += create_summary_row("Sub total", "₹" + total.toString());
    let gst = ((total * 18) / 100).toFixed(2);
    summary_data += create_summary_row(
      "GST(18%)",
      "+₹" + gst.toString(),
      "danger"
    );
    summary_data += "<hr>";
    total += parseInt(gst);
    summary_data += create_summary_row("Total", "₹" + total.toString());
  }
  summary_total.set(total);
  let summary_mount_point = document.getElementById("summary_mount_point");
  summary_mount_point.innerHTML = summary_data;
};
preapare_summary(); // call it initially

// used to handle increse or decrease the count of item on cart page
// this hadles the +/- buttons on page
var inc_dec_items = (to_inc, input_id) => {
  let item_count = document.getElementById(input_id);
  let cart = getCookie("cart");
  let cart_arr = JSON.parse(cart);
  cart_arr.forEach((data, index) => {
    if (data.name == input_id) {
      if (to_inc) {
        item_count.value = (data.no + 1).toString();
        cart_arr[index].no += 1;
      } else if (data.no > 0) {
        item_count.value = (data.no - 1).toString();
        cart_arr[index].no -= 1;
      }
    }
    setCookie("cart", JSON.stringify(cart_arr));
  });
  preapare_summary();
};

// this handle the delete button on cart page
var delete_item = (item_id) => {
  console.log(item_id);
  let item_to_delet = cart_data.filter((item) => {
    return item.name == item_id;
  });
  console.log("itme to delete", item_to_delet);
  cart_data = cart_data.filter((item) => {
    return item.name != item_id;
  });

  setCookie("cart_count", cart_data.length.toString());
  setCookie("cart", JSON.stringify(cart_data));
  load_cart(true);
  console.log("delete item..", item_id);
  item_to_delet.forEach((data) => {
    push_notification(
      data,
      `${data.name} is removed form cart.`,
      `You left with only ${getCookie("cart_count")} items in cart!!`
    );
  });
  update_cart_count();
  preapare_summary();
};

// this returns dynamic html card to feed in "Items in cart"
// setcion
var create_cart_item_card = (item, index) => {
  let item_card_templet = `
  <!-- card row  -->
  <div class="input-group mb-3">
    <span class="input-group-text">
      <img
        src="${item.img_url}"
        style="max-width: 150px; max-height: 100px; border-radius:6px;"
      />
    </span>
    <span class="form-control">
      <div class="row">
        <div class="col-lg">
        <h5>${item.name}
        </h5>
        </div>
        <div class="col">
          <h4
            class="text-muted"
            style="text-align: right"
          >
          ₹${item.price ? item.price : 1000}
          </h4>
        </div>
      </div>
      <div class="row">
        <div class="col-lg">
          <button
            class="btn btn-danger mb-1"
            onclick="delete_item('${item.name}')"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
          <sub class="text-muted ps-2">Tags:</sub>
          <sub class="rounded-pill bg-success p-1 ps-2 pe-2 text-light" style="font-size:0.7rem">${
            item.tag
          }</sub>

        </div>
        <div class="col input-group mb-3">
          <button
            class="input-group-text btn btn-secondary"
            onclick="inc_dec_items(false, '${item.name}')"
          >
            -
          </button>
          <input
            type="text"
            class="form-control"
            value="${item.no ? item.no : 1}"
            id="${item.name}"
            readonly
          />
          <button
            class="input-group-text btn btn-secondary"
            onclick="inc_dec_items(true, '${item.name}')"
          >
            +
          </button>
        </div>
      </div>
    </span>
  </div>`;
  return item_card_templet;
};

// this loads the cart items in "Items in cart"
var load_cart = (override) => {
  let item_card_group = `
    <h5 class="card-title">
    <i
      class="fa-solid fa-cart-shopping text-dark me-2"
      style="
        font-size: 2rem;
        margin-left: 0.1rem;
        vertical-align: middle;
      "
    ></i>Items in cart
    </h5>
    <hr />
  `;

  cart_data.forEach((item, index) => {
    item_card_group += create_cart_item_card(item, index);
  });
  let cards_mount_point = document.getElementById("item_card_mount_point");
  // if override id undefine or false, append the content
  override
    ? (cards_mount_point.innerHTML = item_card_group)
    : (cards_mount_point.innerHTML += item_card_group);
};

load_cart(); // call it initially

var checkout_cart = () => {
  console.log("Cart checkedout..");
  push_notification(
    { img_url: "/img/logo.png" },
    "Please login to place order!!",
    `<a href='login.html#checkout/?total=${summary_total.get()}&ref=${makeid(
      12
    )}'><b>Goto Login page.. <i class="fa-solid fa-right-to-bracket" sytle="font-size:1.4rem; align-item:right"></i></b></a>`
  );
};
