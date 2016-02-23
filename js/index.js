jQuery.extend(jQuery.validator.messages, {
  required: "Este campo é obrigatório.",
	email: "Por favor insira um endereço de e-mail válido.",
});

jQuery.validator.addMethod("validEmail", function(value, element) {
    if(value == '')
        return true;
    var temp1;
    temp1 = true;
    var ind = value.indexOf('@');
    var str2=value.substr(ind+1);
    var str3=str2.substr(0,str2.indexOf('.'));
    if(str3.lastIndexOf('-')==(str3.length-1)||(str3.indexOf('-')!=str3.lastIndexOf('-')))
        return false;
    var str1=value.substr(0,ind);
    if((str1.lastIndexOf('_')==(str1.length-1))||(str1.lastIndexOf('.')==(str1.length-1))||(str1.lastIndexOf('-')==(str1.length-1)))
        return false;
    str = /(^[a-zA-Z0-9]+[\._-]{0,1})+([a-zA-Z0-9]+[_]{0,1})*@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,3})$/;
    temp1 = str.test(value);
    return temp1;
}, "Por favor insira um endereço de e-mail válido.");

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var opacity; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

var providersNames = { agendor: "Agendor", pipedrive: "Pipedrive", plug: "Plug CRM"}
var providersDescs = { 
	agendor: "O melhor CRM para você é o Agendor.<br/>Pioneira no Brasil, o Agendor é a ferramenta com custo mais acessível, além de ter um aplicativo com geolocalização e um \"mapa de clientes\", um relatório bastante interessante.",
	pipedrive: "O melhor CRM para você é o Pipedrive.<br/>Ferramenta amplamente difundida nas startups é muito simples e gostosa de mexer. Apesar de ser menos completa e cobrada em Dólar é uma ferramenta super fácil.",
	plug: "O melhor CRM para você é o Plug CRM.<br/>Simples e completo, este software de CRM Online é voltado para pequenas e médias empresas, mas apresenta mais funcionalidades, relatórios e filtros. Ideal para melhorar o relacionamento e a gestão da equipe de vendas. "
}

$(document).ready(function(){
	$('#msform').validate({
		errorElement : 'div',
		errorLabelContainer: '.errorTxt'
	});
	$('input[type="email"]').rules("add", "validEmail");
	$('input[name="r1"]').rules("add", "required");
	$('input[name="r2"]').rules("add", "required");
	$('input[name="r3"]').rules("add", "required");
	$('input[name="r4"]').rules("add", "required");
	$('input[name="r5"]').rules("add", "required");
	$('input[name="r6"]').rules("add", "required");
	$('input[name="r7"]').rules("add", "required");
	$('input[name="r8"]').rules("add", "required");
	$('input[name="r9"]').rules("add", "required");
	$('input[name="r10"]').rules("add", "required");
});

$(".next, .submit").click(function(){
	if($(this).data("restart")){
    location.reload();
  }

	if(validateFieldset($(this).parent())){
		proceedNext($(this));
	}
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			//			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			//			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			//			current_fs.css({'left': left});
			previous_fs.css({'opacity': opacity})
		},
		duration: 500,
		complete: function(){
			current_fs.hide();
			animating = false;
			//			previous_fs.css({'position': 'relative'})
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

function proceedNext(element){
	if(animating) return false;
	animating = true;

	current_fs = element.parent();
	next_fs = element.parent().next();

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			next_fs.css({'opacity': opacity});
		},
		duration: 500,
		complete: function(){
			current_fs.hide();
			//			next_fs.css({'position':'static'});
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
}

$('#msform').submit(function(event){
	event.preventDefault();
	var result = getResult();
	showResult(result);
	$.ajax({
		url: "https://script.google.com/a/macros/izap.com.br/s/AKfycbxmOh9eOVNnu8II6334VBRk0MQcd3kLquPeRVxdcFKX7xg5qkAI/exec",
		type: "post",
		data: $(this).serialize() + '&result=' + result["winner"]
	});
});

function validateFieldset(fieldset){
	var myValidator = $('#msform').validate();
	var inputs = fieldset.find(':input:not(:hidden)');
	for (var i = 0; i < inputs.length; i++) {
		if(!myValidator.element(inputs[i])){
			return false;
		}
	}
	return true;
}

function getResult(){
	// a => agendor, d => pipedrive, p => plug

	var score = { "plug" : 0, "agendor" : 0, "pipedrive" : 0 }
	$('input[type=radio]:checked').each(function(){
		if($(this).val().indexOf("a") >= 0){
			score['agendor'] += 1;
		}
		if($(this).val().indexOf("d") >= 0){
			score['pipedrive'] += 1;
		}
		if($(this).val().indexOf("p") >= 0){
			score['plug'] += 1;
		}
	});

	var max = 0;
	var winner = '';
	$.each(score, function(key,val) {
		if(val > max){
			max = val;
			winner = key;
		}else if(val == max && max > 0){
			max +=1;
			score[winner] +=1;
		}
  });
	return { winner: winner, score: score };
}

function showResult(result){
	$('#progress-plug').val(result['score']['plug']);
	$('#progress-pipedrive').val(result['score']['pipedrive']);
	$('#progress-agendor').val(result['score']['agendor']);

  // change winner image and trigger animation
  var imageId = "#" + $('.PLugWon').attr('id') + "_plug";
	$(imageId).css("background-image", "url(images/" + result['winner'] + ".svg)");
	AdobeEdge.getComposition("PLugWon").getStage().play("start");

  // change href value of winners link
  $('.link-' + result['winner']).hide();
  $('.link-winner').find('a').attr('href', $('.link-' + result['winner']).find('a').attr('href'));

  $('#winner-name').html(providersNames[result['winner']]);
  $('#winner-desc').html(providersDescs[result['winner']]);
}


// disable enter to submit
$('#msform').on('keyup keypress', function(e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});