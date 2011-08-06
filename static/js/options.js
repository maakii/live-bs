$(document).ready(function() {
	$('html').css('background-image', localStorage.getItem('body-sticky'));
	
	if (localStorage.getItem('bg-custom') != undefined && localStorage['bg-custom'] == 'true') {
		var bg = localStorage.getItem('body-sticky');
		bg = bg.substring(4, bg.length - 1);
		$('#background-path').val(bg);
	}
	
	if (localStorage['delete-prompt-skip'] == undefined || localStorage['delete-prompt-skip'] == 'false') {
		$('#delete-prompt').attr('checked', true);
	}

	$('#background-list li').click(function() {
		localStorage.setItem('body-sticky', $(this).css('background-image'));
		localStorage.setItem('bg-custom', 'false');
		$('#background-path').val('');
		$('html').css('background-image', localStorage.getItem('body-sticky'));
	});
	
	$('#background-update').click(function() {
		var bg = $('#background-path').val();
		if (bg != '' && bg.length > 0) {
			localStorage.setItem('body-sticky', 'url(' + bg + ')');
			localStorage.setItem('bg-custom', 'true');
			$('html').css('background-image', localStorage.getItem('body-sticky'));
		}
	});
	
	$('#delete-prompt').click(function() {
		if (this.checked) {
			localStorage['delete-prompt-skip'] = 'false';
		} else {
			localStorage['delete-prompt-skip'] = 'true';
		}
	});

	$('#save').click(function() {
		location = 'main.html';
	});
});