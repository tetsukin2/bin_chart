$(document).ready(function () {
  var customerData = JSON.parse(
    document.getElementById("customer-data").textContent
  );
  console.log("Customer Data: ", customerData);

  function populateProducts(customer) {
    $("#product")
      .empty()
      .append('<option value="" selected disabled>Select product</option>');
    $("#bin_map_list").empty();

    var customerObj = customerData.find((item) => item.customer === customer);
    console.log("Selected Customer Object: ", customerObj);

    if (customerObj) {
      var products = customerObj.products;
      products.forEach((product) => {
        var parts = product.split(", ");
        console.log("Adding Product: ", parts[1], " with ID: ", parts[0]);
        $("#product").append(new Option(parts[1], parts[0]));
      });
      $("#product").prop("disabled", false);
      $("#product").siblings(".select-search").prop("disabled", false);
    } else {
      $("#product").prop("disabled", true);
      $("#product").siblings(".select-search").prop("disabled", true);
    }
  }

  $("#product")
    .append('<option value="" selected disabled>Select product</option>')
    .prop("disabled", true);

  $("#customer").change(function () {
    var customer = $(this).val();
    console.log("Customer selected: ", customer);
    populateProducts(customer);
  });

  function filterOptions(selectElement, input) {
    var options = selectElement.find("option");

    options.each(function () {
      var optionText = $(this).text().toLowerCase();
      var visible = optionText.indexOf(input.toLowerCase()) !== -1;
      $(this).toggle(visible);
    });
  }

  $(".select-with-search").each(function () {
    var select = $(this);
    var wrapper = select
      .closest(".col-1-select")
      .find(".select-with-search-wrapper");

    var searchInput = wrapper.find(".select-search");
    if (!searchInput.length) {
      searchInput = $(
        '<input type="text" class="select-search" placeholder="Search..." disabled>'
      );
      wrapper.prepend(searchInput);
    }

    searchInput.on("input", function () {
      var input = $(this).val();
      filterOptions(select, input);
    });
  });
});
