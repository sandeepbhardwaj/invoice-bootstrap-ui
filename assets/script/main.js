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
        type="number"
        name="sr_no"
        required
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="text"
        placeholder="CFS/ CWC CHARGES"
        required
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        name="quantity"
        required
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        name="bm_wt_rate"
        required
      />
    </td>
    <td>
      <select
        class="form-select form-select-sm"
        name="currency_symbol"
        required
      >
        <option selected value="INR">INR</option>
        <option value="RMB">RMB</option>
      </select>
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="text"
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        name="exchange_rate"
        required
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="non_taxable_amount"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="taxable_amount"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="cgst_percentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="cgst_tax"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="sgst_percentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="sgst_tax"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="igst_percentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="igst_tax"
        readonly
      />
    </td>
    <td class="bg-success-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="total_gst_amount"
        readonly
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

/*
  update total_taxable on input change
*/
$("#creditNoteTbl").on("change", "input", function () {
  var quantity = 0;
  var bm_wt_rate = 0;
  var non_taxable_amount = 0;
  var exchange_rate = 0;
  var cgst_percentage = 0;
  var sgst_percentage = 0;
  var igst_percentage = 0;

  var cgst_tax = 0;
  var sgst_tax = 0;
  var igst_tax = 0;

  $("#creditNoteTbl tbody tr")
    .children("td")
    .find("input")
    .each((index, td) => {
      var fieldName = td.name;
      switch (fieldName) {
        case "quantity": {
          quantity = td.value;
          break;
        }

        case "bm_wt_rate": {
          bm_wt_rate = td.value;
          break;
        }

        case "exchange_rate": {
          exchange_rate = td.value;
          break;
        }

        case "non_taxable_amount": {
          non_taxable_amount = td.value;
          break;
        }

        case "taxable_amount": {
          td.value = quantity * bm_wt_rate * exchange_rate;
          break;
        }

        case "cgst_percentage": {
          cgst_percentage = td.value;
          break;
        }

        case "sgst_percentage": {
          sgst_percentage = td.value;
          break;
        }

        case "igst_percentage": {
          igst_percentage = td.value;
          break;
        }

        case "cgst_tax": {
          cgst_tax = (
            Math.round(
              quantity * bm_wt_rate * exchange_rate * cgst_percentage
            ) / 100
          ).toFixed(2);

          td.value = cgst_tax;
          break;
        }

        case "sgst_tax": {
          sgst_tax = (
            Math.round(
              quantity * bm_wt_rate * exchange_rate * sgst_percentage
            ) / 100
          ).toFixed(2);

          td.value = sgst_tax;

          break;
        }

        case "igst_tax": {
          igst_tax = (
            Math.round(
              quantity * bm_wt_rate * exchange_rate * igst_percentage
            ) / 100
          ).toFixed(2);

          td.value = igst_tax;
          break;
        }

        case "total_gst_amount": {
          let totalGst =
            parseFloat(cgst_tax) + parseFloat(sgst_tax) + parseFloat(igst_tax);

          td.value = (Math.round(totalGst * 100) / 100).toFixed(2);
          break;
        }
      }
    });

  update_total_taxable();
});

/*
  Method to update total_taxable by calculating all rows
*/
var update_total_taxable = () => {
  var total_taxable = 0;
  var non_taxable_amount = 0;
  var gst_col_total = 0;
  var sgst_col_total = 0;
  var igst_col_total = 0;

  var total_gst_amount = 0;

  $("#creditNoteTbl tbody tr")
    .children("td")
    .find("input")
    .each((index, td) => {
      var fieldName = td.name;
      switch (fieldName) {
        case "taxable_amount": {
          total_taxable = total_taxable + parseFloat(td.value);
          break;
        }
        case "non_taxable_amount": {
          non_taxable_amount = non_taxable_amount + parseFloat(td.value);
          break;
        }
        case "cgst_tax": {
          gst_col_total = gst_col_total + parseFloat(td.value);
          break;
        }
        case "sgst_tax": {
          sgst_col_total = sgst_col_total + parseFloat(td.value);
          break;
        }
        case "igst_tax": {
          igst_col_total = igst_col_total + parseFloat(td.value);
          break;
        }
        case "total_gst_amount": {
          total_gst_amount = total_gst_amount + parseFloat(td.value);
          break;
        }
      }
    });

  non_taxable_amount = isNaN(non_taxable_amount) ? 0 : non_taxable_amount;
  total_taxable = isNaN(total_taxable) ? 0 : total_taxable;
  total_gst_amount = isNaN(total_gst_amount) ? 0 : total_gst_amount;

  $("#final_total_gst_amount").html(gst_col_total);
  $("#final_total_sgst_amount").html(sgst_col_total);
  $("#final_total_igst_amount").html(igst_col_total);

  //sum of gst+sgst+igst
  $("#final_all_gst_amount").html(
    (Math.round(total_gst_amount * 100) / 100).toFixed(2)
  );

  $("#final_total_taxable").html(
    (Math.round(total_taxable * 100) / 100).toFixed(2)
  );
  $("#final_non_taxable_amount").html(
    (Math.round(non_taxable_amount * 100) / 100).toFixed(2)
  );

  let grand_total = (
    Math.round((total_taxable + non_taxable_amount + total_gst_amount) * 100) /
    100
  ).toFixed(2);

  //let grand_total = total_taxable + non_taxable_amount + total_gst_amount;
  $("#grand_total").html(grand_total);
};
