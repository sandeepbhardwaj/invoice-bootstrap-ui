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
        name="srNo"
        required
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="text"
        placeholder="CFS/ CWC CHARGES"
        name="cwcCharges"
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
        name="bmWtRate"
        required
      />
    </td>
    <td>
      <select
        class="form-select form-select-sm"
        name="currencySymbol"
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
        name="exchangeRate"
        required
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="nonTaxableAmount"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="taxableAmount"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="cgstPercentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="cgstTax"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="sgstPercentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="sgstTax"
        readonly
      />
    </td>
    <td>
      <input
        class="form-control form-control-sm"
        type="number"
        min="0"
        name="igstPercentage"
      />
    </td>
    <td class="bg-info-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="igstTax"
        readonly
      />
    </td>
    <td class="bg-success-subtle">
      <input
        class="form-control form-control-sm"
        type="text"
        name="totalGstAmount"
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
  Single Row update
  update total_taxable on input change
*/
$("#creditNoteTbl").on("change", "input", function () {
  var quantity = 0;
  var bmWtRate = 0;
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

        case "bmWtRate": {
          bmWtRate = td.value;
          break;
        }

        case "exchangeRate": {
          exchange_rate = td.value;
          break;
        }

        case "nonTaxableAmount": {
          non_taxable_amount = td.value;
          break;
        }

        case "taxableAmount": {
          td.value = quantity * bmWtRate * exchange_rate;
          break;
        }

        case "cgstPercentage": {
          cgst_percentage = td.value;
          break;
        }

        case "sgstPercentage": {
          sgst_percentage = td.value;
          break;
        }

        case "igstPercentage": {
          igst_percentage = td.value;
          break;
        }

        case "cgstTax": {
          cgst_tax = (
            Math.round(quantity * bmWtRate * exchange_rate * cgst_percentage) /
            100
          ).toFixed(2);

          td.value = cgst_tax;
          break;
        }

        case "sgstTax": {
          sgst_tax = (
            Math.round(quantity * bmWtRate * exchange_rate * sgst_percentage) /
            100
          ).toFixed(2);

          td.value = sgst_tax;

          break;
        }

        case "igstTax": {
          igst_tax = (
            Math.round(quantity * bmWtRate * exchange_rate * igst_percentage) /
            100
          ).toFixed(2);

          td.value = igst_tax;
          break;
        }

        case "totalGstAmount": {
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
  Footer row update
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
        case "taxableAmount": {
          total_taxable = total_taxable + parseFloat(td.value);
          break;
        }
        case "nonTaxableAmount": {
          non_taxable_amount = non_taxable_amount + parseFloat(td.value);
          break;
        }
        case "cgstTax": {
          gst_col_total = gst_col_total + parseFloat(td.value);
          break;
        }
        case "sgstTax": {
          sgst_col_total = sgst_col_total + parseFloat(td.value);
          break;
        }
        case "igstTax": {
          igst_col_total = igst_col_total + parseFloat(td.value);
          break;
        }
        case "totalGstAmount": {
          total_gst_amount = total_gst_amount + parseFloat(td.value);
          break;
        }
      }
    });

  non_taxable_amount = isNaN(non_taxable_amount) ? 0 : non_taxable_amount;
  total_taxable = isNaN(total_taxable) ? 0 : total_taxable;
  total_gst_amount = isNaN(total_gst_amount) ? 0 : total_gst_amount;

  $("#finalTotalGstAmount").html(gst_col_total);
  $("#finalTotalSgstAmount").html(sgst_col_total);
  $("#finalTotalIgstAmount").html(igst_col_total);

  //sum of gst+sgst+igst
  $("#finalAllGstAmount").html(
    (Math.round(total_gst_amount * 100) / 100).toFixed(2)
  );

  $("#finalTotalTaxable").html(
    (Math.round(total_taxable * 100) / 100).toFixed(2)
  );
  $("#finalNonTaxableAmount").html(
    (Math.round(non_taxable_amount * 100) / 100).toFixed(2)
  );

  let grand_total = (
    Math.round((total_taxable + non_taxable_amount + total_gst_amount) * 100) /
    100
  ).toFixed(2);

  //let grand_total = total_taxable + non_taxable_amount + total_gst_amount;
  $("#grandTotal").html(grand_total);
};

//form submit
$("#createInvoice").click(function (event) {
  /*var forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          //make ajax call here
        }

        form.classList.add("was-validated");
      },
      false
    );
  });*/

  var formData = {
    clientName: $("#clientName").val(),
    clientGSTIN: $("#clientGSTIN").val(),
    clientAddress: $("#clientAddress").val(),
    creditNoteNo: $("#creditNoteNo").val(),
    jobNo: $("#jobNo").val(),
    mblNo: $("#mblNo").val(),
    hblNo: $("#hblNo").val(),
    shippingLine: $("#shippingLine").val(),
    flightVslNo: $("#flightVslNo").val(),

    invoiceDetailLines: [],
    invoiceFooterLine: {},
    grandTotal: $("#grandTotal").val(),
  };

  //loop through each detailLine
  $("#creditNoteTbl > tbody > tr").each((index, tr) => {
    var arr = $(tr).find("input");

    const map = new Map();
    arr.each((index, input) => {
      map.set(input.name, input.value);
    });

    const obj = Object.fromEntries(map);
    console.log(obj);
    formData.invoiceDetailLines.push(obj);
  });

  $("#creditNoteTbl > tfoot > tr").each((index, tr) => {
    var arr = $(tr).find("span");

    const map = new Map();
    arr[0].each((index, span) => {
      map.set(span.id, span.innerText);
    });

    const obj = Object.fromEntries(map);
    console.log(obj);
    formData.invoiceFooterLine = obj;
  });

  event.preventDefault();

  console.log(formData);

  // $.ajax({
  //   type: "POST",
  //   url: "/pages/test/",
  //   data: {
  //     id: $(this).val(), // < note use of 'this' here
  //     access_token: $("#access_token").val(),
  //   },
  //   success: function (result) {
  //     alert("ok");
  //   },
  //   error: function (result) {
  //     alert("error");
  //   },
  // });
});
