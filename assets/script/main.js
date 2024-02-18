// Add row
$("#add-row").click(function () {
  //append the controls in the row
  var tblRow = `
                        <tr>
                          <td>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value=""
                              name="record"
                            />
                          </td>
                          <td class="text-center">
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="CFS/ CWC CHARGES"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              name="quantity"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              name="bm_wt_rate"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="INR"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm te"
                              type="text"
                              placeholder="996759"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="1.00"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              name="taxable_amount"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="18"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="8,505.00"
                            />
                          </td>
                          <td>
                            <input
                              class="form-control form-control-sm"
                              type="text"
                              placeholder="8,505.00"
                            />
                          </td>
                        </tr>
  `;

  $("#creditNoteTbl tbody").append(tblRow);
});

// Find and remove selected table rows
$("#delete-row").click(function () {
  $("#creditNoteTbl tbody")
    .find('input[name="record"]')
    .each(function () {
      if ($(this).is(":checked")) {
        $(this).parents("tr").remove();
      }
    });

  //update total after row remove
  update_total_taxable();
});

$("#creditNoteTbl").on("change", "input", function () {
  let quantity;
  let bm_wt_rate;

  $("#creditNoteTbl tbody tr")
    .children("td")
    .find("input")
    .each((index, td) => {
      //----------------------------
      if (td.name == "quantity") {
        quantity = td.value;
      }

      if (td.name == "bm_wt_rate") {
        bm_wt_rate = td.value;
      }

      if (td.name == "taxable_amount") {
        var taxable_amount = quantity * bm_wt_rate;

        td.value = taxable_amount;
        total_taxable = +taxable_amount;
      }
      //----------------------------
    });

  update_total_taxable();
});

var update_total_taxable = () => {
  var total_taxable = 0;

  $("#creditNoteTbl tbody tr")
    .children("td")
    .find("input")
    .each((index, td) => {
      if (td.name == "taxable_amount") {
        total_taxable = total_taxable + parseInt(td.value);
      }
    });

  $("#total_taxable").html(total_taxable);
};
