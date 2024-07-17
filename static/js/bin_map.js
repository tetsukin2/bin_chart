$(document).ready(function () {
  function toggleBinMap(enabled) {
    if (enabled) {
      $("#bin_map_container").removeClass("disabled");
      $("#product").prop("disabled", false);
    } else {
      $("#bin_map_container").addClass("disabled");
      $("#product").prop("disabled", true);
      $("#bin_map_list").empty();
    }
  }

  toggleBinMap(false);

  $("#bin_map_container").hover(
    function () {
      if (!$(this).hasClass("disabled")) {
        $("#bin_map_dropdown").css("display", "block");
      }
    },
    function () {
      setTimeout(function () {
        if (!$("#bin_map_dropdown").is(":hover")) {
          $("#bin_map_dropdown").css("display", "none");
        }
      }, 200);
    }
  );

  $("#bin_map_dropdown").hover(
    function () {
      $(this).css("display", "block");
    },
    function () {
      $(this).css("display", "none");
    }
  );

  $("#product").change(function () {
    var productId = $(this).val();
    if (productId) {
      toggleBinMap(true);

      $("#bin_map_list").empty();
      $.get(`/bin_map/${productId}/`, function (response) {
        console.log("Bin Map Data: ", response.data);
        response.data.forEach((bin) => {
          $("#bin_map_list").append(
            `<li data-bin-id="${bin.sw_bin_no}">${bin.sw_bin_no}, ${bin.bin_name}</li>`
          );
        });

        handleBinSearch();
      }).fail(function () {
        console.log("Failed to fetch bin map data.");
      });
    } else {
      toggleBinMap(false);
    }
  });

  $(document).on("click", "#bin_map_list li", function () {
    var binId = $(this).attr("data-bin-id");
    var binName = $(this).text();

    $("#selected_bins").append(
      `<div class="selected-bin" data-bin-id="${binId}">
                 <span class="selected-bin-text">${binName}</span>
                 <span class="selected-bin-remove">x</span>
               </div>`
    );

    $(this).remove();
  });

  $(document).on("click", ".selected-bin-remove", function () {
    var binId = $(this).parent().attr("data-bin-id");
    var binName = $(this).prev(".selected-bin-text").text();

    $("#bin_map_list").append(`<li data-bin-id="${binId}">${binName}</li>`);

    $(this).parent().remove();
  });

  function handleBinSearch() {
    $("#bin_search").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#bin_map_list li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  }
});
