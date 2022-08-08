/**
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2020-08-07T09:21:13+10:00
 * @Filename: mp_sl_create_user_note.js
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-01-19T09:59:36+11:00
 */



var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

var zee = 0;
var role = nlapiGetRole();

if (role == 1000) {
	zee = nlapiGetUser();
} else if (role == 3) { //Administrator
	zee = 6; //test
} else if (role == 1032) { // System Support
	zee = 425904; //test-AR
}


function userNote(request, response) {
	if (request.getMethod() == "GET") {

		var params = request.getParameter('params');
		params = JSON.parse(params);
		var customer_id = params.custid;
		var reason = params.reason;
		var script_id = params.id;
		var deploy_id = params.deploy;
		var type = params.type;
		var cancel = null;
		cancel = params.cancel;

		var recCustomer = nlapiLoadRecord('customer', customer_id);

		var form = nlapiCreateForm('Create User Note: <a href="' + baseURL +
			'/app/common/entity/custjob.nl?id=' + customer_id + '">' + recCustomer.getFieldValue(
				'entityid') + '</a> ' + recCustomer.getFieldValue('companyname'));

		form.addField('custpage_customer_id', 'integer', 'Customer ID').setDisplayType(
			'hidden').setDefaultValue(customer_id);
		form.addField('custpage_suitlet', 'textarea', 'Latitude').setDisplayType(
			'hidden').setDefaultValue(script_id);
		form.addField('custpage_reason', 'textarea', 'Latitude').setDisplayType(
			'hidden').setDefaultValue(reason);
		form.addField('custpage_deploy', 'textarea', 'Latitude').setDisplayType(
			'hidden').setDefaultValue(deploy_id);
		form.addField('custpage_type', 'textarea', 'Latitude').setDisplayType(
			'hidden').setDefaultValue(type);
		form.addField('custpage_cancel', 'textarea', 'Latitude').setDisplayType(
			'hidden').setDefaultValue(cancel);

		var inlineHtml =
			'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><style>.mandatory{color:red;}</style>';

		inlineHtml +=
			'<div class="se-pre-con"></div><div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in"></div>';

		inlineHtml += '<div class="form-group container title_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6 title"><div class="input-group"><span class="input-group-addon" id="title_text">TITLE </span><input type="text" id="title" class="form-control title" /></div></div>';
		inlineHtml += '</div>';
		inlineHtml += '</div>';

		inlineHtml += '<div class="form-group container survey_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6 survey1"><div class="input-group"><span class="input-group-addon" id="survey1_text">DIRECTION </span><select id="direction" class="form-control direction" required><option></option>';
		inlineHtml += '<option value="1">INCOMING</option>';
		inlineHtml += '<option value="2">OUTGOING</option>';
		inlineHtml += '</select></div></div>';
		inlineHtml +=
			'<div class="col-xs-6 notetype"><div class="input-group"><span class="input-group-addon" id="notetype_text">NOTE TYPE </span><select id="notetype" class="form-control notetype" required><option></option>';
		inlineHtml += '<option value="3">EMAIL</option>';
		inlineHtml += '<option value="7">NOTE</option>';
		inlineHtml += '<option value="8">PHONE CALL</option>';
		inlineHtml += '</select></div></div>';

		inlineHtml += '</div>';
		inlineHtml += '</div>';

		inlineHtml += '<div class="form-group container note_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6 note"><div class="input-group"><span class="input-group-addon" id="note_text">NOTE </span><textarea id="note" class="form-control note" rows="4" cols="50"  /></textarea></div></div>';
		inlineHtml += '</div>';
		inlineHtml += '</div>';

		form.addField('preview_table', 'inlinehtml', '').setLayoutType('outsidebelow',
			'startrow').setDefaultValue(inlineHtml);


		form.addSubmitButton('Submit');
		form.addButton('back', 'Back', 'onclick_back()');
		form.addButton('back', 'Reset', 'onclick_reset()');

		form.setScript('customscript_cl_create_user_note');

		response.writePage(form);
	} else {

		var customer_id = request.getParameter('custpage_customer_id');
		var suitlet_id = request.getParameter('custpage_suitlet');
		var deploy_id = request.getParameter('custpage_deploy');
		var type = request.getParameter('custpage_type');
		var cancel = request.getParameter('custpage_cancel');

		if (!isNullorEmpty(cancel)) {
			if (isNullorEmpty(suitlet_id)) {
				response.sendRedirect('RECORD', 'customer', parseInt(customer_id), false);
			} else {
				nlapiSetRedirectURL('SUITELET', suitlet_id, deploy_id, null, null);
			}

		} else {
			var params = {
				custid: parseInt(customer_id),
				type: type
			}
			nlapiSetRedirectURL('SUITELET', suitlet_id, deploy_id, null, params);
		}


	}

}
