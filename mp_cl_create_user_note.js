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

$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});

function showAlert(message) {
    $('#alert').html('<button type="button" class="close">&times;</button>' + message);
    $('#alert').show();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    // $(window).scrollTop($('#alert').offset().top);
}

$(document).on('click', '#alert .close', function(e) {
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
        var companyName = customerRecord.getFieldValue('companyname');
        var entityid = customerRecord.getFieldValue('entityid');

        var reason = nlapiGetFieldValue('custpage_reason')

        var partnerRecord = nlapiLoadRecord('partner', zee_id);
        var zee_email = partnerRecord.getFieldValue('email');

        if (isNullorEmpty($('#note').val())) {
            //112209 Chloe Young
            nlapiSendEmail(112209, zee_email, 'Cancellation: - ' + reason + ' - ' + entityid + ' ' + companyName, 'Customer Cancelled', 'raine.giderson@mailplus.com.au')
        } else {
            //112209 Chloe Young
            nlapiSendEmail(112209, zee_email, 'Cancellation: - ' + reason + ' - ' + entityid + ' ' + companyName, $('#note').val(), 'raine.giderson@mailplus.com.au')
        }



    } else {
        userNoteRecord.setFieldValue('title', 'User Note');
    }

    
    userNoteRecord.setFieldValue('entity', customer_id);
    
    userNoteRecord.setFieldValue('direction', $('#direction option:selected').val());
    userNoteRecord.setFieldValue('notetype', $('#notetype option:selected').val());
    userNoteRecord.setFieldValue('note', $('#note').val() + '\n\n Operator / Franchisee Notified');
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