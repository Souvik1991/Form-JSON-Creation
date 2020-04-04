This plugin will help to create a JSON file along with field name and it's label.

Author : Souvik Maity (https://github.com/Souvik1991/)

Rules : 

```
    selector:{closest:'', find:''},
    prefix:'',
    suffix:'',
    skipFields:[]
```
Output : 
```
{
  'Field Name*':{'label':'Field Label*'}
}
``` 
// * data will be created

JSON Creation Procedure :
1) Simple way
```
  $('selector').createJSON();
```
2) Declaration with prefix and suffix
```
  $('selector').createJSON({
    prefix:'Your Prefix', 
    suffix:'Your Suffix'
  });
```
3) Declaration Skip Fields (basically the name of the fields)
```
  $('selector').createJSON({
    skipFields:['field1', 'field2', 'field3', ...] // Name of the fields
  });
```
4) Declaration with custom selector
```
  $('selector').createJSON({
    selector:{
      closest:'Closest Selector', 
      find:'Find Element Selector'
    }
  });
```
5) Declaration with callback option
```
  $('selector').createJSON(function(data){ 
    console.log(data); 
  });

or,

  $('selector').createJSON(
    {rules}, 
    function(data){ 
      console.log(data); 
    }
  );
```

6) Declaration with complex selection and all type of available options
```
  $('selector').createJSON({
    selector:{
      closest:'Closest Selector', 
      find:'Find Element Selector'
    }, 
    prefix:'Your Prefix', 
    suffix:'Your Suffix', 
    skipFields:['field1', 'field2', 'field3', ...]
  }, 
  function(data){ 
    console.log(data);
  });
```

Label rule :
1) Rule should not content any special character like <code>!@#$^&%*+=[]{}|:<>?,."</code>
2) First it will search for the label defined for that fields by using <code>'for="field Id"'</code>, 
If it does not find that then first it will look closest 'label' if it doesnot find that then it will look for sibling 'label', 
then it will look for sibling span then it will go for parent 'td' and it's prev 'td', if not found then it will go for parent 'div' and it's prev 'div', 
if that also not get satisfied then it will look for sibling 'p' and if that also not match then it will go for last step 3.
3) If no condition matched then the name of the field will be selected and from the fiels name the '-' and '_' sign will be removed and a space will be added and if there is a field name like "thisIsField" then the label will be "This Is Field".
