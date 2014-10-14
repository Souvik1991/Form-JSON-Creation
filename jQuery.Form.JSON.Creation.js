/*
This plugin will help to create a JSON file along with field name and it's label.
Author : Souvik Maity.

Rules : selector:{closest:'', find:''},
		prefix:'',
		suffix:'',
		skipFields:[]
Out put : {'Field Name*':{'label':'Field Label*'}} // * data will be created

JSON Creation Procedure :
1) 	$('selector').createJSON(); // Simple way
2)	$('selector').createJSON({prefix:'Your Prefix', suffix:'Your Suffix'}); // Declaration with prefix and suffix
3)	$('selector').createJSON({skipFields:['field1', 'field2', 'field3', ...]}); // Declaration Skip Fields
4)	$('selector').createJSON({selector:{closest:'Closest Selector', find:'Find Element Selector'}}); // Declaration with custom selector
5)	$('selector').createJSON(function(data){ console.log(data); }); // Declaration with callback option
	or,
	$('selector').createJSON({rules}, function(data){ console.log(data); });
6) 	$('selector').createJSON({selector:{closest:'Closest Selector', find:'Find Element Selector'}, prefix:'Your Prefix', suffix:'Your Suffix', skipFields:['field1', 'field2', 'field3', ...]}, function(data){ console.log(data); }); // Declaration with complex selection and all type of available options

Label rule :
1) Rule should not content any special character like !@#$^&%*+=[]{}|:<>?,."
2) First it will search for the label defined for that fields by using 'for="field Id"', If it does not find that then first it will look closest 'label' if it doesnot find that then it will look for sibling 'label', then it will look for sibling span then it will go for parent 'td' and it's prev 'td', if not found then it will go for parent 'div' and it's prev 'div', if that also not get satisfied then it will look for sibling 'p' and if that also not match then it will go for last step 3.
3) If no condition matched then the name of the field will be selected and from the fiels name the '-' and '_' sign will be removed and a space will be added and if there is a field name like "thisIsField" then the label will be "This Is Field".
3)
*/

(function ( $ ) {
	var tempJSON; // globally declared variable to accessible by all the method in this function
	//main function decide which function to call and with which attributes and also decide how to return the data. 
    $.fn.createJSON = function(rules, callback) {
    	tempJSON = {};
    	if(rules === undefined || typeof(rules) === 'function') this._init(false);
       	else{
        	if(rules.selector !== undefined) this._init(true, rules);
        	else this._init(false, rules);
        }	
        if(callback !== undefined && typeof(callback) === 'function') callback(tempJSON);
        else if(rules !== undefined && typeof(rules) === 'function') rules(tempJSON);
        else return tempJSON;
    };
    //loop by selecting all the input fields present under the selected fields except those fields which are present in skipFields array
    $.fn._init = function(withRule, rules) { 
    	this.find(':input').each(function(i, e){
    		var This = $(this);
    		if(e.type !== 'hidden'){
	        	if(rules !== undefined && rules.skipFields !== undefined && (typeof(skipFields) === 'object' || typeof(skipFields) === 'array')){
	        		if($.inArray(This.attr('name'), rules.skipFields) == -1){
	        			if(withRule) This.findLabelInNormalWay(rules);
	        			else This.otherWay(rules);
	        		}
	        	}
	        	else{
	        		if(withRule) This.findLabelInNormalWay(rules);
	        		else This.otherWay(rules);
	        	}
        	}
        });
    }
    //find the label for the field if it is not defined in proper way
    $.fn.otherWay = function(rules){
    	var This = this;
    	if(This.attr('id') != undefined && ($("[for="+This.attr('id')+"]").length != 0 || $("[for="+This.attr('name')+"]").length != 0)){
			(rules !== undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInNormalWay(rules) : This.findLabelInNormalWay();
		}
    	else if(This.closest('td').length != 0 || This.closest('div').length != 0){
    		if(This.closest('label').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('label', rules) : This.findLabelInOtherWay('label');
    		else if(This.siblings('label').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('siblingLabel', rules) : This.findLabelInOtherWay('siblingLabel');
    		else if(This.siblings('span').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('siblingSpan', rules) : This.findLabelInOtherWay('siblingSpan');
    		else if(This.parent('td').prev('td').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('td', rules) : This.findLabelInOtherWay('td');
    		else if(This.parent('div').prev('div').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('div', rules) : This.findLabelInOtherWay('div');
    		else if(This.siblings('p').length != 0) (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('siblingP', rules) : This.findLabelInOtherWay('siblingP');
    		else (rules !==undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('ownName', rules) : This.findLabelInOtherWay('ownName');
    	}
    	else (rules !== undefined && (rules.prefix !== undefined || rules.suffix !== undefined)) ? This.findLabelInOtherWay('ownName', rules) : This.findLabelInOtherWay('ownName');
    }
    //find the label for the field if it is defined in proper way or a custom rule has been defined
    $.fn.findLabelInNormalWay = function(rules) {
    	if(tempJSON[this.attr('name')] == undefined){
	    	var prefix = (rules !== undefined && rules.prefix !== undefined) ? rules.prefix : '';
	    	var suffix = (rules !== undefined && rules.suffix !== undefined) ? rules.suffix : '';
	    	prefix = (Object.keys(tempJSON).length + 1) + '. ' + prefix;
	    	if(rules === undefined || rules.selector === undefined){
	    		tempJSON[this.attr('name')] = {'label' : $("[for="+this.attr('id')+"]").length != 0 ? prefix + $("[for="+this.attr('id')+"]").text().toTitleCase() + suffix : ($("[for="+this.attr('name')+"]").length != 0 ? prefix + $("[for="+this.attr('name')+"]").text().toTitleCase() + suffix : null)};
	    	}
	    	else{
	    		if(rules.selector.closest !== undefined && rules.selector.find !== undefined){ 
	    			var selected = this.closest($.trim(rules.selector.closest)).find($.trim(rules.selector.find));
	    			if(selected.length != 0) tempJSON[this.attr('name')] = {'label' : prefix + selected.text().toTitleCase() + suffix}
	    			else this.otherWay(rules);
	        	}
	        	else if(rules.selector.closest !== undefined){
	        		var selected = this.closest($.trim(rules.selector.closest));
	        		if(selected.length != 0) tempJSON[this.attr('name')] = {'label' : prefix + selected.text().toTitleCase() + suffix}
	        		else this.otherWay(rules);
	       		}
	       		else if(rules.selector.find !== undefined){
	       			var selected = this.find($.trim(rules.selector.find));
	        		if(selected.length != 0) tempJSON[this.attr('name')] = {'label' : prefix + selected.text().toTitleCase() + suffix}
	        		else this.otherWay(rules);
	       		}
	       		else tempJSON[this.attr('name')] = {'label' : null};
	    	}
    	}
    }
    //here the rule for otherWay function is defined find the label and insert into json file
    $.fn.findLabelInOtherWay = function(type, rules) {
    	if(tempJSON[this.attr('name')] == undefined){
    		var prefix = (rules !== undefined) ? rules.prefix : '';
    		var suffix = (rules !== undefined) ? rules.suffix : '';
    		prefix = (Object.keys(tempJSON).length + 1) + '. ' + prefix;
	    	switch($.trim(type)){
	    		case 'td':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.closest('td').prev('td').text().toTitleCase() + suffix};
	    		break;
	    		case 'div':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.parent('div').prev('div').text().toTitleCase() + suffix};
	    		break;
	    		case 'label':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.closest('label').text().toTitleCase() + suffix};
	    		break;
	    		case 'siblingLabel':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.siblings('label').text().toTitleCase() + suffix};
	    		break;
	    		case 'siblingP':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.siblings('p').text().toTitleCase() + suffix};
	    		break;
	    		case 'siblingSpan':
	    			tempJSON[this.attr('name')] = {'label' : prefix + this.siblings('span').text().toTitleCase() + suffix};
	    		break;
	    		case 'ownName':
	    			var temp = '';
	    			var name = this.attr('name')
	    			for(i=0; i<name.length; i++) if(name[i] == name[i].toUpperCase()) temp = temp + ' ' + name[i]; else temp = temp + name[i];
	    			temp = temp.replace(new RegExp("\\_", 'gi'), ' ').replace(new RegExp("\\-", 'gi'), ' ').toTitleCase(); 
	    			tempJSON[this.attr('name')] = {'label' : prefix + temp + suffix};
	    		break;
	    		default:
	    			tempJSON[this.attr('name')] = {'label' : null};
	    		break;
	    	}
    	}
    }
    //Properly set the label text and change it according to rule.
    String.prototype.toTitleCase = function() {
		if (!this.length) return "";
		else{
			var lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
			var remove = ['<br>', '<br/>', '< br/>', '<br/ >', '<br />'];
			var str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();	});
			for (i = 0, j = lowers.length; i < j; i++) str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt){ return txt.toLowerCase(); });
			for (i = 0, j = remove.length; i < j; i++) str = str.replace(new RegExp('\\s' + remove[i] + '\\s', 'g'), '');
			var specialChars = "!@#$^&%*+=[]{}|:<>?,.\"";
			for (var i = 0; i < specialChars.length; i++) str = str.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
			return $.trim(str.replace(/\s{2,}/g, ' '));
		}	
	}
}( jQuery ));