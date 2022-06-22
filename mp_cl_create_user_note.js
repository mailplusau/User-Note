/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-09-15T17:00:25+10:00
 * @Filename: mp_cl_create_user_note.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-05-27T09:56:22+10:00
 */



var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
  baseURL = 'https://system.sandbox.netsuite.com';
}

var user = 0;
var role = nlapiGetRole();

if (role == 1000) {
  zee = nlapiGetUser();
} else if (role == 3) { //Administrator
  zee = 6; //test
} else if (role == 1032) { // System Support
  zee = 425904; //test-AR
}

$(window).load(function () {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");;
});

function showAlert(message) {
  $('#alert').html('<button type="button" class="close">&times;</button>' +
    message);
  $('#alert').show();
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
  // setTimeout(function() {
  //     $("#alert .close").trigger('click');
  // }, 100000);
  // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function (e) {
  $(this).parent().hide();
});

function pageInit() {
  $('#alert').hide();
}

function pageInit() {
  $('#alert').hide();
}

function saveRecord() {

  var customer_id = parseInt(nlapiGetFieldValue('custpage_customer_id'));

  var userNoteRecord = nlapiCreateRecord('note');

  if (nlapiGetFieldValue('custpage_cancel') == 'true') {
    userNoteRecord.setFieldValue('title', 'Cancel');
    var customerRecord = nlapiLoadRecord('customer', customer_id);
    var zee_id = customerRecord.getFieldValue('partner');
    // var zee_text = customerRecord.getFieldText('partner');
    var companyName = customerRecord.getFieldValue('companyname');
    var entityid = customerRecord.getFieldValue('entityid');
    var cancellation_date = customerRecord.getFieldValue('custentity13');

    var reason = nlapiGetFieldValue('custpage_reason')
    var cancel = nlapiGetFieldValue('custpage_cancel')

    var partnerRecord = nlapiLoadRecord('partner', zee_id);
    var zee_email = partnerRecord.getFieldValue('email');

    if (isNullorEmpty($('#note').val())) {
      //112209 Chloe Young
      if (reason != 'Change of Entity') {
        nlapiSendEmail(112209, zee_email, 'Cancellation: - ' + entityid + ' ' +
          companyName, 'Customer Cancelled effective ' + cancellation_date +
        '</br> If an early invoice needs to be raised for the above mentioned customer, please contact accounts </br>', [
          'raine.giderson@mailplus.com.au',
          'fiona.harrison@mailplus.com.au',
          'turkan.koc@mailplus.com.au',
          'popie.popie@mailplus.com.au'
        ]);
      }
    } else {
      //112209 Chloe Young
      if (reason != 'Change of Entity') {
        nlapiSendEmail(112209, zee_email, 'Cancellation: - ' + entityid + ' ' +
          companyName + ' effective ' + cancellation_date,
          'If an early invoice needs to be raised for the above mentioned customer, please contact accounts </br></br>' +
          $('#note').val(), ['raine.giderson@mailplus.com.au',
          'fiona.harrison@mailplus.com.au',
          'turkan.koc@mailplus.com.au',
          'popie.popie@mailplus.com.au'
        ]);
      }
    }

    if (reason != 'Change of Entity' && reason != 'Territory Transfer') {
      nlapiSendEmail(696992, [
        'raine.giderson@mailplus.com.au',
        'ankith.ravindran@mailplus.com.au',
        'fiona.harrison@mailplus.com.au'
      ],
        'Deactivate Customer', ' Customer NS ID: ' + customer_id +
        '</br> Customer: ' + entityid + ' ' + companyName +
        '</br> Customer Franchisee NS ID: ' + zee_id +
        '</br> Cancellation Date: ' + cancellation_date)
    }



  } else {
    if (isNullorEmpty($('#title').val())) {
      userNoteRecord.setFieldValue('title', $('#title').val());
    } else {
      userNoteRecord.setFieldValue('title', 'User Note');
    }

  }


  userNoteRecord.setFieldValue('entity', customer_id);

  userNoteRecord.setFieldValue('direction', $('#direction option:selected').val());
  userNoteRecord.setFieldValue('notetype', $('#notetype option:selected').val());
  if (cancel == 'false' || cancel == false) {
    userNoteRecord.setFieldValue('note', $('#note').val());
  } else {
    userNoteRecord.setFieldValue('note', $('#note').val() +
      '\n\n Operator / Franchisee Notified');
  }

  userNoteRecord.setFieldValue('author', nlapiGetUser());
  userNoteRecord.setFieldValue('notedate', getDate());



  nlapiSubmitRecord(userNoteRecord);

  return true;


}

function getDate() {
  var date = new Date();
  // if (date.getHours() > 6) {
  //     date = nlapiAddDays(date, 1);
  // }
  date = nlapiDateToString(date);
  return date;
}
